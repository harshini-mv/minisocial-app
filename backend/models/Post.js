const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    username: String,

    text: String,
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    username: {
      type: String,
      required: true,
    },

    text: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    likes: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        username: String,
      },
    ],

    comments: [commentSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", postSchema);