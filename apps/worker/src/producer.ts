import { prisma } from "@repo/db";
import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "outbox-sweeper",
  brokers: ["localhost:9092"]
})

const TOPIC_NAME = "zap-events"

export async  function publishToKafka( zapRunId : string , stage : string ){
    const producer = kafka.producer();
    await producer.connect();

    producer.send({
        topic: TOPIC_NAME,
        messages: [{
            value: JSON.stringify({
                zapRunId: zapRunId,
                stage: stage+1
            })
        }]
    })
}
