import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const client = axios.create({
  baseURL: API_URL,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("taskflow_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("taskflow_token");
      localStorage.removeItem("taskflow_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ---- Auth ----
export const registerUser = (data) => client.post("/api/auth/register", data);
export const loginUser = (data) => client.post("/api/auth/login", data);
export const getCurrentUser = () => client.get("/api/auth/me");

// ---- Projects ----
export const getProjects = () => client.get("/api/projects");
export const createProject = (data) => client.post("/api/projects", data);
export const updateProject = (id, data) => client.patch(`/api/projects/${id}`, data);
export const deleteProject = (id) => client.delete(`/api/projects/${id}`);

// ---- Tasks ----
export const getTasks = (params) => client.get("/api/tasks", { params });
export const createTask = (data) => client.post("/api/tasks", data);
export const updateTask = (id, data) => client.patch(`/api/tasks/${id}`, data);
export const deleteTask = (id) => client.delete(`/api/tasks/${id}`);

// ---- Dashboard ----
export const getDashboardStats = () => client.get("/api/dashboard/stats");

export default client;
