import { WebSocketServer } from 'ws';
import jwt, { decode, JwtPayload } from "jsonwebtoken"
const JWT_USER_SECRET = process.env.JWT_USER_SECRET || "your_default_secret";
const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws, request) {
  const url = request.url;
  if (!url) {
    return; 
  }

  const queryParams = new URLSearchParams(url.split("?")[1])
  const token = queryParams.get("token")

  if (!token) {
    ws.close(1008, "Authentication token missing");
    return;
  }

  const decodedtoken = jwt.verify(token, JWT_USER_SECRET)

  if (typeof decodedtoken == "string") {
    ws.close()
    return
  }

  if (!decodedtoken || !(decodedtoken).userId) {
    ws.close()
    return ;
  }


  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });

  ws.send('something');
});
