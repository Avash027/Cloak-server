import postRepo from "../database/repo/post.repo.js";
import Toxicity from "../config/model.js";

export const uploadPost = async (req, res) => {
  try {
    const uid = req.uid;
    const { title, content } = req.body;

    const toxicLevel = await Toxicity.classify([title, content]);

    const result = await postRepo.createPost(title, content, uid, toxicLevel);

    res.status(200).json({ message: "Post uploaded successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

export const getPost = async (req, res) => {
  try {
    const { offset, limit } = req.params;

    const rows = await postRepo.getPosts(offset, limit);

    res.status(200).json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Server error" });
  }
};

export const getOnePost = async (req, res) => {
  try {
    const { pid } = req.params;

    console.log(req.params);

    const comments = await postRepo.getOnePost(pid);

    return res.status(200).json(comments);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "error" });
  }
};

export const postComment = async (req, res) => {
  try {
    const uid = req.uid;
    const { content, pid } = req.body;

    await postRepo.createComment(uid, pid, content);

    res.status(200).json({ message: "Commented on the post" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateLike = async (req, res) => {
  try {
    const uid = req.uid;
    const { pid, isLike } = req.body;

    await postRepo.updateLike(uid, pid, isLike);

    res.status(200).send({ message: "You liked the post" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateBookmarks = async (req, res) => {
  try {
    const uid = req.uid;
    const { pid, isBookmarked } = req.body;

    await postRepo.updateBookmarks(uid, pid, isBookmarked);

    res.status(200).send({ message: "You liked the post" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const insertComment = async (req, res) => {
  try {
    const uid = req.uid;
    const { content, pid } = req.body;

    const id = await postRepo.createComment(uid, pid, content);

    res.status(200).json({ cid: id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getMyPosts = async (req, res) => {
  try {
    const uid = req.uid;

    const rows = await postRepo.getMyPosts(uid);

    res.status(200).json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getMyBookMarkedPosts = async (req, res) => {
  try {
    const uid = req.uid;

    const rows = await postRepo.getMyBookMarkedPosts(uid);

    res.status(200).json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getMyLikedPosts = async (req, res) => {
  try {
    const uid = req.uid;

    const rows = await postRepo.getMyLikedPosts(uid);

    res.status(200).json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const uid = req.uid;
    const { pid } = req.params;

    await postRepo.deletePost(pid);

    res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};
