import { Router } from "express";
import { authMiddleware } from "../middleware";
import { prisma } from "@repo/db";
import { SigninSchema, SignupSchema } from "../types";
import { parse } from "zod";
import  jwt from "jsonwebtoken"
import { JWT_SECRET } from "../config";

const router = Router();

router.post("/signup", async (req, res)=>{
    //zod validation
    const body = req.body;
    const parsedData = SignupSchema.safeParse(body);
    if(!parsedData.success){
        return res.status(411).json({
            Message : "invalid credentials"
        })
    }

    //username exsists check
    const exsisting = await prisma.user.findFirst({
        where : {
            email : parsedData.data?.username
        }
    })

    if(exsisting){
        return res.status(403).json({
            message : "username already exsisting"
        })
    }

    //store in db
    const user = await prisma.user.create({
        data : {
            name : parsedData.data?.name?? " ",
            password : parsedData.data?.password?? " ", //we are not hashing password
            email : parsedData.data?.username??" ",
        }
    })

    return res.status(200).json({
        message : "Account created sucessfully"
    })


    
})

router.post("/signin", async (req, res)=>{
    const body = req.body;
    const parsedData = SigninSchema.safeParse(body);
    if(!parsedData.success){
        return res.status(411).json({
            Message : "invalid credentials"
        })
    }

    //username exsists check
    const user = await prisma.user.findFirst({
        where : {
            email : parsedData.data?.username,
            password : parsedData.data?.password
        }
    })

    if(!user){
        return res.status(403).json({
            message : "user not found"
        })
    }

    //create jwt token
    const token = jwt.sign({ id : user.id } , JWT_SECRET);
    return res.status(200).json({
        token : token
    })
})

router.get("/", authMiddleware , async (req , res)=>{
    //we can fix.but, overhead
    //@ts-ignore 
    const id = req.id;
    const user = await prisma.user.findFirst({
        where : {
            id
        },
        select : {
            name : true,
            email : true
        }
    })

    return res.status(200).json({
        user
    })
})

export const userRouter = router