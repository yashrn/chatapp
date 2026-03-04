import express from "express";
import { getAllContacts, getMessagesByUserId, sendMessage, getChatPartners } from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = express.Router();

// these middlewares will run in this order for all routes in this router -
//  first Arcjet protection to prevent abuse, then authentication to ensure only logged-in users can access these routes
router.use(arcjetProtection, protectRoute); 

router.get("/contacts", getAllContacts);
router.get("/chats", getChatPartners);
router.get("/:id", getMessagesByUserId);
router.post("/send/:id", sendMessage);    

export default router;