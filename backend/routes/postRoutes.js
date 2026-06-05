const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createPost,
  getPosts,
  likePost,
  commentOnPost,
} = require("../controllers/postController");

router.get("/", getPosts);
router.post("/", authMiddleware, createPost);
router.put("/:id/like", authMiddleware, likePost);
router.post("/:id/comment", authMiddleware, commentOnPost);

module.exports = router;