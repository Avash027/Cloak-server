import express from "express";
import {
  getMyBookMarkedPosts,
  getMyLikedPosts,
  getMyPosts,
  getOnePost,
  getPost,
  insertComment,
  updateBookmarks,
  updateLike,
  uploadPost,
  deletePost,
} from "../controller/post.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/post", authMiddleware, uploadPost);
router.get("/post/:offset/:limit", getPost);
router.post("/post/like", authMiddleware, updateLike);
router.post("/post/bookmarks", authMiddleware, updateBookmarks);
router.get("/singlepost/:pid", getOnePost);
router.post("/comment", authMiddleware, insertComment);
router.get(
  "/bookmarks/post/:offset/:limit",
  authMiddleware,
  getMyBookMarkedPosts
);
router.get("/user/post/:offset/:limit", authMiddleware, getMyPosts);
router.get("/likes/post/:offset/:limit", authMiddleware, getMyLikedPosts);
router.delete("/post/:pid", authMiddleware, deletePost);

export default router;
