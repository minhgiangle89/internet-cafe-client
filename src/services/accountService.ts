import api from "./axios";
import { ApiResponse } from "../types/ApiResponse";
import {
  AccountInfo,
  AccountDetails,
  DepositRequest,
  Transaction,
  WithdrawRequest,
} from "../types/dto";

const accountService = {
  getAccountByUserId: async (userId: number) => {
    try {
      const response = await api.get<ApiResponse<AccountInfo>>(
        `/account/user/${userId}`
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy thông tin tài khoản:", error);
      throw error;
    }
  },

  getAccountDetails: async (accountId: number) => {
    try {
      const response = await api.get<ApiResponse<AccountDetails>>(
        `/account/${accountId}/details`
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết tài khoản:", error);
      throw error;
    }
  },

  deposit: async (depositData: DepositRequest) => {
    try {
      const response = await api.post<ApiResponse<Transaction>>(
        "/account/deposit",
        depositData
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi khi nạp tiền:", error);
      throw error;
    }
  },

  withdraw: async (withdrawData: WithdrawRequest) => {
    try {
      const response = await api.post<ApiResponse<Transaction>>(
        "/account/withdraw",
        withdrawData
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi khi rút tiền:", error);
      throw error;
    }
  },

  getTransactions: async (
    accountId: number,
    page: number = 1,
    pageSize: number = 10
  ) => {
    try {
      const response = await api.get<ApiResponse<Transaction[]>>(
        `/account/${accountId}/transactions?pageNumber=${page}&pageSize=${pageSize}`
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy lịch sử giao dịch:", error);
      throw error;
    }
  },
};

export default accountService;
