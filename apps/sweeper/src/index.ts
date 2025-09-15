import { prisma } from "@repo/db";
import { Kafka } from "kafkajs";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });
console.log("kafka brooker" + process.env.KAFKA_BROKER);

const kafka = new Kafka({
  clientId: "outbox-sweeper",
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"] //make it process.kafka_brooker
});

const TOPIC_NAME = "zap-events";

// ✅ Simple topic creation function
async function createKafkaTopic() {
  try {
    const admin = kafka.admin();
    await admin.connect();
    
    const existingTopics = await admin.listTopics();
    if (!existingTopics.includes(TOPIC_NAME)) {
      await admin.createTopics({
        topics: [{
          topic: TOPIC_NAME,
          numPartitions: 1,
          replicationFactor: 1
        }]
      });
      console.log('✅ Created topic:', TOPIC_NAME);
    }
    
    await admin.disconnect();
  } catch (error) {
    console.log('⚠️ Topic creation skipped (probably already exists)');
  }
}

async function main() {
  // ✅ Ensure topic exists before starting
  await createKafkaTopic();
  
  const producer = kafka.producer();
  await producer.connect();
  
  while(true) {
    const pendingRows = await prisma.zapRunOutbox.findMany({
      where: {},
      take: 10
    });

    if (pendingRows.length > 0) {
      await producer.send({
        topic: TOPIC_NAME,
        messages: pendingRows.map(r => ({
          value: JSON.stringify({
            zapRunId: r.zapRunId,
            stage: 0
          })
        }))
      });

      await prisma.zapRunOutbox.deleteMany({
        where: {
          id: { in: pendingRows.map(x => x.id) }
        }
      });
    }
    
    await new Promise(resolve => setTimeout(resolve, 5000)); // 5 sec delay
  }   
}

main().catch(console.error);