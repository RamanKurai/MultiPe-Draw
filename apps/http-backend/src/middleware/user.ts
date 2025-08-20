import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"

const JWT_USER_SECRET = process.env.JWT_USER_SECRET || "defaultSecret"

const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const header = req.headers["authorization"];
        const decodedtoken = jwt.verify(header as string , JWT_USER_SECRET)

        if (decodedtoken) {
            //@ts-ignore
            req.userId = decodedtoken.id
            next()
        } else {
            res.status(403).json({
                message : "You are  not logged in"
            })
        }
    } catch (error) {
        console.error("Error While passing Token" , error) 
    }
}

export {
    userMiddleware
}