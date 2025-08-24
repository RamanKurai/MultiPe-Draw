import express from "express";
import { userRouter } from "./routes/user";

const app = express();
app.use(express.json());

app.use("/api/v1", userRouter);
app.use("/api/v1" , roomRouter)

app.listen(3001, () => {
  console.log("Server Running on the port: 3001");
});
