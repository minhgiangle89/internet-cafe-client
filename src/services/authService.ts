import api from "./axios";
import { ApiResponse } from "./apiResponse";
import { LoginRequest, AuthResponse, RegisterRequest } from "../types/dto";

const authService = {
  login: async (credentials: LoginRequest) => {
    const response = await api.post<ApiResponse<AuthResponse>>(
      "/auth/login",
      credentials
    );
    return response.data;
  },

  register: async (userData: RegisterRequest) => {
    const response = await api.post<ApiResponse<AuthResponse>>(
      "/user",
      userData
    );
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser: async () => {
    const response = await api.get<ApiResponse<AuthResponse>>("/user/current");
    return response.data;
  },
};

export default authService;
