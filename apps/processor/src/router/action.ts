import { prisma } from "@repo/db";
import { Router } from "express";
const router = Router()

router.get("/available", async (req,res)=>{
    const availableactions = await prisma.availableAction.findMany({})

    return res.status(200).json({
        availableactions
    })
})


export const actionRouter = router