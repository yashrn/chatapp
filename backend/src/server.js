import dotenv from "dotenv";
dotenv.config();

import { ENV } from "./lib/env.js";
import express from "express"; 
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";


const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse JSON bodies in requests req.body
app.use(cors({origin: ENV.CLIENT_URL, credentials: true})); // Enable CORS for frontend requests with credentials
app.use(cookieParser()); // Middleware to parse cookies in requests req.cookies 


app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);


app.listen(PORT, () => {
    console.log("Server is running on", PORT);
    connectDB()
});