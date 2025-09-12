import { Router } from "express";
import { prisma } from "@repo/db";
import { authMiddleware } from "../middleware";
import { ZapCreateSchema } from "../types";
const router = Router();


router.post("/", authMiddleware, async (req, res) => {
    // @ts-ignore
    const id: string = req.id;
    const body = req.body;
    const parsedData = ZapCreateSchema.safeParse(body);
    
    if (!parsedData.success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        });
    }  

    console.log(body);

    const zapId = await prisma.$transaction(async tx => {
        const zap = await prisma.zap.create({
            data: {
                userId: parseInt(id),
                trigger:{
                    create : {
                        triggerId: (parsedData?.data?.availableTriggerId as unknown as string)?? " ",
                        metadata : parsedData.data.triggerMetadata,
                    }
                },
                actions: {
                    create: parsedData.data.actions.map((x, index) => ({
                        actionId: x.availableActionId as unknown as string,
                        sortingOrder: index,
                        metadata: x.actionMetadata
                    }))
                }
            }
        })

        return zap.id;
    }, { timeout: 15000 })

    return res.json({
       id : zapId
    })
})

router.get("/", authMiddleware, async (req, res) => {
    // @ts-ignore
    const id = req.id;
    const zaps = await prisma.zap.findMany({
        where: {
            userId: id
        },
        include: {
            actions: {
               include: {
                    type: true
               }
            },
            trigger: {
                include: {
                    type: true
                }
            }
        }
    });

    return res.json({
        zaps
    })
})

router.get("/:zapId", authMiddleware, async (req, res) => {
    //@ts-ignore
    const id = req.id;
    const zapId = req.params.zapId;

    const zap = await prisma.zap.findFirst({
        where: {
            id: zapId,
            userId: id
        },
        include: {
            actions: {
               include: {
                    type: true
               }
            },
            trigger: {
                include: {
                    type: true
                }
            }
        }
    });

    return res.json({
        zap
    })

})

export const zapRouter = router;