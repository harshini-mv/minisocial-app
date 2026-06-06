import axios from "axios";

const API = axios.create({
  baseURL: "https://minisocial-backend-9zed.onrender.com/api",
});

export default API;