import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionService } from '../../services/transaction.service';
import { AccountService } from '../../services/account.service';
import { Transaction, TransactionType, TransactionStatus, TransactionFilter } from '../../models/transaction.model';
import { Account } from '../../models/account.model';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Notification -->
      <div *ngIf="showNotification" 
           class="mb-6 p-4 rounded-lg border"
           [ngClass]="notificationType === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <svg *ngIf="notificationType === 'success'" class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            <svg *ngIf="notificationType === 'error'" class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
            </svg>
            {{ notificationMessage }}
          </div>
          <button (click)="hideNotification()" class="text-gray-400 hover:text-gray-600">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Transacciones</h1>
          <p class="text-gray-600" *ngIf="selectedAccount">
            Cuenta: {{ selectedAccount.accountNumber }}
          </p>
        </div>
        <div class="flex space-x-3">
          <button 
            (click)="showPendingOnly()"
            class="btn-secondary"
            [class.bg-mybank-blue-600]="selectedStatus === 'PENDING'"
            [class.text-white]="selectedStatus === 'PENDING'"
          >
            Solo Pendientes
          </button>
          <button 
            (click)="processAllPendingTransactions()"
            class="btn-primary"
            [disabled]="!hasPendingTransactions() || isProcessingAll()"
          >
            <span *ngIf="isProcessingAll()">Procesando...</span>
            <span *ngIf="!isProcessingAll()">Procesar Todas las Pendientes</span>
          </button>
          <button 
            (click)="clearFilters()"
            class="btn-secondary"
            *ngIf="hasActiveFilters"
          >
            Limpiar Filtros
          </button>
          <button 
            (click)="createNewTransaction()"
            class="btn-primary"
          >
            Nueva Transacción
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Filtros</h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Account Filter -->
          <div>
            <label class="form-label">Cuenta</label>
            <select 
              [(ngModel)]="selectedAccountId"
              (change)="onAccountChange()"
              class="input-field"
            >
              <option value="">Todas las cuentas</option>
              <option *ngFor="let account of accounts" [value]="account.id">
                {{ account.accountNumber }} - {{ account.accountType }}
              </option>
            </select>
          </div>

          <!-- Transaction Type Filter -->
          <div>
            <label class="form-label">Tipo</label>
            <select 
              [(ngModel)]="selectedTransactionType"
              (change)="applyFilters()"
              class="input-field"
            >
              <option value="">Todos los tipos</option>
              <option value="DEPOSIT">Depósito</option>
              <option value="WITHDRAWAL">Retiro</option>
              <option value="TRANSFER">Transferencia</option>
              <option value="PAYMENT">Pago</option>
              <option value="FEE">Comisión</option>
              <option value="INTEREST">Interés</option>
            </select>
          </div>

          <!-- Status Filter -->
          <div>
            <label class="form-label">Estado</label>
            <select 
              [(ngModel)]="selectedStatus"
              (change)="applyFilters()"
              class="input-field"
            >
              <option value="">Todos los estados</option>
              <option value="COMPLETED">Completada</option>
              <option value="PENDING">Pendiente</option>
              <option value="FAILED">Fallida</option>
              <option value="CANCELLED">Cancelada</option>
            </select>
          </div>

          <!-- Date Range Filter -->
          <div>
            <label class="form-label">Fecha</label>
            <select 
              [(ngModel)]="selectedDateRange"
              (change)="applyFilters()"
              class="input-field"
            >
              <option value="">Todas las fechas</option>
              <option value="today">Hoy</option>
              <option value="week">Esta semana</option>
              <option value="month">Este mes</option>
              <option value="quarter">Este trimestre</option>
              <option value="year">Este año</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Transactions List -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-medium text-gray-900">
              Transacciones ({{ transactions.length }})
            </h3>
            <div class="flex items-center space-x-4">
              <div *ngIf="isProcessingAll()" class="flex items-center text-sm text-mybank-blue-600">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-mybank-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Procesando transacciones...
              </div>
              <div class="text-sm text-gray-500">
                Total: {{ getTotalAmount() | number }}
              </div>
            </div>
          </div>
        </div>
        
        <div class="divide-y divide-gray-200">
          <div 
            *ngFor="let transaction of transactions" 
            class="px-6 py-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
            (click)="onViewTransactionDetails(transaction)"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-10 h-10 rounded-lg flex items-center justify-center"
                     [ngClass]="getTransactionIconClass(transaction.transactionType)">
                  <svg class="w-6 h-6" [ngClass]="getTransactionIconColor(transaction.transactionType)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-900">{{ transaction.description }}</p>
                  <p class="text-sm text-gray-500">
                    {{ transaction.accountNumber }} • {{ transaction.referenceNumber }}
                  </p>
                  <p class="text-xs text-gray-400">{{ transaction.createdAt | date:'medium' }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium" [ngClass]="getAmountColor(transaction.transactionType)">
                  {{ getAmountPrefix(transaction.transactionType) }}{{ transaction.amount | number }}
                </p>
                <p class="text-sm text-gray-500">{{ transaction.currency }}</p>
                <div class="flex items-center justify-end space-x-2 mt-1">
                  <span 
                    class="inline-flex px-2 py-1 text-xs font-medium rounded-full"
                    [ngClass]="getStatusClass(transaction.status)"
                  >
                    {{ getStatusLabel(transaction.status) }}
                  </span>
                  <button 
                    *ngIf="transaction.status === 'PENDING'"
                    (click)="processTransaction(transaction.id, $event)"
                    class="inline-flex items-center px-2 py-1 text-xs font-medium text-white bg-mybank-blue-600 rounded hover:bg-mybank-blue-700 transition-colors duration-200"
                    [disabled]="processingTransactions.has(transaction.id)"
                  >
                    <span *ngIf="processingTransactions.has(transaction.id)">Procesando...</span>
                    <span *ngIf="!processingTransactions.has(transaction.id)">Procesar</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="!transactions.length" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No hay transacciones</h3>
          <p class="mt-1 text-sm text-gray-500">
            {{ hasActiveFilters ? 'Intenta ajustar los filtros' : 'Realiza tu primera transacción' }}
          </p>
        </div>
      </div>

      <!-- Transaction Details Modal -->
      <div *ngIf="showDetailsModal && selectedTransaction" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
          <div class="mt-3">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium text-gray-900">Detalles de la Transacción</h3>
              <button (click)="closeDetailsModal()" class="text-gray-400 hover:text-gray-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Descripción</label>
                <p class="mt-1 text-sm text-gray-900">{{ selectedTransaction.description }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Monto</label>
                <p class="mt-1 text-2xl font-bold" [ngClass]="getAmountColor(selectedTransaction.transactionType)">
                  {{ getAmountPrefix(selectedTransaction.transactionType) }}{{ selectedTransaction.amount | number }}
                </p>
                <p class="mt-1 text-sm text-gray-500">{{ selectedTransaction.currency }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Tipo</label>
                <p class="mt-1 text-sm text-gray-900">{{ getTransactionTypeLabel(selectedTransaction.transactionType) }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Estado</label>
                <span 
                  class="mt-1 inline-flex px-2 py-1 text-xs font-medium rounded-full"
                  [ngClass]="getStatusClass(selectedTransaction.status)"
                >
                  {{ getStatusLabel(selectedTransaction.status) }}
                </span>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Cuenta</label>
                <p class="mt-1 text-sm text-gray-900">{{ selectedTransaction.accountNumber }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Referencia</label>
                <p class="mt-1 text-sm text-gray-900">{{ selectedTransaction.referenceNumber }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Fecha</label>
                <p class="mt-1 text-sm text-gray-900">{{ selectedTransaction.createdAt | date:'medium' }}</p>
              </div>
            </div>
            <div class="flex justify-end pt-4 border-t mt-6">
              <button 
                *ngIf="selectedTransaction?.status === 'PENDING'"
                (click)="processTransactionFromModal()"
                class="btn-primary mr-3"
                [disabled]="processingTransactions.has(selectedTransaction.id)"
              >
                <span *ngIf="processingTransactions.has(selectedTransaction.id)">Procesando...</span>
                <span *ngIf="!processingTransactions.has(selectedTransaction.id)">Procesar Transacción</span>
              </button>
              <button (click)="closeDetailsModal()" class="btn-secondary">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class TransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  accounts: Account[] = [];
  selectedAccount: Account | null = null;
  selectedTransaction: Transaction | null = null;
  showDetailsModal = false;
  
  // Filters
  selectedAccountId: number | null = null;
  selectedTransactionType: string = '';
  selectedStatus: string = '';
  selectedDateRange: string = '';

  // Processing transactions
  processingTransactions: Set<number> = new Set();
  
  // Notifications
  showNotification = false;
  notificationMessage = '';
  notificationType: 'success' | 'error' = 'success';

  constructor(
    private transactionService: TransactionService,
    private accountService: AccountService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAccounts();
    this.loadTransactions();
    
    // Check for account filter from URL
    this.route.queryParams.subscribe(params => {
      if (params['accountId']) {
        this.selectedAccountId = parseInt(params['accountId']);
        this.loadSelectedAccount();
        this.applyFilters();
      }
    });

    // Check if we're on the pending transactions route
    this.route.url.subscribe(urlSegments => {
      if (urlSegments.some(segment => segment.path === 'pending')) {
        this.selectedStatus = 'PENDING';
        this.applyFilters();
      }
    });
  }

  loadAccounts(): void {
    this.accountService.getAccounts().subscribe({
      next: (accounts) => {
        this.accounts = accounts;
      },
      error: (error) => {
        console.error('Error loading accounts:', error);
      }
    });
  }

  loadTransactions(): void {
    const filter: TransactionFilter = {};
    
    if (this.selectedAccountId) {
      filter.accountId = this.selectedAccountId;
    }
    if (this.selectedTransactionType) {
      filter.transactionType = this.selectedTransactionType as TransactionType;
    }
    if (this.selectedStatus) {
      filter.status = this.selectedStatus as TransactionStatus;
    }
    if (this.selectedDateRange) {
      const dates = this.getDateRange(this.selectedDateRange);
      filter.startDate = dates.start;
      filter.endDate = dates.end;
    }

    this.transactionService.getTransactions(filter).subscribe({
      next: (transactions) => {
        this.transactions = transactions;
      },
      error: (error) => {
        console.error('Error loading transactions:', error);
      }
    });
  }

  loadSelectedAccount(): void {
    if (this.selectedAccountId) {
      this.accountService.getAccountById(this.selectedAccountId).subscribe({
        next: (account) => {
          this.selectedAccount = account;
        },
        error: (error) => {
          console.error('Error loading selected account:', error);
        }
      });
    }
  }

  onAccountChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.loadTransactions();
  }

  clearFilters(): void {
    this.selectedAccountId = null;
    this.selectedTransactionType = '';
    this.selectedStatus = '';
    this.selectedDateRange = '';
    this.selectedAccount = null;
    this.loadTransactions();
  }

  onViewTransactionDetails(transaction: Transaction): void {
    this.selectedTransaction = transaction;
    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedTransaction = null;
  }

  createNewTransaction(): void {
    this.router.navigate(['/transactions/new']);
  }

  processTransaction(transactionId: number, event: Event): void {
    event.stopPropagation(); // Prevent row click
    const transaction = this.transactions.find(t => t.id === transactionId);
    if (transaction && transaction.status === 'PENDING') {
      this.processingTransactions.add(transactionId);
      this.transactionService.processTransaction(transactionId).subscribe({
        next: () => {
          this.processingTransactions.delete(transactionId);
          this.loadTransactions(); // Reload transactions to update status
          this.showNotificationMessage('Transacción procesada exitosamente', 'success');
        },
        error: (error) => {
          console.error('Error processing transaction:', error);
          this.processingTransactions.delete(transactionId);
          this.showNotificationMessage('Error al procesar la transacción', 'error');
        }
      });
    }
  }

  processTransactionFromModal(): void {
    if (this.selectedTransaction && this.selectedTransaction.id) {
      this.processingTransactions.add(this.selectedTransaction.id);
      this.transactionService.processTransaction(this.selectedTransaction.id).subscribe({
        next: () => {
          this.processingTransactions.delete(this.selectedTransaction!.id);
          this.loadTransactions(); // Reload transactions to update status
          this.closeDetailsModal(); // Close modal after processing
          this.showNotificationMessage('Transacción procesada exitosamente', 'success');
        },
        error: (error) => {
          console.error('Error processing transaction from modal:', error);
          if (this.selectedTransaction) {
            this.processingTransactions.delete(this.selectedTransaction.id);
          }
          this.showNotificationMessage('Error al procesar la transacción', 'error');
        }
      });
    }
  }

  getTotalAmount(): number {
    return this.transactions.reduce((total, transaction) => {
      if (transaction.transactionType === 'DEPOSIT') {
        return total + transaction.amount;
      } else if (transaction.transactionType === 'WITHDRAWAL') {
        return total - transaction.amount;
      }
      return total;
    }, 0);
  }

  getDateRange(range: string): { start: string, end: string } {
    const now = new Date();
    const start = new Date();
    
    switch (range) {
      case 'today':
        start.setHours(0, 0, 0, 0);
        break;
      case 'week':
        start.setDate(now.getDate() - 7);
        break;
      case 'month':
        start.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        start.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        start.setFullYear(now.getFullYear() - 1);
        break;
    }
    
    return {
      start: start.toISOString(),
      end: now.toISOString()
    };
  }

  get hasActiveFilters(): boolean {
    return !!(this.selectedAccountId || this.selectedTransactionType || this.selectedStatus || this.selectedDateRange);
  }

  getTransactionIconClass(type: string): string {
    switch (type) {
      case 'DEPOSIT':
        return 'bg-mybank-green-100';
      case 'WITHDRAWAL':
        return 'bg-red-100';
      case 'TRANSFER':
        return 'bg-blue-100';
      default:
        return 'bg-gray-100';
    }
  }

  getTransactionIconColor(type: string): string {
    switch (type) {
      case 'DEPOSIT':
        return 'text-mybank-green-600';
      case 'WITHDRAWAL':
        return 'text-red-600';
      case 'TRANSFER':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  }

  getAmountPrefix(type: string): string {
    switch (type) {
      case 'DEPOSIT':
        return '+';
      case 'WITHDRAWAL':
        return '-';
      case 'TRANSFER':
        return '±';
      default:
        return '';
    }
  }

  getAmountColor(type: string): string {
    switch (type) {
      case 'DEPOSIT':
        return 'text-mybank-green-600';
      case 'WITHDRAWAL':
        return 'text-red-600';
      case 'TRANSFER':
        return 'text-blue-600';
      default:
        return 'text-gray-900';
    }
  }

  getTransactionTypeLabel(type: string): string {
    switch (type) {
      case 'DEPOSIT':
        return 'Depósito';
      case 'WITHDRAWAL':
        return 'Retiro';
      case 'TRANSFER':
        return 'Transferencia';
      case 'PAYMENT':
        return 'Pago';
      case 'FEE':
        return 'Comisión';
      case 'INTEREST':
        return 'Interés';
      default:
        return type;
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'COMPLETED':
        return 'Completada';
      case 'PENDING':
        return 'Pendiente';
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
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  showPendingOnly(): void {
    this.selectedStatus = 'PENDING';
    this.applyFilters();
  }

  processAllPendingTransactions(): void {
    const pendingTransactions = this.transactions.filter(t => t.status === 'PENDING');
    if (pendingTransactions.length === 0) {
      this.showNotificationMessage('No hay transacciones pendientes para procesar', 'error');
      return;
    }

    // Add all pending transactions to processing set
    pendingTransactions.forEach(t => this.processingTransactions.add(t.id));

    let processedCount = 0;
    let errorCount = 0;

    // Process each transaction sequentially
    const processNext = (index: number) => {
      if (index >= pendingTransactions.length) {
        // All transactions processed, reload the list
        this.loadTransactions();
        if (errorCount === 0) {
          this.showNotificationMessage(`${processedCount} transacciones procesadas exitosamente`, 'success');
        } else {
          this.showNotificationMessage(`${processedCount} procesadas, ${errorCount} con errores`, 'error');
        }
        return;
      }

      const transaction = pendingTransactions[index];
      this.transactionService.processTransaction(transaction.id).subscribe({
        next: () => {
          this.processingTransactions.delete(transaction.id);
          processedCount++;
          processNext(index + 1);
        },
        error: (error) => {
          console.error(`Error processing transaction ${transaction.id}:`, error);
          this.processingTransactions.delete(transaction.id);
          errorCount++;
          processNext(index + 1);
        }
      });
    };

    processNext(0);
  }

  hasPendingTransactions(): boolean {
    return this.transactions.some(t => t.status === 'PENDING');
  }

  isProcessingAll(): boolean {
    return this.processingTransactions.size > 0;
  }

  showNotificationMessage(message: string, type: 'success' | 'error' = 'success'): void {
    this.notificationMessage = message;
    this.notificationType = type;
    this.showNotification = true;
    setTimeout(() => {
      this.hideNotification();
    }, 5000); // Hide after 5 seconds
  }

  hideNotification(): void {
    this.showNotification = false;
    this.notificationMessage = '';
    this.notificationType = 'success';
  }
} 