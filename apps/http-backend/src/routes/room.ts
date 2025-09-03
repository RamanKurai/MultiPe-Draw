import express, { Router } from "express";
import { userMiddleware } from "../middleware/user";
import { CreateRoomSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";

const roomRouter: express.Router = Router();
roomRouter.use(express.json());

roomRouter.post("/room", userMiddleware, async (req: any, res: any) => {
  const parsedData = CreateRoomSchema.safeParse(req.body);

  if (!parsedData.success) {
    res.status(400).json({
      message: "Incorrect Format",
    });
    return;
  }
  const userId = req.userId;

  try {
    const room = await prismaClient.room.create({
      data: {
        roomname: parsedData.data.roomName,
        adminId: userId,
      },
    });

    res.json({
      roomId: room.id,
    });
  } catch (error) {
    res.status(500).json({
      message: "Some thing went wrong",
    });
  }
});

roomRouter.get("/shape/:roomId", async (req: any, res: any) => {
  try {
    const roomId = req.params.roomId;
    const message = await prismaClient.shape.findMany({
      where: {
        roomId: roomId,
      },
      orderBy: {
        id: "desc",
      },
      take: 50,
    });

    res.json({
      message,
    });
  } catch (error) {
    console.log(error);
    res.json({
      messages: [],
    });
  }
});

roomRouter.get("/room/:roomname", async (req: any, res: any) => {
  const roomname = req.params.roomname;
  const room = await prismaClient.room.findMany({
    where: {
      roomname,
    },
  });

  res.json({
    room: room,
  });
});
export { roomRouter };
