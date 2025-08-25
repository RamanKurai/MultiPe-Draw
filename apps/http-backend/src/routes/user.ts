import { CreateUserSchema, SigninSchema } from "@repo/common/types";
import express, { Router } from "express";
import bcrypt from "bcrypt";
import { prismaClient } from "@repo/db/client";
import jwt from "jsonwebtoken";

const userRouter: express.Router = Router();
userRouter.use(express.json());

userRouter.post("/signup", async (req: any, res: any) => {
  const parsedData = CreateUserSchema.safeParse(req.body);

  if (!parsedData.success) {
    return res.status(400).json({
      message: "Incorrect Format",
      error: parsedData.error,
    });
  }

  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;

  try {
    const hashedPassword = await bcrypt.hash(password, 5);
    const newUser = await prismaClient.user.create({
      data: {
        email: email,
        password: hashedPassword,
        name: name,
      },
    });
    res.json({
      userId: newUser.id,
      message: "You have signed up successfully",
    });
  } catch (error) {
    res.status(403).json({
      message: "Invalid Credentials",
    });
  }
});

userRouter.post("/signin", async (req: any, res: any) => {
  const email = req.body.email;
  const password = req.body.password;

  const parsedData = SigninSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.json({
      message: "Incorrect Inputs",
    });
  }

  try {
    const user = await prismaClient.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(403).json({ message: "Invalid Credentials" });
    }

    const passwordMatched = await bcrypt.compare(password, user.password);

    if (!passwordMatched) {
      return res
        .status(403)
        .json({
          message: "Invalid Credentials(Please Write the valid password)",
        });
    }

    const token = jwt.sign(
      { id: user.id.toString() },
      process.env.JWT_USER_SECRET || "defaultSecret"
    );

    res.json({
      message: "You are Signed In successfully",
      token: token,
    });
  } catch (error) {
    console.error("SignIn-Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

export { userRouter };
