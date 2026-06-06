import { useState } from "react";
import {
Container,
Paper,
Typography,
TextField,
Button,
Box,
Link,
Alert,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import API from "../services/api";

function Register() {
const navigate = useNavigate();

const [formData, setFormData] = useState({
username: "",
email: "",
password: "",
confirmPassword: "",
});

const [error, setError] = useState("");
const [success, setSuccess] = useState("");

const handleChange = (e) => {
setFormData({
...formData,
[e.target.name]: e.target.value,
});
};

const handleSubmit = async (e) => {
e.preventDefault();
if (formData.password !== formData.confirmPassword) { setError("Passwords do not match"); return; } try { const response = await API.post("/auth/register", { username: formData.username, email: formData.email, password: formData.password, }); setSuccess(response.data.message); setTimeout(() => { navigate("/"); }, 1500); } catch (err) { setError( err.response?.data?.message || "Registration failed" ); }
};

return (
<Box
sx={{
minHeight: "100vh",
display: "flex",
alignItems: "center",
background:
"linear-gradient(135deg,#7b1fa2,#1976d2)",
}}
> <Container maxWidth="sm">
<Paper
elevation={10}
sx={{
p: 5,
borderRadius: 5,
}}
> <Typography
         variant="h3"
         align="center"
         fontWeight="bold"
         gutterBottom
       >
Create Account </Typography>
{error && ( <Alert severity="error" sx={{ mb: 2 }}> {error} </Alert> )} {success && ( <Alert severity="success" sx={{ mb: 2 }}> {success} </Alert> )} <form onSubmit={handleSubmit}> <TextField fullWidth label="Username" name="username" margin="normal" value={formData.username} onChange={handleChange} /> <TextField fullWidth label="Email" name="email" margin="normal" value={formData.email} onChange={handleChange} /> <TextField fullWidth label="Password" type="password" name="password" margin="normal" value={formData.password} onChange={handleChange} /> <TextField fullWidth label="Confirm Password" type="password" name="confirmPassword" margin="normal" value={formData.confirmPassword} onChange={handleChange} /> <Button fullWidth variant="contained" size="large" sx={{ mt: 3, py: 1.5, borderRadius: 3, }} type="submit" > Register </Button> </form> <Typography align="center" sx={{ mt: 3 }} > Already have an account?{" "} <Link component={RouterLink} to="/"> Login </Link> </Typography> </Paper> </Container> </Box> ); } export default Register;