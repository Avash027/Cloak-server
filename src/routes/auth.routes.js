import express from "express";
import {
  getUser,
  login,
  signup,
  verify,
} from "../controller/auth.controller.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/verify/:token", verify);
router.get("/user", authMiddleware, getUser);

export default router;
