import express, { Router } from "express";
import { prismaClient } from "@repo/db/client";

const shapeRouter: express.Router = Router();
shapeRouter.use(express.json());

shapeRouter.get("/shape/:roomId" , async (req: any, res: any) => {
  try {
    const roomId = req.params.roomId;
    const shapes = await prismaClient.shape.findMany({
      where: {
        roomId: roomId,
      },
      orderBy: {
        createdAt: "asc",
      },
      take: 5000,
    });

    res.json({
      shapes,
    });
  } catch (error) {
    console.log(error);

    res.json({
      shapes: [],
    });
  }
});

export { shapeRouter };
