import axios from "axios";
import { UserLoginRequest, UserRegisterRequest } from "./types";

const host = process.env.REACT_APP_API_HOST || "192.168.101.57";
const port = process.env.REACT_APP_API_PORT || 3200;

const apiService = axios.create({
  baseURL: `http://${host}:${port}/`,
});

apiService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.set("Authorization", "Bearer " + token);
    }

    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

// Auth
const Login = (data: UserLoginRequest) => apiService.post("auth/login", data);

const Register = (data: UserRegisterRequest) =>
  apiService.post("auth/register", data);

const GetCurrentUser = () => apiService.get("auth/user");

// Teams

const getAllTeams = () => apiService.get("teams");

const addTeam = (name: string) => apiService.post("teams", { name });

const updateTeam = (id: number, name: string) =>
  apiService.patch(`teams/${id}`, { name });

const deleteTeam = (id: number) => apiService.delete(`teams/${id}`);

const getTeam = (id: number) => apiService.get(`teams/${id}`);

export {
  Login,
  Register,
  GetCurrentUser,
  getAllTeams,
  addTeam,
  updateTeam,
  deleteTeam,
  getTeam,
};
