import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { Account, AccountType, CreateAccountRequest } from '../../models/account.model';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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
          <h1 class="text-3xl font-bold text-gray-900">Mis Cuentas</h1>
          <p class="text-gray-600">Gestiona tus cuentas bancarias</p>
        </div>
        <button 
          (click)="showCreateModal = true"
          class="btn-primary"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Nueva Cuenta
        </button>
      </div>

      <!-- Accounts Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          *ngFor="let account of accounts" 
          class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
        >
          <!-- Account Header -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-mybank-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-mybank-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-lg font-medium text-gray-900">{{ account.accountNumber }}</h3>
                <p class="text-sm text-gray-500">{{ getAccountTypeLabel(account.accountType) }}</p>
              </div>
            </div>
            <span 
              class="px-2 py-1 text-xs font-medium rounded-full"
              [ngClass]="getStatusClass(account.status)"
            >
              {{ getStatusLabel(account.status) }}
            </span>
          </div>

          <!-- Account Balance -->
          <div class="mb-4">
            <p class="text-sm text-gray-500">Balance</p>
            <p class="text-2xl font-bold text-gray-900">{{ account.balance | number }}</p>
            <p class="text-sm text-gray-500">{{ account.currency }}</p>
          </div>

          <!-- Account Actions -->
          <div class="mt-4 flex items-center justify-between">
            <div class="flex space-x-3">
              <button
                (click)="onViewAccountDetails(account)"
                class="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                Ver Detalles
              </button>
              <button
                (click)="onViewAccountTransactions(account)"
                class="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
                Transacciones
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!accounts.length" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No hay cuentas</h3>
        <p class="mt-1 text-sm text-gray-500">Crea tu primera cuenta para comenzar</p>
        <div class="mt-6">
          <button 
            (click)="showCreateModal = true"
            class="btn-primary"
          >
            Crear Cuenta
          </button>
        </div>
      </div>

      <!-- Account Details Modal -->
      <div *ngIf="showDetailsModal && selectedAccount" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
          <div class="mt-3">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium text-gray-900">Detalles de la Cuenta</h3>
              <button (click)="closeDetailsModal()" class="text-gray-400 hover:text-gray-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Número de Cuenta</label>
                <p class="mt-1 text-sm text-gray-900">{{ selectedAccount.accountNumber }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Tipo de Cuenta</label>
                <p class="mt-1 text-sm text-gray-900">{{ getAccountTypeLabel(selectedAccount.accountType) }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Balance</label>
                <p class="mt-1 text-2xl font-bold text-gray-900">{{ selectedAccount.balance | number }}</p>
                <p class="mt-1 text-sm text-gray-500">{{ selectedAccount.currency }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Estado</label>
                <span 
                  class="mt-1 inline-flex px-2 py-1 text-xs font-medium rounded-full"
                  [ngClass]="getStatusClass(selectedAccount.status)"
                >
                  {{ getStatusLabel(selectedAccount.status) }}
                </span>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Fecha de Creación</label>
                <p class="mt-1 text-sm text-gray-900">{{ selectedAccount.createdAt | date:'medium' }}</p>
              </div>
            </div>
            <div class="flex justify-end space-x-3 pt-4 border-t">
              <button (click)="closeDetailsModal()" class="btn-secondary">
                Cerrar
              </button>
              <button (click)="onViewAccountTransactions(selectedAccount); closeDetailsModal()" class="btn-primary">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
                Ver Transacciones
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Create Account Modal -->
      <div *ngIf="showCreateModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
          <div class="mt-3">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium text-gray-900">Crear Nueva Cuenta</h3>
              <button (click)="closeCreateModal()" class="text-gray-400 hover:text-gray-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <form [formGroup]="createAccountForm" (ngSubmit)="onCreateAccount()">
              <div class="space-y-4">
                <div>
                  <label for="accountType" class="form-label">Tipo de Cuenta</label>
                  <select 
                    id="accountType" 
                    formControlName="accountType"
                    class="input-field"
                  >
                    <option value="">Selecciona un tipo</option>
                    <option value="SAVINGS">Cuenta de Ahorros</option>
                    <option value="CHECKING">Cuenta Corriente</option>
                    <option value="CREDIT">Tarjeta de Crédito</option>
                    <option value="INVESTMENT">Cuenta de Inversión</option>
                  </select>
                </div>
                <div>
                  <label for="initialBalance" class="form-label">Balance Inicial (Opcional)</label>
                  <input 
                    id="initialBalance" 
                    type="number" 
                    formControlName="initialBalance"
                    class="input-field"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>
              <div class="flex justify-end space-x-3 pt-4 border-t mt-6">
                <button type="button" (click)="closeCreateModal()" class="btn-secondary">
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  [disabled]="createAccountForm.invalid || isCreating"
                  class="btn-primary"
                >
                  {{ isCreating ? 'Creando...' : 'Crear Cuenta' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class AccountsComponent implements OnInit {
  accounts: Account[] = [];
  showDetailsModal = false;
  showCreateModal = false;
  selectedAccount: Account | null = null;
  isCreating = false;
  createAccountForm: FormGroup;
  
  // Notifications
  showNotification = false;
  notificationMessage = '';
  notificationType: 'success' | 'error' = 'success';

  constructor(
    private accountService: AccountService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.createAccountForm = this.fb.group({
      accountType: ['', Validators.required],
      initialBalance: [0]
    });
  }

  ngOnInit(): void {
    this.loadAccounts();
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

  onViewAccountDetails(account: Account): void {
    this.selectedAccount = account;
    this.showDetailsModal = true;
  }

  onViewAccountTransactions(account: Account): void {
    this.router.navigate(['/transactions'], {
      queryParams: { accountId: account.id, accountNumber: account.accountNumber }
    });
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedAccount = null;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
    this.createAccountForm.reset();
  }

  onCreateAccount(): void {
    console.log('Creating account with data:', this.createAccountForm.value);
    
    if (this.createAccountForm.valid) {
      this.isCreating = true;
      const accountData: CreateAccountRequest = this.createAccountForm.value;

      console.log('Sending account data:', accountData);

      this.accountService.createAccount(accountData).subscribe({
        next: (createdAccount) => {
          console.log('Account created successfully:', createdAccount);
          this.isCreating = false;
          this.closeCreateModal();
          this.loadAccounts();
          this.showNotificationMessage('Cuenta creada exitosamente', 'success');
        },
        error: (error) => {
          console.error('Error creating account:', error);
          this.isCreating = false;
          
          if (error.status === 401) {
            this.showNotificationMessage('Sesión expirada. Por favor, inicia sesión nuevamente.', 'error');
          } else if (error.status === 400) {
            this.showNotificationMessage(`Error de validación: ${error.error?.message || 'Datos inválidos'}`, 'error');
          } else {
            this.showNotificationMessage('Error al crear la cuenta. Por favor, intenta de nuevo.', 'error');
          }
        }
      });
    } else {
      this.showNotificationMessage('Por favor, completa todos los campos requeridos.', 'error');
    }
  }

  getAccountTypeLabel(type: AccountType): string {
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
      default:
        return status;
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800';
      case 'SUSPENDED':
        return 'bg-yellow-100 text-yellow-800';
      case 'CLOSED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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