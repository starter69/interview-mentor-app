import axios from "axios";
import {
  UpdatePaswordRequest,
  UserLoginRequest,
  UserRegisterRequest,
} from "./types";

export const host = process.env.REACT_APP_API_HOST || "localhost";
export const port = process.env.REACT_APP_API_PORT || 3200;

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

// Users
const getUsers = () => apiService.get("users");
const addUser = (payload: {
  name: string;
  role: string;
  team_id: number;
  password: string;
}) => apiService.post("users", payload);
const deleteUser = (id: number) => apiService.delete(`users/${id}`);
const updateUser = (
  id: number,
  payload: {
    name: string;
    role: string;
    team_id: number;
    password: string;
  }
) => apiService.patch(`users/${id}`, payload);
const getUser = (id: number) => apiService.get(`users/${id}`);
const updatePassword = (payload: UpdatePaswordRequest) =>
  apiService.put("users/update-password", payload);
// Teams

const getTeams = () => apiService.get("teams");

const addTeam = (payload: { name: string }) =>
  apiService.post("teams", payload);

const updateTeam = (
  id: number,
  payload: {
    name: string;
  }
) => apiService.patch(`teams/${id}`, payload);

const deleteTeam = (id: number) => apiService.delete(`teams/${id}`);

const getTeam = (id: number) => apiService.get(`teams/${id}`);

// Interview
const uploadInterview = (formData: FormData) =>
  apiService.post("/interviews/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

const getInterviewDetail = (id: number) => apiService.get(`/interviews/${id}`);

const getInterviews = () => apiService.get("interviews");

const getMyInterviews = (userId: number) =>
  apiService.get(`interviews/user/${userId}`);

const deleteInterview = (id: number) => apiService.delete(`interviews/${id}`);

// const updateInterview = (id: number)

const searchInterview = (query: string) =>
  apiService.get(`interviews/search?query=${query}`);

export {
  Login,
  Register,
  GetCurrentUser,
  getTeams,
  addTeam,
  updateTeam,
  deleteTeam,
  getTeam,
  getUsers,
  addUser,
  deleteUser,
  updateUser,
  getUser,
  updatePassword,
  uploadInterview,
  getInterviewDetail,
  getInterviews,
  getMyInterviews,
  deleteInterview,
  searchInterview,
};
