import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen flex">
      <!-- Left Side - Background with Pattern -->
      <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 via-green-700 to-blue-800 relative overflow-hidden">
        <!-- Background Pattern -->
        <div class="absolute inset-0 opacity-10">
          <div class="absolute inset-0" style="background-image: url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>
        </div>
        
        <!-- Content -->
        <div class="relative z-10 flex flex-col justify-center px-12 text-white">
          <div class="mb-8">
            <h1 class="text-4xl font-bold mb-4">MyBank</h1>
            <p class="text-xl text-green-100">Únete a la revolución bancaria</p>
          </div>
          
          <div class="space-y-6">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <span class="text-lg">Cuenta gratuita sin comisiones</span>
            </div>
            
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <span class="text-lg">Transferencias instantáneas</span>
            </div>
            
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <span class="text-lg">Aplicación móvil disponible</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Side - Register Form -->
      <div class="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div class="max-w-md w-full space-y-8">
          <!-- Mobile Logo -->
          <div class="lg:hidden text-center">
            <h1 class="text-3xl font-bold text-gradient">MyBank</h1>
            <p class="text-gray-600 mt-2">Únete a la revolución bancaria</p>
          </div>

          <!-- Form Header -->
          <div class="text-center">
            <h2 class="text-3xl font-bold text-gray-900 mb-2">Crear cuenta</h2>
            <p class="text-gray-600">Comienza tu viaje financiero hoy</p>
          </div>

          <!-- Register Form -->
          <form class="mt-8 space-y-6" [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <div class="space-y-4">
              <!-- Username Field -->
              <div>
                <label for="username" class="form-label">Nombre de usuario</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                  <input 
                    id="username" 
                    name="username" 
                    type="text" 
                    formControlName="username" 
                    required
                    class="input-field pl-10"
                    placeholder="Ingresa tu nombre de usuario"
                    [class.border-red-500]="registerForm.get('username')?.invalid && registerForm.get('username')?.touched"
                  />
                </div>
                <div *ngIf="registerForm.get('username')?.invalid && registerForm.get('username')?.touched" class="error-message">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  El nombre de usuario es requerido
                </div>
              </div>

              <!-- Email Field -->
              <div>
                <label for="email" class="form-label">Correo electrónico</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <input 
                    id="email" 
                    name="email" 
                    type="email" 
                    formControlName="email" 
                    required
                    class="input-field pl-10"
                    placeholder="Ingresa tu correo electrónico"
                    [class.border-red-500]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
                  />
                </div>
                <div *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched" class="error-message">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Ingresa un correo electrónico válido
                </div>
              </div>

              <!-- First Name Field -->
              <div>
                <label for="firstName" class="form-label">Nombre</label>
                <input 
                  id="firstName" 
                  name="firstName" 
                  type="text" 
                  formControlName="firstName" 
                  required
                  class="input-field"
                  placeholder="Ingresa tu nombre"
                  [class.border-red-500]="registerForm.get('firstName')?.invalid && registerForm.get('firstName')?.touched"
                />
                <div *ngIf="registerForm.get('firstName')?.invalid && registerForm.get('firstName')?.touched" class="error-message">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  El nombre es requerido
                </div>
              </div>

              <!-- Last Name Field -->
              <div>
                <label for="lastName" class="form-label">Apellido</label>
                <input 
                  id="lastName" 
                  name="lastName" 
                  type="text" 
                  formControlName="lastName" 
                  required
                  class="input-field"
                  placeholder="Ingresa tu apellido"
                  [class.border-red-500]="registerForm.get('lastName')?.invalid && registerForm.get('lastName')?.touched"
                />
                <div *ngIf="registerForm.get('lastName')?.invalid && registerForm.get('lastName')?.touched" class="error-message">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  El apellido es requerido
                </div>
              </div>

              <!-- Password Field -->
              <div>
                <label for="password" class="form-label">Contraseña</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                  </div>
                  <input 
                    id="password" 
                    name="password" 
                    type="password" 
                    formControlName="password" 
                    required
                    class="input-field pl-10"
                    placeholder="Ingresa tu contraseña"
                    [class.border-red-500]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
                  />
                </div>
                <div *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched" class="error-message">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  La contraseña debe tener al menos 6 caracteres
                </div>
              </div>
            </div>

            <!-- Error Message -->
            <div *ngIf="errorMessage" class="bg-red-50 border border-red-200 rounded-lg p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-red-800">Error de registro</h3>
                  <div class="mt-2 text-sm text-red-700">
                    {{ errorMessage }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Submit Button -->
            <div>
              <button 
                type="submit" 
                [disabled]="registerForm.invalid || isLoading"
                class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out transform hover:scale-105"
              >
                <span *ngIf="isLoading" class="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                <span *ngIf="!isLoading" class="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                  </svg>
                </span>
                {{ isLoading ? 'Creando cuenta...' : 'Crear Cuenta' }}
              </button>
            </div>

            <!-- Login Link -->
            <div class="text-center">
              <p class="text-sm text-gray-600">
                ¿Ya tienes una cuenta? 
                <a routerLink="/auth/login" class="font-medium text-mybank-blue-600 hover:text-mybank-blue-500 transition-colors duration-200">
                  Inicia sesión aquí
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      this.authService.register(this.registerForm.value).subscribe({
        next: (user) => {
          this.isLoading = false;
          console.log('Usuario registrado exitosamente:', user);
          // Redirigir al login después del registro exitoso
          this.router.navigate(['/auth/login'], {
            queryParams: { 
              message: 'Cuenta creada exitosamente. Por favor, inicia sesión.',
              username: user.username 
            }
          });
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Error al crear la cuenta. Inténtalo de nuevo.';
        }
      });
    }
  }
} 