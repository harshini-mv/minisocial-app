const Post = require("../models/Post");
const User = require("../models/User");

exports.createPost = async (req, res) => {
  try {
    const { text, image } = req.body;

    if (!text && !image) {
      return res.status(400).json({
        message: "Text or image is required",
      });
    }

    const user = await User.findById(req.user.userId);

    const post = await Post.create({
      user: user._id,
      username: user.username,
      text,
      image,
    });

    res.status(201).json({
      success: true,
      post,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.likePost = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const user = await User.findById(req.user.userId);

    const alreadyLiked = post.likes.find(
      (like) => like.user.toString() === user._id.toString()
    );

    if (alreadyLiked) {
      return res.status(400).json({
        message: "Post already liked",
      });
    }

    post.likes.push({
      user: user._id,
      username: user.username,
    });

    await post.save();

    res.status(200).json({
      success: true,
      likesCount: post.likes.length,
      likes: post.likes,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.commentOnPost = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        message: "Comment text is required",
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const user = await User.findById(req.user.userId);

    post.comments.push({
      user: user._id,
      username: user.username,
      text,
    });

    await post.save();

    res.status(200).json({
      success: true,
      commentsCount: post.comments.length,
      comments: post.comments,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};