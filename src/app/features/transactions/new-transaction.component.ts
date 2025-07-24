import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TransactionService } from '../../services/transaction.service';
import { AccountService } from '../../services/account.service';
import { AuthService } from '../../services/auth.service';
import { Transaction, TransactionType, CreateTransactionRequest } from '../../models/transaction.model';
import { Account } from '../../models/account.model';

@Component({
  selector: 'app-new-transaction',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <button 
          (click)="goBack()"
          class="flex items-center text-mybank-blue-600 hover:text-mybank-blue-700 mb-4"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          Volver a Transacciones
        </button>
        <h1 class="text-3xl font-bold text-gray-900">Nueva Transacción</h1>
        <p class="text-gray-600 mt-2">Realiza una nueva transacción bancaria</p>
      </div>

      <!-- Error Message -->
      <div *ngIf="errorMessage" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-red-700">{{ errorMessage }}</p>
      </div>

      <!-- Transaction Form -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form (ngSubmit)="onSubmit()" #transactionForm="ngForm">
          <!-- Transaction Type -->
          <div class="mb-6">
            <label class="form-label">Tipo de Transacción *</label>
            <select 
              [(ngModel)]="transaction.transactionType"
              name="transactionType"
              required
              class="input-field"
              (change)="onTransactionTypeChange()"
            >
              <option value="">Selecciona el tipo</option>
              <option value="DEPOSIT">Depósito</option>
              <option value="WITHDRAWAL">Retiro</option>
              <option value="TRANSFER">Transferencia</option>
              <option value="PAYMENT">Pago</option>
            </select>
          </div>

          <!-- Account Selection -->
          <div class="mb-6">
            <label class="form-label">Cuenta Origen *</label>
            <select 
              [(ngModel)]="transaction.accountId"
              name="accountId"
              required
              class="input-field"
            >
              <option value="">Selecciona una cuenta</option>
              <option *ngFor="let account of accounts" [value]="account.id">
                {{ account.accountNumber }} - {{ account.accountType }} ({{ account.balance | number }})
              </option>
            </select>
          </div>

          <!-- Destination Account (for transfers) -->
          <div class="mb-6" *ngIf="transaction.transactionType === 'TRANSFER'">
            <label class="form-label">Cuenta Destino *</label>
            <select 
              [(ngModel)]="transaction.destinationAccountId"
              name="destinationAccountId"
              [required]="transaction.transactionType === 'TRANSFER'"
              class="input-field"
            >
              <option value="">Selecciona la cuenta destino</option>
              <option *ngFor="let account of destinationAccounts" [value]="account.id">
                {{ account.accountNumber }} - {{ account.accountType }}
              </option>
            </select>
          </div>

          <!-- Amount -->
          <div class="mb-6">
            <label class="form-label">Monto *</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                $
              </span>
              <input 
                type="number"
                [(ngModel)]="transaction.amount"
                name="amount"
                required
                min="0.01"
                step="0.01"
                class="input-field pl-8"
                placeholder="0.00"
              />
            </div>
          </div>

          <!-- Description -->
          <div class="mb-6">
            <label class="form-label">Descripción *</label>
            <input 
              type="text"
              [(ngModel)]="transaction.description"
              name="description"
              required
              class="input-field"
              placeholder="Descripción de la transacción"
            />
          </div>

          <!-- Reference Number -->
          <div class="mb-6">
            <label class="form-label">Número de Referencia</label>
            <input 
              type="text"
              [(ngModel)]="transaction.referenceNumber"
              name="referenceNumber"
              class="input-field"
              placeholder="Número de referencia (opcional)"
            />
          </div>

          <!-- Submit Buttons -->
          <div class="flex justify-end space-x-3 pt-6 border-t">
            <button 
              type="button"
              (click)="goBack()"
              class="btn-secondary"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              [disabled]="!isFormValid() || isSubmitting"
              class="btn-primary"
            >
              <span *ngIf="isSubmitting">Procesando...</span>
              <span *ngIf="!isSubmitting">Crear Transacción</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: []
})
export class NewTransactionComponent implements OnInit {
  transaction: any = {
    transactionType: '',
    accountId: null,
    destinationAccountId: null,
    amount: 0,
    description: '',
    referenceNumber: '',
    currency: 'USD'
  };
  
  accounts: Account[] = [];
  destinationAccounts: Account[] = [];
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private transactionService: TransactionService,
    private accountService: AccountService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Verificar si el usuario está autenticado
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      console.log('Usuario no autenticado, redirigiendo a login');
      this.router.navigate(['/auth/login']);
      return;
    }
    
    console.log('Usuario autenticado:', currentUser);
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.accountService.getAccounts().subscribe({
      next: (accounts) => {
        this.accounts = accounts;
        this.destinationAccounts = accounts.filter(account => account.status === 'ACTIVE');
        console.log('Accounts loaded:', accounts);
      },
      error: (error) => {
        console.error('Error loading accounts:', error);
        this.errorMessage = 'Error al cargar las cuentas. Por favor, intenta de nuevo.';
      }
    });
  }

  onTransactionTypeChange(): void {
    // Reset destination account when transaction type changes
    if (this.transaction.transactionType !== 'TRANSFER') {
      this.transaction.destinationAccountId = null;
    }
  }

  isFormValid(): boolean {
    if (!this.transaction.transactionType || !this.transaction.accountId || !this.transaction.amount || !this.transaction.description) {
      return false;
    }
    
    if (this.transaction.transactionType === 'TRANSFER' && !this.transaction.destinationAccountId) {
      return false;
    }
    
    if (this.transaction.amount <= 0) {
      return false;
    }
    
    return true;
  }

  onSubmit(): void {
    console.log('Form submitted:', this.transaction);
    
    if (!this.isFormValid()) {
      this.errorMessage = 'Por favor, completa todos los campos requeridos.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const newTransaction: CreateTransactionRequest = {
      type: this.transaction.transactionType as TransactionType,
      accountId: Number(this.transaction.accountId),
      amount: Number(this.transaction.amount),
      description: this.transaction.description,
      referenceNumber: this.transaction.referenceNumber || '',
      currency: this.transaction.currency
    };

    // Add destination account for transfers
    if (this.transaction.transactionType === 'TRANSFER' && this.transaction.destinationAccountId) {
      newTransaction.destinationAccountId = Number(this.transaction.destinationAccountId);
    }

    console.log('Sending transaction:', newTransaction);
    console.log('Current user token:', localStorage.getItem('auth_token'));

    this.transactionService.createTransaction(newTransaction).subscribe({
      next: (createdTransaction) => {
        console.log('Transaction created successfully:', createdTransaction);
        this.isSubmitting = false;
        this.router.navigate(['/transactions'], { 
          queryParams: { 
            success: 'true',
            transactionId: createdTransaction.id 
          }
        });
      },
      error: (error) => {
        console.error('Error creating transaction:', error);
        this.isSubmitting = false;
        
        if (error.status === 401) {
          this.errorMessage = 'Sesión expirada. Por favor, inicia sesión nuevamente.';
          // Redirect to login
          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 2000);
        } else if (error.status === 400) {
          this.errorMessage = `Error de validación: ${error.error?.message || 'Datos inválidos'}`;
        } else if (error.status === 403) {
          this.errorMessage = 'No tienes permisos para realizar esta operación.';
        } else {
          this.errorMessage = `Error al crear la transacción: ${error.message || error.statusText || 'Error desconocido'}`;
        }
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/transactions']);
  }
} 