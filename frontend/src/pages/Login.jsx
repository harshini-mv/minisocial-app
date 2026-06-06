import { useState } from "react"; import { Container, Paper, Typography, TextField, Button, Box, Link, Alert, } from "@mui/material"; import { Link as RouterLink, useNavigate } from "react-router-dom"; import API from "../services/api"; function Login() { const navigate = useNavigate(); const [formData, setFormData] = useState({ email: "", password: "", }); const [error, setError] = useState(""); const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value, }); }; const handleSubmit = async (e) => { e.preventDefault();
try {
  const response = await API.post("/auth/login", formData);

  localStorage.setItem("token", response.data.token);
  localStorage.setItem(
    "user",
    JSON.stringify(response.data.user)
  );

  navigate("/feed");
} catch (err) {
  setError(
    err.response?.data?.message || "Login failed"
  );
}
}; return ( <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", background: "linear-gradient(135deg,#1976d2,#7b1fa2)", }} > <Container maxWidth="sm"> <Paper elevation={10} sx={{ p: 5, borderRadius: 5, backdropFilter: "blur(10px)", }} > <Typography variant="h3" align="center" fontWeight="bold" gutterBottom > Mini Social </Typography>
<Typography
        align="center"
        color="text.secondary"
        sx={{ mb: 3 }}
      >
        Connect. Share. Engage.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Email"
          name="email"
          margin="normal"
          value={formData.email}
          onChange={handleChange}
        />

        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          margin="normal"
          value={formData.password}
          onChange={handleChange}
        />

        <Button
          fullWidth
          variant="contained"
          size="large"
          sx={{
            mt: 3,
            py: 1.5,
            borderRadius: 3,
          }}
          type="submit"
        >
          Login
        </Button>
      </form>

      <Typography
        align="center"
        sx={{ mt: 3 }}
      >
        Don't have an account?{" "}
        <Link
          component={RouterLink}
          to="/register"
        >
          Register
        </Link>
      </Typography>
    </Paper>
  </Container>
</Box>


);
}

export default Login;