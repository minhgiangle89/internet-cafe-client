import api from "./axios";
import { ApiResponse } from "../types/ApiResponse";
import {
  SessionDTO,
  StartSessionDTO,
  EndSessionDTO,
  SessionDetailsDTO,
  ComputerStatusSummaryDTO,
} from "../types/dto";

const sessionService = {
  startSession: async (session: StartSessionDTO) => {
    const response = await api.post<ApiResponse<SessionDTO>>(
      "/session/start",
      session
    );
    return response.data;
  },

  endSession: async (session: EndSessionDTO) => {
    const response = await api.post<ApiResponse<SessionDTO>>(
      "/session/end",
      session
    );
    return response.data;
  },

  getSessionById: async (id: number) => {
    const response = await api.get<ApiResponse<SessionDetailsDTO>>(
      `/session/${id}`
    );
    return response.data;
  },

  getActiveSessions: async () => {
    const response = await api.get<ApiResponse<SessionDTO[]>>(
      "/session/active"
    );
    return response.data;
  },

  getSessionsByUserId: async (userId: number) => {
    const response = await api.get<ApiResponse<SessionDTO[]>>(
      `/session/user/${userId}`
    );
    return response.data;
  },

  getActiveSessionByComputerId: async (computerId: number) => {
    const response = await api.get<ApiResponse<SessionDTO>>(
      `/session/computer/${computerId}/active`
    );
    return response.data;
  },

  calculateSessionCost: async (sessionId: number) => {
    const response = await api.get<ApiResponse<number>>(
      `/session/${sessionId}/cost`
    );
    return response.data;
  },

  getRemainingTime: async (userId: number, computerId: number) => {
    const response = await api.get<ApiResponse<string>>(
      `/session/user/${userId}/computer/${computerId}/remaining-time`
    );
    return response.data;
  },

  hasActiveSession: async (userId: number) => {
    const response = await api.get<ApiResponse<boolean>>(
      `/session/user/${userId}/has-active`
    );
    return response.data;
  },

  terminateSession: async (sessionId: number, reason: string) => {
    const response = await api.post<ApiResponse<SessionDTO>>(
      `/session/${sessionId}/terminate`,
      JSON.stringify(reason),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  },

  getComputerStatusSummary: async () => {
    const response = await api.get<ApiResponse<ComputerStatusSummaryDTO>>(
      "/session/computer-status-summary"
    );
    return response.data;
  },
};

export default sessionService;
