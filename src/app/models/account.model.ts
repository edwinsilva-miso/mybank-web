export interface Account {
  id: number;
  accountNumber: string;
  accountType: AccountType;
  balance: number;
  currency: string;
  status: AccountStatus;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export enum AccountType {
  SAVINGS = 'SAVINGS',
  CHECKING = 'CHECKING',
  CREDIT = 'CREDIT',
  INVESTMENT = 'INVESTMENT'
}

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  CLOSED = 'CLOSED'
}

export interface CreateAccountRequest {
  accountType: AccountType;
  initialBalance?: number;
}

export interface AccountSummary {
  totalAccounts: number;
  totalBalance: number;
  activeAccounts: number;
  accounts: Account[];
} 