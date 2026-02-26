import dotenv from "dotenv";
dotenv.config();

import express from "express"; 
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";


const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse JSON bodies in requests req.body 

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);



app.listen(PORT, () => {
    console.log("Server is running on port 3000")
    connectDB()
});