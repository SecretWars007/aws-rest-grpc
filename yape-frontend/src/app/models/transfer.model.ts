export interface TransferRequest {
  sourcePhoneNumber: string;
  destinationPhoneNumber: string;
  amount: number;
  description?: string;
}

export interface WalletUser {
  phoneNumber: string;
  owner: string;
}

export interface TransferData {
  transactionId: string;
  source: WalletUser;
  destination: WalletUser;
  amount: number;
  description: string;
  message: string;
  timestamp: string;
}

export interface TransferResponse {
  status: 'success' | 'fail';
  data?: TransferData;
  message?: string;
  errors?: string[];
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  uptime: number;
}
