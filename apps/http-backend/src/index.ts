import dotenv from "dotenv";
dotenv.config();
console.log("HTTP SECRET =", process.env.JWT_USER_SECRET)
import express from "express";
import cors from "cors"
import { userRouter } from "./routes/user";
import { shapeRouter } from "./routes/room";
const app = express();
app.use(express.json());
app.use(cors())

app.use("/api/v1", userRouter);
app.use("/api/v1" , shapeRouter)

app.listen(3001, () => {
  console.log("Server Running on the port: 3001");
});
