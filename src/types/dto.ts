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

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  address: string;
  dateOfBirth: Date;
  role: number;
  status: number;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AccountInfo {
  id: number;
  userId: number;
  balance: number;
  lastDepositDate: Date;
  lastUsageDate: Date;
  userName: string;
}

export interface Transaction {
  id: number;
  accountId: number;
  userId: number;
  userName: string;
  sessionId: number | null;
  amount: number;
  type: number;
  paymentMethod: number | null;
  description: string;
  timestamp: Date;
}

export interface AccountDetails extends AccountInfo {
  recentTransactions: Transaction[];
}

export interface DepositRequest {
  accountId: number;
  amount: number;
  paymentMethod: number;
  referenceNumber?: string;
}

export interface WithdrawRequest {
  accountId: number;
  amount: number;
  reason?: string;
}
