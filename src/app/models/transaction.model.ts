export interface Transaction {
  id: number;
  transactionType: TransactionType;
  amount: number;
  currency: string;
  description: string;
  accountId: number;
  accountNumber: string;
  status: TransactionStatus;
  referenceNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionRequest {
  type: TransactionType; // El backend espera 'type' en lugar de 'transactionType'
  amount: number;
  currency: string;
  description: string;
  accountId: number;
  destinationAccountId?: number; // Para transferencias
  referenceNumber?: string;
}

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  TRANSFER = 'TRANSFER',
  PAYMENT = 'PAYMENT',
  FEE = 'FEE',
  INTEREST = 'INTEREST'
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

export interface TransactionFilter {
  accountId?: number;
  transactionType?: TransactionType;
  status?: TransactionStatus;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

export interface TransactionSummary {
  totalTransactions: number;
  totalAmount: number;
  transactions: Transaction[];
} 