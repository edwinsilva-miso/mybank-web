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
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <!-- Header Section -->
      <div class="bg-white shadow-sm border-b border-gray-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 mb-2">Bienvenido de vuelta</h1>
              <p class="text-gray-600 text-lg">Aquí tienes un resumen de tus finanzas</p>
            </div>
            <div class="flex items-center space-x-4">
              <div class="text-right">
                <p class="text-sm text-gray-500">Última actualización</p>
                <p class="text-sm font-medium text-gray-900">{{ currentDate | date:'short' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <!-- Total Balance Card -->
          <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
              </div>
              <div class="text-right">
                <span class="text-sm text-gray-500">Balance Total</span>
                <p class="text-2xl font-bold text-gray-900">{{ totalBalance | currency }}</p>
              </div>
            </div>
            <div class="flex items-center text-sm">
              <span class="text-green-600 font-medium">+2.5%</span>
              <span class="text-gray-500 ml-2">vs mes anterior</span>
            </div>
          </div>

          <!-- Active Accounts Card -->
          <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div class="text-right">
                <span class="text-sm text-gray-500">Cuentas Activas</span>
                <p class="text-2xl font-bold text-gray-900">{{ activeAccounts }}</p>
              </div>
            </div>
            <div class="flex items-center text-sm">
              <span class="text-blue-600 font-medium">{{ totalAccounts }}</span>
              <span class="text-gray-500 ml-2">cuentas en total</span>
            </div>
          </div>

          <!-- Monthly Transactions Card -->
          <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
              </div>
              <div class="text-right">
                <span class="text-sm text-gray-500">Transacciones Este Mes</span>
                <p class="text-2xl font-bold text-gray-900">{{ monthlyTransactions }}</p>
              </div>
            </div>
            <div class="flex items-center text-sm">
              <span class="text-orange-600 font-medium">+12%</span>
              <span class="text-gray-500 ml-2">vs mes anterior</span>
            </div>
          </div>

          <!-- Pending Transactions Card -->
          <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div class="text-right">
                <span class="text-sm text-gray-500">Pendientes</span>
                <p class="text-2xl font-bold text-gray-900">{{ pendingTransactionsCount }}</p>
              </div>
            </div>
            <div class="flex items-center text-sm">
              <span class="text-purple-600 font-medium">Por procesar</span>
              <button 
                *ngIf="pendingTransactionsCount > 0"
                routerLink="/transactions/pending"
                class="ml-2 text-purple-600 hover:text-purple-700 font-medium"
              >
                Ver →
              </button>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Acciones Rápidas</h2>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <button 
              routerLink="/transactions/new"
              class="flex flex-col items-center p-4 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all duration-200 group"
            >
              <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-200">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </div>
              <span class="text-sm font-medium text-gray-700">Nueva Transacción</span>
            </button>

            <button 
              routerLink="/accounts"
              class="flex flex-col items-center p-4 rounded-lg bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 transition-all duration-200 group"
            >
              <div class="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-200">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                </svg>
              </div>
              <span class="text-sm font-medium text-gray-700">Nueva Cuenta</span>
            </button>

            <button 
              routerLink="/transactions"
              class="flex flex-col items-center p-4 rounded-lg bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 transition-all duration-200 group"
            >
              <div class="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-200">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
              <span class="text-sm font-medium text-gray-700">Ver Transacciones</span>
            </button>

            <button 
              routerLink="/transactions/pending"
              class="flex flex-col items-center p-4 rounded-lg bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 transition-all duration-200 group"
            >
              <div class="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-200">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <span class="text-sm font-medium text-gray-700">Pendientes</span>
            </button>

            <button 
              routerLink="/profile"
              class="flex flex-col items-center p-4 rounded-lg bg-gradient-to-r from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 transition-all duration-200 group"
            >
              <div class="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-200">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <span class="text-sm font-medium text-gray-700">Mi Perfil</span>
            </button>
          </div>
        </div>

        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Accounts Section -->
          <div class="bg-white rounded-xl shadow-lg border border-gray-100">
            <div class="p-6 border-b border-gray-100">
              <div class="flex items-center justify-between">
                <h2 class="text-xl font-bold text-gray-900">Mis Cuentas</h2>
                <a 
                  routerLink="/accounts"
                  class="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center group"
                >
                  Ver todas
                  <svg class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </a>
              </div>
            </div>
            <div class="p-6">
              <div *ngIf="accounts.length === 0" class="text-center py-8">
                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                  </svg>
                </div>
                <p class="text-gray-500 mb-4">No tienes cuentas aún</p>
                <button 
                  routerLink="/accounts"
                  class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Crear mi primera cuenta
                </button>
              </div>
              <div *ngFor="let account of accounts.slice(0, 3)" class="flex items-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200 mb-3 last:mb-0">
                <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                  <span class="text-white font-bold text-sm">{{ getAccountTypeInitial(account.accountType) }}</span>
                </div>
                <div class="flex-1">
                  <p class="font-medium text-gray-900">{{ getAccountTypeLabel(account.accountType) }}</p>
                  <p class="text-sm text-gray-500">****{{ account.accountNumber.slice(-4) }}</p>
                </div>
                <div class="text-right">
                  <p class="font-bold text-gray-900">{{ account.balance | currency }}</p>
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {{ getStatusLabel(account.status) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Transactions Section -->
          <div class="bg-white rounded-xl shadow-lg border border-gray-100">
            <div class="p-6 border-b border-gray-100">
              <div class="flex items-center justify-between">
                <h2 class="text-xl font-bold text-gray-900">Transacciones Recientes</h2>
                <a 
                  routerLink="/transactions"
                  class="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center group"
                >
                  Ver todas
                  <svg class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </a>
              </div>
            </div>
            <div class="p-6">
              <div *ngIf="recentTransactions.length === 0" class="text-center py-8">
                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                </div>
                <p class="text-gray-500 mb-4">No hay transacciones recientes</p>
                <button 
                  routerLink="/transactions/new"
                  class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Crear mi primera transacción
                </button>
              </div>
              <div *ngFor="let transaction of recentTransactions.slice(0, 3)" class="flex items-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200 mb-3 last:mb-0">
                 <div class="w-10 h-10 rounded-lg flex items-center justify-center mr-4" 
                      [ngClass]="getTransactionIconClass(transaction.transactionType)">
                   <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path *ngIf="transaction.transactionType === 'DEPOSIT'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                     <path *ngIf="transaction.transactionType === 'WITHDRAWAL'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                     <path *ngIf="transaction.transactionType === 'TRANSFER'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                   </svg>
                 </div>
                 <div class="flex-1">
                   <p class="font-medium text-gray-900">{{ transaction.description }}</p>
                   <p class="text-sm text-gray-500">{{ transaction.createdAt | date:'short' }}</p>
                 </div>
                 <div class="text-right">
                   <p class="font-bold" [ngClass]="transaction.transactionType === 'DEPOSIT' ? 'text-green-600' : 'text-red-600'">
                     {{ transaction.transactionType === 'DEPOSIT' ? '+' : '-' }}{{ transaction.amount | currency }}
                   </p>
                   <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                         [ngClass]="getStatusClass(transaction.status)">
                     {{ getStatusLabel(transaction.status) }}
                   </span>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
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
      default:
        return 'bg-gray-500';
    }
  }

  getAccountTypeInitial(type: string): string {
    switch (type) {
      case 'SAVINGS':
        return 'S';
      case 'CHECKING':
        return 'C';
      case 'CREDIT':
        return 'CR';
      case 'INVESTMENT':
        return 'I';
      default:
        return type.charAt(0);
    }
  }

  getAccountTypeLabel(type: string): string {
    switch (type) {
      case 'SAVINGS':
        return 'Cuenta de Ahorros';
      case 'CHECKING':
        return 'Cuenta Corriente';
      case 'CREDIT':
        return 'Tarjeta de Crédito';
      case 'INVESTMENT':
        return 'Cuenta de Inversión';
      default:
        return type;
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
      case 'COMPLETED':
        return 'Completada';
      case 'PENDING':
        return 'Pendiente';
      case 'FAILED':
        return 'Fallida';
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
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      case 'INACTIVE':
      case 'SUSPENDED':
      case 'CLOSED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
} 