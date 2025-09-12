import { NextFunction, Response , Request} from "express";
import { JWT_SECRET } from "./config";
import  jwt from "jsonwebtoken"

export function authMiddleware(req : Request, res : Response , next : NextFunction){
    const token  = req.headers.authorization as unknown as string;
    console.log(token);
    try{
        const payload  = jwt.verify(token, JWT_SECRET);
        //@ts-ignore
        req.id = payload.id 
        next();
    }catch(err){
        return res.status(403).json({
            message: "you are not logged in"
        })
    }
}