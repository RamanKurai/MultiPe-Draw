import express, { Router } from "express";

const userRouter = Router();
userRouter.use(express.json())

userRouter.post("/signup" , async (req: any, res: any) => {
    
})