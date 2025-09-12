import express from "express"
import { prisma } from "@repo/db"

const app = express();
app.use(express.json());

app.post("/hooks/catch/:userId/:zapId", async (req,res)=>{
    const userId = req.params.userId;
    const zapId = req.params.zapId;
    const metadata = req.body;

    console.log(metadata);
    
    // outbox pattern
    try{
        await prisma.$transaction(async tx => {
            const run = await tx.zapRun.create({
                data: {
                    zapId : zapId,
                    metadata : metadata
                }
            });

            await tx.zapRunOutbox.create({
                data : {
                    zapRunId : run.id
                }
            })

            return res.status(200).json({
                message : "weebhook recieved"
            })
        }, { timeout: 15000 })
    }catch(err){
        console.log("error" + err);
        return res.status(500).json({
            message : "Internal server error"
        })
    }

})
app.listen(3003, ()=>{
    console.log("server is running on 3003 ....!!!")
})