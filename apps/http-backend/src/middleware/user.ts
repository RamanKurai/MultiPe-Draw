import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"

const jwtUserSecret = process.env.JWT_USER_SECRET || "defaultSecret"

const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const header = req.headers["authorization"];
        const decodedtoken = jwt.verify(header as string , jwtUserSecret)
        console.log("HTTP SECRET = ", jwtUserSecret);

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
        return res.status(403).json({ message: "Invalid or missing token" });
    }
}

export {
    userMiddleware
}