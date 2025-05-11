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

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
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

// Computer DTOs
export interface ComputerDTO {
  id: number;
  name: string;
  ipAddress: string;
  specifications: string;
  location: string;
  computerStatus: number;
  hourlyRate: number;
  lastMaintenanceDate?: Date;
  lastUsedDate?: Date;
}

export interface ComputerDetailsDTO extends ComputerDTO {
  currentSession?: SessionDTO;
  recentSessions: SessionSummaryDTO[];
}

export interface CreateComputerDTO {
  name: string;
  ipAddress: string;
  specifications: string;
  location: string;
  hourlyRate: number;
}

export interface UpdateComputerDTO {
  name: string;
  ipAddress: string;
  specifications: string;
  location: string;
  hourlyRate: number;
}

export interface ComputerStatusUpdateDTO {
  computerId: number;
  status: number;
  reason?: string;
}
// Session DTOs
export interface SessionDTO {
  id: number;
  userId: number;
  userName: string;
  computerId: number;
  computerName: string;
  startTime: Date;
  endTime?: Date;
  duration: string;
  totalCost: number;
  status: number;
  notes?: string;
}

export interface SessionDetailsDTO extends SessionDTO {
  transactions: TransactionDTO[];
}

export interface SessionSummaryDTO {
  id: number;
  computerId: number;
  computerName: string;
  startTime: Date;
  endTime?: Date;
  duration: string;
  totalCost: number;
  status: number;
}

export interface StartSessionDTO {
  userId: number;
  computerId: number;
}

export interface EndSessionDTO {
  sessionId: number;
  notes?: string;
}

// Account DTOs
export interface AccountDTO {
  id: number;
  userId: number;
  balance: number;
  lastDepositDate: Date;
  lastUsageDate: Date;
  userName: string;
}

export interface AccountDetailsDTO extends AccountDTO {
  recentTransactions: TransactionDTO[];
}

export interface DepositDTO {
  accountId: number;
  amount: number;
  paymentMethod: number;
  referenceNumber?: string;
}

export interface WithdrawDTO {
  accountId: number;
  amount: number;
  reason?: string;
}

export interface SessionChargeDTO {
  accountId: number;
  sessionId: number;
  amount: number;
}
// Transaction DTOs
export interface TransactionDTO {
  id: number;
  accountId: number;
  userId?: number;
  userName?: string;
  sessionId?: number;
  amount: number;
  type: number;
  paymentMethod?: number;
  referenceNumber?: string;
  description?: string;
  timestamp: Date;
}

export interface UserDTO {
  id: number;
  username: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  address?: string;
  dateOfBirth: Date;
  role: number;
  lastLoginTime: Date;
  creationDate: Date;
  status: number;
}

export interface CreateUserDTO {
  username: string;
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
  address?: string;
  dateOfBirth: Date;
  role: number;
}

export interface UpdateUserDTO {
  email: string;
  fullName: string;
  phoneNumber?: string;
  address?: string;
  dateOfBirth: Date;
}

export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
