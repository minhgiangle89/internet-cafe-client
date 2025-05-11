import api from "./axios";
import { ApiResponse, ApiResponseBase } from "../types/ApiResponse";
import {
  ComputerDTO,
  ComputerStatusUpdateDTO,
  CreateComputerDTO,
  UpdateComputerDTO,
} from "../types/dto";

const computerService = {
  getAllComputers: async () => {
    const response = await api.get<ApiResponse<ComputerDTO[]>>("/computer");
    return response.data;
  },

  getAvailableComputers: async () => {
    const response = await api.get<ApiResponse<ComputerDTO[]>>(
      "/computer/available"
    );
    return response.data;
  },

  getComputerById: async (id: number) => {
    const response = await api.get<ApiResponse<ComputerDTO>>(`/computer/${id}`);
    return response.data;
  },

  getComputersByStatus: async (status: number) => {
    const response = await api.get<ApiResponse<ComputerDTO[]>>(
      `/computer/status/${status}`
    );
    return response.data;
  },

  createComputer: async (computer: CreateComputerDTO) => {
    const response = await api.post<ApiResponse<ComputerDTO>>(
      "/computer",
      computer
    );
    return response.data;
  },

  updateComputer: async (id: number, computer: UpdateComputerDTO) => {
    const response = await api.put<ApiResponse<ComputerDTO>>(
      `/computer/${id}`,
      computer
    );
    return response.data;
  },

  updateComputerStatus: async (
    id: number,
    statusUpdate: ComputerStatusUpdateDTO
  ) => {
    const response = await api.put<ApiResponse<ApiResponseBase>>(
      `/computer/${id}/status`,
      statusUpdate
    );
    return response.data;
  },

  setMaintenance: async (id: number, reason: string) => {
    const response = await api.put<ApiResponse<ApiResponseBase>>(
      `/computer/${id}/maintenance`,
      JSON.stringify(reason),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  },
};

export default computerService;
