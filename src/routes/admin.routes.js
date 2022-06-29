import express from "express";
import {
  addCollegeInfo,
  getAllUsers,
  getCollegesInfo,
  updateUser,
} from "../controller/admin.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/users", authMiddleware, getAllUsers);
router.post("/user", authMiddleware, updateUser);
router.get("/colleges", authMiddleware, getCollegesInfo);
router.post("/college", authMiddleware, addCollegeInfo);

export default router;
