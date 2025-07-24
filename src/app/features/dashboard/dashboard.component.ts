import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { TransactionService } from '../../services/transaction.service';
import { AuthService } from '../../services/auth.service';
import { Account, AccountSummary } from '../../models/account.model';
import { Transaction } from '../../models/transaction.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  accounts: Account[] = [];
  recentTransactions: Transaction[] = [];
  accountSummary: AccountSummary | null = null;
  pendingTransactionsCount = 0;
  currentDate = new Date();

  // Nuevas propiedades para el diseño mejorado
  totalBalance = 0;
  activeAccounts = 0;
  totalAccounts = 0;
  monthlyTransactions = 0;

  constructor(
    private accountService: AccountService,
    private transactionService: TransactionService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadAccounts();
    this.loadRecentTransactions();
    this.loadPendingTransactionsCount();
  }

  private loadUserData(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  private loadAccounts(): void {
    this.accountService.getAccounts().subscribe({
      next: (accounts) => {
        this.accounts = accounts;
        this.calculateAccountMetrics();
      },
      error: (error) => {
        console.error('Error loading accounts:', error);
      }
    });
  }

  private loadRecentTransactions(): void {
    this.transactionService.getTransactions().subscribe({
      next: (transactions) => {
        this.recentTransactions = transactions.slice(0, 5);
        this.calculateTransactionMetrics();
      },
      error: (error) => {
        console.error('Error loading transactions:', error);
      }
    });
  }

  private loadPendingTransactionsCount(): void {
    this.transactionService.getPendingTransactionsCount().subscribe({
      next: (count) => {
        this.pendingTransactionsCount = count;
      },
      error: (error) => {
        console.error('Error loading pending transactions count:', error);
      }
    });
  }

  private calculateAccountMetrics(): void {
    this.totalAccounts = this.accounts.length;
    this.activeAccounts = this.accounts.filter(account => account.status === 'ACTIVE').length;
    this.totalBalance = this.accounts.reduce((sum, account) => sum + account.balance, 0);
  }

  private calculateTransactionMetrics(): void {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    this.monthlyTransactions = this.recentTransactions.filter(transaction => {
      const transactionDate = new Date(transaction.createdAt);
      return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
    }).length;
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  navigateToPendingTransactions(): void {
    this.router.navigate(['/transactions/pending']);
  }

  createNewAccount(): void {
    this.router.navigate(['/accounts']);
  }

  getTransactionIconClass(type: string): string {
    switch (type) {
      case 'DEPOSIT':
        return 'bg-green-500';
      case 'WITHDRAWAL':
        return 'bg-red-500';
      case 'TRANSFER':
        return 'bg-blue-500';
      case 'PAYMENT':
        return 'bg-purple-500';
      case 'FEE':
        return 'bg-orange-500';
      case 'INTEREST':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  }

  getAccountTypeInitial(type: string): string {
    switch (type) {
      case 'CHECKING':
        return 'C';
      case 'SAVINGS':
        return 'S';
      case 'CREDIT':
        return 'CR';
      case 'INVESTMENT':
        return 'I';
      default:
        return 'A';
    }
  }

  getAccountTypeLabel(type: string): string {
    switch (type) {
      case 'CHECKING':
        return 'Cuenta Corriente';
      case 'SAVINGS':
        return 'Cuenta de Ahorros';
      case 'CREDIT':
        return 'Tarjeta de Crédito';
      case 'INVESTMENT':
        return 'Cuenta de Inversión';
      default:
        return 'Cuenta';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'ACTIVE':
        return 'Activa';
      case 'INACTIVE':
        return 'Inactiva';
      case 'SUSPENDED':
        return 'Suspendida';
      case 'CLOSED':
        return 'Cerrada';
      case 'PENDING':
        return 'Pendiente';
      case 'COMPLETED':
        return 'Completada';
      case 'FAILED':
        return 'Fallida';
      case 'CANCELLED':
        return 'Cancelada';
      default:
        return status;
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'ACTIVE':
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'INACTIVE':
      case 'SUSPENDED':
        return 'bg-gray-100 text-gray-800';
      case 'FAILED':
      case 'CANCELLED':
      case 'CLOSED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
} 