import { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Box,
  Avatar,
  Divider,
  Stack,
} from "@mui/material";

import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import LogoutIcon from "@mui/icons-material/Logout";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";

import API from "../services/api";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");
  const [comments, setComments] = useState({});

  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const fetchPosts = async () => {
    try {
      const response = await API.get("/posts");
      setPosts(response.data.posts);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const createPost = async () => {
    try {
      const token = localStorage.getItem("token");

      await API.post(
        "/posts",
        {
          text,
          image: "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setText("");
      fetchPosts();
    } catch (error) {
      console.error(error);
    }
  };

  const likePost = async (postId) => {
    try {
      const token = localStorage.getItem("token");

      await API.put(
        `/posts/${postId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchPosts();
    } catch (error) {
      console.error(error);
    }
  };

  const addComment = async (postId) => {
    try {
      const token = localStorage.getItem("token");

      if (!comments[postId]) return;

      await API.post(
        `/posts/${postId}/comment`,
        {
          text: comments[postId],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComments({
        ...comments,
        [postId]: "",
      });

      fetchPosts();
    } catch (error) {
      console.error(error);
    }
  };

  const deletePost = async (postId) => {
    try {
      const token = localStorage.getItem("token");

      await API.delete(`/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchPosts();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom, #f4f7fb, #eef2ff)",
        py: 4,
      }}
    >
      <Container maxWidth="md">

        {/* HEADER */}
        <Paper
          elevation={4}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 4,
            background:
              "linear-gradient(135deg,#1976d2,#7b1fa2)",
            color: "white",
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar
                sx={{
                  width: 60,
                  height: 60,
                  fontWeight: "bold",
                  background:
                    "linear-gradient(135deg,#ff9800,#ff5722)",
                }}
              >
                {user?.username?.charAt(0)?.toUpperCase()}
              </Avatar>

              <Box>
                <Typography
                  variant="h4"
                  fontWeight="bold"
                >
                  Mini Social
                </Typography>

                <Typography variant="body1">
                  Welcome back, {user?.username} 👋
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              color="error"
              startIcon={<LogoutIcon />}
              onClick={logout}
            >
              Logout
            </Button>
          </Box>
        </Paper>

        {/* CREATE POST */}
        <Paper
          elevation={2}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 4,
            backgroundColor: "#f8fafc",
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            gutterBottom
          >
            Create Post
          </Typography>

          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="What's on your mind?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                backgroundColor: "white",
              },
            }}
          />

          <Button
            variant="contained"
            endIcon={<SendIcon />}
            onClick={createPost}
          >
            Post
          </Button>
        </Paper>

        {/* POSTS */}
        {posts.map((post) => (
          <Card
            key={post._id}
            sx={{
              mb: 3,
              borderRadius: 4,
              boxShadow: 3,
            }}
          >
            <CardContent>

              {/* USER INFO */}
              <Box
                display="flex"
                alignItems="center"
                gap={2}
                mb={2}
              >
                <Avatar
                  sx={{
                    background:
                      "linear-gradient(135deg,#1976d2,#7b1fa2)",
                  }}
                >
                  {post.username.charAt(0).toUpperCase()}
                </Avatar>

                <Box>
                  <Typography fontWeight="bold">
                    {post.username}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    {new Date(
                      post.createdAt
                    ).toLocaleString()}
                  </Typography>
                </Box>
              </Box>

              {/* POST TEXT */}
              <Typography
                sx={{
                  mb: 2,
                  fontSize: "1rem",
                  lineHeight: 1.8,
                }}
              >
                {post.text}
              </Typography>

              <Divider sx={{ mb: 2 }} />

              {/* COUNTS */}
              <Box
                display="flex"
                gap={3}
                mb={2}
              >
                <Typography color="text.secondary">
                  ❤️ {post.likes.length} Likes
                </Typography>

                <Typography color="text.secondary">
                  💬 {post.comments.length} Comments
                </Typography>
              </Box>

              {/* ACTION BUTTONS */}
              <Stack
                direction="row"
                spacing={2}
                mb={2}
              >
                <Button
                  variant="outlined"
                  startIcon={<FavoriteIcon />}
                  onClick={() => likePost(post._id)}
                >
                  Like
                </Button>

                {String(user?.id) === String(post.user) && (
                  <Button
                    color="error"
                    variant="outlined"
                    startIcon={<DeleteIcon />}
                    onClick={() =>
                      deletePost(post._id)
                    }
                  >
                    Delete
                  </Button>
                )}
              </Stack>

              {/* COMMENT INPUT */}
              <Box
                display="flex"
                gap={1}
                mt={2}
              >
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Write a comment..."
                  value={comments[post._id] || ""}
                  onChange={(e) =>
                    setComments({
                      ...comments,
                      [post._id]: e.target.value,
                    })
                  }
                />

                <Button
                  variant="contained"
                  startIcon={<CommentIcon />}
                  onClick={() =>
                    addComment(post._id)
                  }
                >
                  Send
                </Button>
              </Box>

              {/* COMMENTS */}
              {post.comments.length > 0 && (
                <Box mt={3}>
                  {post.comments.map((comment) => (
                    <Paper
                      key={comment._id}
                      sx={{
                        p: 1.5,
                        mb: 1,
                        borderRadius: 2,
                        backgroundColor: "#f8fafc",
                      }}
                    >
                      <Typography variant="body2">
                        <strong>
                          {comment.username}
                        </strong>
                        : {comment.text}
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        ))}
      </Container>
    </Box>
  );
}

export default Feed;