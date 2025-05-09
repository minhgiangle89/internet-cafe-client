import api from "./axios";
import { ApiResponse } from "../types/ApiResponse";
import { ChangePasswordRequest, UserProfile } from "../types/dto";

const userService = {
  changePassword: async (
    userId: number,
    passwordData: ChangePasswordRequest
  ) => {
    try {
      const response = await api.put<ApiResponse<boolean>>(
        `/user/${userId}/change-password`,
        passwordData
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi khi đổi mật khẩu:", error);
      throw error;
    }
  },

  getUserProfile: async (userId: number) => {
    try {
      const response = await api.get<ApiResponse<UserProfile>>(
        `/user/${userId}`
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
      throw error;
    }
  },

  updateUserProfile: async (
    userId: number,
    profileData: Partial<UserProfile>
  ) => {
    try {
      const response = await api.put<ApiResponse<UserProfile>>(
        `/user/${userId}`,
        profileData
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin người dùng:", error);
      throw error;
    }
  },
};

export default userService;
