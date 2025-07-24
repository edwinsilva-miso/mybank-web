import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Mi Perfil</h1>
        <p class="text-gray-600">Gestiona tu información personal</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Profile Card -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="text-center">
              <div class="w-24 h-24 bg-mybank-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-white text-2xl font-bold">
                  {{ getUserInitials() }}
                </span>
              </div>
              <h3 class="text-lg font-medium text-gray-900">
                {{ currentUser?.firstName }} {{ currentUser?.lastName }}
              </h3>
              <p class="text-sm text-gray-500">{{ currentUser?.email }}</p>
              <p class="text-sm text-gray-500">{{ currentUser?.username }}</p>
            </div>
            
            <div class="mt-6 space-y-4">
              <div class="flex items-center text-sm text-gray-600">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                Miembro desde {{ currentUser?.createdAt | date:'mediumDate' }}
              </div>
              <div class="flex items-center text-sm text-gray-600">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Cuenta {{ currentUser?.isActive ? 'Activa' : 'Inactiva' }}
              </div>
            </div>
          </div>
        </div>

        <!-- Profile Form -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">Información Personal</h3>
            </div>
            
            <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="p-6 space-y-6">
              <!-- Personal Information -->
              <div>
                <h4 class="text-md font-medium text-gray-900 mb-4">Información Básica</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label for="firstName" class="form-label">Nombre</label>
                    <input 
                      id="firstName" 
                      type="text" 
                      formControlName="firstName"
                      class="input-field"
                      placeholder="Tu nombre"
                    />
                    <div *ngIf="profileForm.get('firstName')?.invalid && profileForm.get('firstName')?.touched" class="error-message">
                      El nombre es requerido
                    </div>
                  </div>
                  
                  <div>
                    <label for="lastName" class="form-label">Apellido</label>
                    <input 
                      id="lastName" 
                      type="text" 
                      formControlName="lastName"
                      class="input-field"
                      placeholder="Tu apellido"
                    />
                    <div *ngIf="profileForm.get('lastName')?.invalid && profileForm.get('lastName')?.touched" class="error-message">
                      El apellido es requerido
                    </div>
                  </div>
                </div>
              </div>

              <!-- Contact Information -->
              <div>
                <h4 class="text-md font-medium text-gray-900 mb-4">Información de Contacto</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label for="email" class="form-label">Correo Electrónico</label>
                    <input 
                      id="email" 
                      type="email" 
                      formControlName="email"
                      class="input-field"
                      placeholder="tu@email.com"
                    />
                    <div *ngIf="profileForm.get('email')?.invalid && profileForm.get('email')?.touched" class="error-message">
                      Ingresa un correo electrónico válido
                    </div>
                  </div>
                  
                  <div>
                    <label for="phone" class="form-label">Teléfono</label>
                    <input 
                      id="phone" 
                      type="tel" 
                      formControlName="phone"
                      class="input-field"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </div>

              <!-- Address Information -->
              <div>
                <h4 class="text-md font-medium text-gray-900 mb-4">Dirección</h4>
                <div class="space-y-4">
                  <div>
                    <label for="address" class="form-label">Dirección</label>
                    <input 
                      id="address" 
                      type="text" 
                      formControlName="address"
                      class="input-field"
                      placeholder="123 Calle Principal"
                    />
                  </div>
                  
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label for="city" class="form-label">Ciudad</label>
                      <input 
                        id="city" 
                        type="text" 
                        formControlName="city"
                        class="input-field"
                        placeholder="Ciudad"
                      />
                    </div>
                    
                    <div>
                      <label for="country" class="form-label">País</label>
                      <input 
                        id="country" 
                        type="text" 
                        formControlName="country"
                        class="input-field"
                        placeholder="País"
                      />
                    </div>
                    
                    <div>
                      <label for="postalCode" class="form-label">Código Postal</label>
                      <input 
                        id="postalCode" 
                        type="text" 
                        formControlName="postalCode"
                        class="input-field"
                        placeholder="12345"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Additional Information -->
              <div>
                <h4 class="text-md font-medium text-gray-900 mb-4">Información Adicional</h4>
                <div>
                  <label for="dateOfBirth" class="form-label">Fecha de Nacimiento</label>
                  <input 
                    id="dateOfBirth" 
                    type="date" 
                    formControlName="dateOfBirth"
                    class="input-field"
                  />
                </div>
              </div>

              <!-- Success/Error Messages -->
              <div *ngIf="successMessage" class="bg-green-50 border border-green-200 rounded-lg p-4">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-green-800">Perfil actualizado</h3>
                    <div class="mt-2 text-sm text-green-700">
                      {{ successMessage }}
                    </div>
                  </div>
                </div>
              </div>

              <div *ngIf="errorMessage" class="bg-red-50 border border-red-200 rounded-lg p-4">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-red-800">Error al actualizar</h3>
                    <div class="mt-2 text-sm text-red-700">
                      {{ errorMessage }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Submit Button -->
              <div class="flex justify-end">
                <button 
                  type="submit" 
                  [disabled]="profileForm.invalid || isUpdating"
                  class="btn-primary"
                >
                  <svg *ngIf="isUpdating" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ isUpdating ? 'Actualizando...' : 'Actualizar Perfil' }}
                </button>
              </div>
            </form>
          </div>

          <!-- Security Section -->
          <div class="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">Seguridad</h3>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="text-sm font-medium text-gray-900">Contraseña</h4>
                    <p class="text-sm text-gray-500">Última actualización hace 30 días</p>
                  </div>
                  <button class="btn-secondary">
                    Cambiar Contraseña
                  </button>
                </div>
                
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="text-sm font-medium text-gray-900">Autenticación de dos factores</h4>
                    <p class="text-sm text-gray-500">Aumenta la seguridad de tu cuenta</p>
                  </div>
                  <button class="btn-secondary">
                    Configurar
                  </button>
                </div>
                
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="text-sm font-medium text-gray-900">Sesiones activas</h4>
                    <p class="text-sm text-gray-500">Gestiona tus sesiones activas</p>
                  </div>
                  <button class="btn-secondary">
                    Ver Sesiones
                  </button>
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
export class ProfileComponent implements OnInit {
  currentUser: User | null = null;
  profileForm: FormGroup;
  isUpdating = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      address: [''],
      city: [''],
      country: [''],
      postalCode: [''],
      dateOfBirth: ['']
    });
  }

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.profileForm.patchValue({
        firstName: this.currentUser.firstName,
        lastName: this.currentUser.lastName,
        email: this.currentUser.email,
        phone: this.currentUser.phone || '',
        address: this.currentUser.address || '',
        city: this.currentUser.city || '',
        country: this.currentUser.country || '',
        postalCode: this.currentUser.postalCode || '',
        dateOfBirth: this.currentUser.dateOfBirth || ''
      });
    }
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.isUpdating = true;
      this.successMessage = '';
      this.errorMessage = '';

      // Simulate API call
      setTimeout(() => {
        this.isUpdating = false;
        this.successMessage = 'Tu perfil ha sido actualizado exitosamente.';
        
        // Update local user data
        if (this.currentUser) {
          this.currentUser = {
            ...this.currentUser,
            ...this.profileForm.value
          };
        }
      }, 1000);
    }
  }

  getUserInitials(): string {
    if (!this.currentUser) return '';
    return `${this.currentUser.firstName.charAt(0)}${this.currentUser.lastName.charAt(0)}`.toUpperCase();
  }
} 