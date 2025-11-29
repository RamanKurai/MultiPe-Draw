import dotenv from "dotenv"
dotenv.config()
import { WebSocketServer, WebSocket } from "ws";
import url from "url"
import jwt, { JwtPayload } from "jsonwebtoken"
import { prismaClient } from "@repo/db/client";

const JWT_USER_SECRET =  process.env.JWT_USER_SECRET

// intializing the websocketserver connection
const wss = new WebSocketServer({ port : 8080})

type roomId = string

const rooms = new Map<roomId , Set<WebSocket>>()
const users = new Map<WebSocket, { userId: string | null }>()

const authenticatedUser = (token : string) => {
   try {
      const decoded = jwt.verify(token , JWT_USER_SECRET as string) as JwtPayload
      if (typeof decoded == "string") {
      console.error("Decoded token is a string, expected object");
      return null;
    }
   if (!decoded.id) {
      console.error("No valid user ID in token")
      return null
   } return decoded.id

   } catch (err) {
      console.error("JWT verification failed" , err)
      return null
   }
}

wss.on("connection"  , (socket , request) => {
   console.log("Connection of the client is established")

   const { roomId } = url.parse(request.url || "" , true).query
   const {token} = url.parse(request.url || "" , true).query 

   if (!roomId || !token || typeof token !== "string" || typeof roomId !== "string") {
    console.log("RoomId and Token is required for the collaboration or Both are not formatted")
    socket.close(1008, "User not authenticated");
    return;
   }

   const userId = authenticatedUser(token)

   if (!userId || userId == null) {
      console.error("User Id not authenticated properly")
      socket.close(1008 , "User is not authenticated properly")
      return ;
   }
   
   users.set(socket , {userId})
   
   if (!rooms.has(roomId)) {
      rooms.set(roomId , new Set())
   }

   rooms.get(roomId)!.add(socket)

  socket.on("message" , async (data) => {
    const parsedMessage =  JSON.parse(data.toString())
    if (!parsedMessage) {
      console.error("Error passing in the WS")
      return ;
    }

    if (parsedMessage.type !== "shape_update" ) return ;
    const shape = parsedMessage.shape

    if (!roomId || !rooms.has(roomId)) {
      console.error("Invalid roomId in the shape update")
      return;
    }

    const userInfo = users.get(socket)
    const userId = userInfo?.userId || null

    if (userId && shape) {
      try {
         await prismaClient.shape.create({
            data : {
               data : shape , 
               roomId,
               userId
            }
         })
      } catch (err) {
          console.error("Error saving shape:", err);
      }
    }

    const clients = rooms.get(roomId)

    if (!clients) {
      return;
    }
      // room me jitne log hain, un sab ko message bhejo
    for(const client of clients){
      // jisne drawing bheji, usko dobara mat bhejna
      if (client === socket) continue;
      //shape bhejo
      client.send(JSON.stringify({
         type : "shape_update",
         shape,
         userId
      }))
    }
  })
})
