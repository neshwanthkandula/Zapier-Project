
import { Kafka } from "kafkajs";
import { prisma } from "@repo/db";
import { publishToKafka } from "../src/producer"
import { ParseData } from "./parse";
import { sendEmail } from "./Sendemail"
import { sendWebhook } from "./myprojecthook";
import { json } from "zod";

const kafka = new Kafka({
  clientId: "outbox-sweeper",
  brokers: ["localhost:9092"]
})


const TOPIC_NAME = "zap-events"
async function main(){
    const consumer = kafka.consumer({ groupId :"main-worker"});
    await consumer.connect();
    consumer.on(consumer.events.CONNECT, () => {
        console.log("✅ Consumer connected");
    });
    consumer.on(consumer.events.CRASH, e => {
       console.error("💥 Consumer crashed", e.payload.error);
    });

    await consumer.subscribe({ topic : TOPIC_NAME, fromBeginning : true})
    await consumer.run({
        autoCommit : false,
        eachMessage : async({ topic , partition, message})=>{
            console.log({
                partition,
                offset : message.offset,
                value : message.value?.toString()
            })

            if (!message.value?.toString()) { //data from kafka
                return;
            }

            const parsedValue = JSON.parse(message.value?.toString());
            const zapRunId = parsedValue.zapRunId;
            const stage = parsedValue.stage ;

            const zapRunDetails = await prisma.zapRun.findFirst({
            where: {
              id: zapRunId
            },
            include: {
              zap: {
                include: {
                  actions: {
                    include: {
                      type: true
                    }
                  }
                }
              },
            }
          });
          const currentAction = zapRunDetails?.zap.actions.find(x => x.sortingOrder === stage);

          if (!currentAction || !zapRunDetails) {
            console.log("Current action not found?");
            return;
          }

          const rawMetadata = zapRunDetails.metadata;

        const zapRunMetadata: Record<string, any> =
          typeof rawMetadata === "object" && rawMetadata !== null
            ? rawMetadata as Record<string, any>
            : {};

          //Do actions
          //we need to know type of action & metadata
          console.log(currentAction.type.name)
          const metadata = currentAction.metadata as Record<string, any>; //what a trick .......................
          if(currentAction.type.name === "EMAIL"){
            console.log(zapRunMetadata, metadata)
            if (!metadata.emailId || !metadata.body || !zapRunMetadata) {

              console.error("Missing metadata for email action", metadata);
              return;
            }

            console.log(zapRunMetadata)

           
            const usernameto = ParseData(metadata.emailId, zapRunMetadata ); //filters
            const userbody = ParseData(metadata.body, zapRunMetadata )
            sendEmail(usernameto, userbody);
          }else{
            console.log(zapRunMetadata, metadata)
            if (!metadata.url || !metadata.data || !metadata.cookie ) {

              console.error("Missing metadata for project action ***", metadata);
              return;
            }

            if(!zapRunMetadata){
              console.error("Missing metadata for project action *** zaprunmetadata", zapRunMetadata);
              return;
            }

            const url = ParseData(metadata.url, zapRunMetadata);
            const data = ParseData(JSON.stringify(metadata.data), zapRunMetadata);
            const cookie = ParseData(metadata.cookie, zapRunMetadata);

            console.log(url,data ,cookie);
            console.log(JSON.parse(data), (url), (cookie))
            const bodydata  = JSON.parse(data)

            //we should hit the url,cookie,body=data using axios
            sendWebhook(url, cookie, bodydata);

          }
          await new Promise(r => setTimeout(r, 500));
          

          console.log("processing done");

          //republish
          const lastStage = (zapRunDetails?.zap.actions?.length || 1) - 1; // 1
          console.log(lastStage);
          console.log(stage);
          if (lastStage !== stage) {
              console.log("pushing back to the queue")
              await publishToKafka(zapRunId , stage)
          }

          await consumer.commitOffsets([{
              topic :  TOPIC_NAME,
              partition : partition,
              offset : (parseInt(message.offset)+ 1).toString()
          }])
        }
    })

   
}

main();