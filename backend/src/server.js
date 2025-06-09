import express from "express";
import { configDotenv } from "dotenv";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/mess.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import {app , server} from "./lib/socket.js"; // Importing the socket.io setup
import path from "path";

configDotenv();
const port = process.env.PORT;

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials: true,
}))
const __dirbane = path.resolve();


app.use("/api/auth" , authRoutes) ;
app.use("/api/message" , messageRoutes) ;

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}
server.listen(port,(req,res)=>{
    console.log(`Running on port ${port}`)
    connectDB();
})