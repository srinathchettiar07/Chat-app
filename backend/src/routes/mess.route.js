import express from 'express';
import { ensureAuthenticated } from '../middleware/auth.middleware.js';
import { getUsers } from '../controllers/mess.controller.js';
import { getMessages, sendMessage } from '../controllers/mess.controller.js';
const router = express.Router();

router.get("/users" , ensureAuthenticated , getUsers)
router.get("/:id",ensureAuthenticated , getMessages)
router.post("/send/:id", ensureAuthenticated, sendMessage);
export default router;