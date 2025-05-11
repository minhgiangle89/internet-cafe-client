import api from "./axios";
import { ApiResponse } from "../types/ApiResponse";
import {
  AccountDTO,
  DepositDTO,
  WithdrawDTO,
  AccountDetailsDTO,
  TransactionDTO,
} from "../types/dto";

const accountService = {
  getAllAccounts: async () => {
    const response = await api.get<ApiResponse<AccountDTO[]>>("/account");
    return response.data;
  },

  createAccount: async (userId: number) => {
    const response = await api.post<ApiResponse<AccountDTO>>(
      "/account",
      userId
    );
    return response.data;
  },

  getAccountById: async (id: number) => {
    const response = await api.get<ApiResponse<AccountDTO>>(`/account/${id}`);
    return response.data;
  },

  getAccountByUserId: async (userId: number) => {
    const response = await api.get<ApiResponse<AccountDTO>>(
      `/account/user/${userId}`
    );
    return response.data;
  },

  getAccountDetails: async (id: number) => {
    const response = await api.get<ApiResponse<AccountDetailsDTO>>(
      `/account/${id}/details`
    );
    return response.data;
  },

  getBalanceByUserId: async (userId: number) => {
    const response = await api.get<ApiResponse<number>>(
      `/account/user/${userId}/balance`
    );
    return response.data;
  },

  getTransactionsByAccountId: async (
    accountId: number,
    pageNumber: number = 1,
    pageSize: number = 10
  ) => {
    const response = await api.get<ApiResponse<TransactionDTO[]>>(
      `/account/${accountId}/transactions?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    return response.data;
  },

  deposit: async (deposit: DepositDTO) => {
    const response = await api.post<ApiResponse<TransactionDTO>>(
      "/account/deposit",
      deposit
    );
    return response.data;
  },

  withdraw: async (withdraw: WithdrawDTO) => {
    const response = await api.post<ApiResponse<TransactionDTO>>(
      "/account/withdraw",
      withdraw
    );
    return response.data;
  },

  hasSufficientBalance: async (accountId: number, amount: number) => {
    const response = await api.get<ApiResponse<boolean>>(
      `/account/${accountId}/has-sufficient-balance?amount=${amount}`
    );
    return response.data;
  },
};

export default accountService;
