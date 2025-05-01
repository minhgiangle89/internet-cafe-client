import api from "./axios";
import { ApiResponse } from "../types/ApiResponse";

interface StatisticsSummary {
  totalUsers: number;
  activeUsers: number;
  totalComputers: number;
  computersInUse: number;
  todayRevenue: number;
  monthRevenue: number;
}

const statisticsService = {
  getSummary: async () => {
    try {
      const response = await api.get<ApiResponse<StatisticsSummary>>(
        "/statistics/summary"
      );
      return response;
    } catch (error) {
      console.error("Lỗi khi lấy thống kê:", error);
      return {
        success: false,
        data: null,
        message: "Không thể tải thống kê",
      };
    }
  },
};

export default statisticsService;
