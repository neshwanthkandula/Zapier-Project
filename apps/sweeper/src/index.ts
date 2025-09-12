import { prisma } from "@repo/db";
import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "outbox-sweeper",
  brokers: ["localhost:9092"]
})

const TOPIC_NAME = "zap-events"
async function main(){
    const producer = kafka.producer();
    await producer.connect();
    while(true){
        const pendingRows = await prisma.zapRunOutbox.findMany({
            where:{},
            take: 10
        })

        
        producer.send({
            topic: TOPIC_NAME,
            messages: pendingRows.map(r=>({
                value : JSON.stringify({
                    zapRunId: r.zapRunId,
                    stage: 0
                })
            }))
        })

        await prisma.zapRunOutbox.deleteMany({
            where: {
                id: {
                    in: pendingRows.map(x => x.id)
                }
            }
        })
    }   
}

main()
