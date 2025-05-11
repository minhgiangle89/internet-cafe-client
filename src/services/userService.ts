import api from "./axios";
import { ApiResponse, ApiResponseBase } from "../types/ApiResponse";
import {
  UserDTO,
  CreateUserDTO,
  UpdateUserDTO,
  ChangePasswordDTO,
} from "../types/dto";

const userService = {
  getAllUsers: async () => {
    const response = await api.get<ApiResponse<UserDTO[]>>("/user");
    return response.data;
  },

  getUserById: async (id: number) => {
    const response = await api.get<ApiResponse<UserDTO>>(`/user/${id}`);
    return response.data;
  },

  createUser: async (user: CreateUserDTO) => {
    const response = await api.post<ApiResponse<UserDTO>>("/user", user);
    return response.data;
  },

  updateUser: async (id: number, user: UpdateUserDTO) => {
    const response = await api.put<ApiResponse<ApiResponseBase>>(
      `/user/${id}`,
      user
    );
    return response.data;
  },

  changePassword: async (id: number, passwordData: ChangePasswordDTO) => {
    const response = await api.put<ApiResponse<ApiResponseBase>>(
      `/user/${id}/change-password`,
      passwordData
    );
    return response.data;
  },

  changeUserStatus: async (id: number, status: number) => {
    const response = await api.put<ApiResponse<ApiResponseBase>>(
      `/user/${id}/status`,
      status
    );
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get<ApiResponse<UserDTO>>("/user/current");
    return response.data;
  },
};

export default userService;
