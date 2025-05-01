export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
  address?: string;
  dateOfBirth: Date;
}

export interface AuthResponse {
  id: number;
  username: string;
  email: string;
  role: number;
  token: string;
  refreshToken: string;
  expiresIn: number;
}
