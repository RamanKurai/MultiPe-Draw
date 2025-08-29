import { WebSocketServer, WebSocket } from 'ws';
import jwt, { JwtPayload } from "jsonwebtoken"
import {prismaClient} from "@repo/db/client"
const JWT_USER_SECRET = process.env.JWT_USER_SECRET || "defaultSecret";

const wss = new WebSocketServer({ port: 8080 });
interface User { 
  ws : WebSocket,
  rooms : string[],
  userId : string
}

const users : User[] = []

function checkUser(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_USER_SECRET) as JwtPayload;
    console.log(JWT_USER_SECRET)
    if (typeof decoded == "string") {
      console.error("Decoded token is a string, expected object");
      return null;
    }
    if (!decoded.id) {
      console.error("No valid user ID in token");
      return null;
    }
    return decoded.id;
  } catch (err) {
    console.error("JWT verification failed:", err);
    return null;
  }
}

wss.on('connection', function connection(ws, request) {
  const url = request.url;
  if (!url) {
    return; 
  }
  const queryParams = new URLSearchParams(url.split("?")[1])
  const token = queryParams.get("token") || ""
  const userId = token ? checkUser(token) : false
  
  if (userId == null)  { 
     ws.close()
     return null;
  }

  users.push({
    ws,
    userId,
    rooms : [],
  })

  ws.on("message" , async function message(data) {
    let parsedData;
    if (typeof data !== "string") {
      parsedData = JSON.parse(data.toString())
    } else {
      parsedData = JSON.parse(data)
    }

    if (parsedData.type == "join_room") {
      const user = users.find(x => x.ws == ws)
      user?.rooms.push(parsedData.roomId)
    }

    if (parsedData.type == "leave_room") {
      const user = users.find(x => x.ws === ws)
      if (!user) {
        return
      }
      user.rooms = user?.rooms.filter(x => x === parsedData.room)
    }
    console.log("message recieved")
    console.log(parsedData)

    if (parsedData.type === "chat") {
      const roomId = parsedData.roomId
      const message = parsedData.message

      await prismaClient.shape.create({
        data : {
          roomId : roomId,
          message : message,
          userId 
        }
      })
      users.forEach(user => {
        if (user.rooms.includes(roomId)) {
          user.ws.send(JSON.stringify({
            type : "chat",
            message : message,
            roomId
          }))
        }
      })
    }
  })
});
