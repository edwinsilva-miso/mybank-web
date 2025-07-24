import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen flex">
      <!-- Left Side - Background with Pattern -->
      <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
        <!-- Background Pattern -->
        <div class="absolute inset-0 opacity-10">
          <div class="absolute inset-0" style="background-image: url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>
        </div>
        
        <!-- Content -->
        <div class="relative z-10 flex flex-col justify-center px-12 text-white">
          <div class="mb-8">
            <h1 class="text-4xl font-bold mb-4">MyBank</h1>
            <p class="text-xl text-blue-100">Tu banco digital del futuro</p>
          </div>
          
          <div class="space-y-6">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <span class="text-lg">Gestión completa de cuentas</span>
            </div>
            
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <span class="text-lg">Transacciones en tiempo real</span>
            </div>
            
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <span class="text-lg">Seguridad de nivel bancario</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Side - Login Form -->
      <div class="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div class="max-w-md w-full space-y-8">
          <!-- Mobile Logo -->
          <div class="lg:hidden text-center">
            <h1 class="text-3xl font-bold text-gradient">MyBank</h1>
            <p class="text-gray-600 mt-2">Tu banco digital del futuro</p>
          </div>

          <!-- Form Header -->
          <div class="text-center">
            <h2 class="text-3xl font-bold text-gray-900 mb-2">Inicia sesión</h2>
            <p class="text-gray-600">Accede a tu cuenta para continuar</p>
          </div>

          <!-- Login Form -->
          <form class="mt-8 space-y-6" [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <div class="space-y-4">
              <!-- Username/Email Field -->
              <div>
                <label for="usernameOrEmail" class="form-label">Usuario o Email</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                  <input 
                    id="usernameOrEmail" 
                    name="usernameOrEmail" 
                    type="text" 
                    formControlName="usernameOrEmail" 
                    required
                    class="input-field pl-10"
                    placeholder="Ingresa tu usuario o email"
                    [class.border-red-500]="loginForm.get('usernameOrEmail')?.invalid && loginForm.get('usernameOrEmail')?.touched"
                    [class.focus:ring-red-500]="loginForm.get('usernameOrEmail')?.invalid && loginForm.get('usernameOrEmail')?.touched"
                  />
                </div>
                <div *ngIf="loginForm.get('usernameOrEmail')?.invalid && loginForm.get('usernameOrEmail')?.touched" class="error-message">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  El usuario o email es requerido
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
                    [class.border-red-500]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                    [class.focus:ring-red-500]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                  />
                </div>
                <div *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" class="error-message">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  La contraseña es requerida
                </div>
              </div>
            </div>

            <!-- Success Message -->
            <div *ngIf="successMessage" class="bg-green-50 border border-green-200 rounded-lg p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-green-800">¡Éxito!</h3>
                  <div class="mt-2 text-sm text-green-700">
                    {{ successMessage }}
                  </div>
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
                  <h3 class="text-sm font-medium text-red-800">Error de autenticación</h3>
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
                [disabled]="loginForm.invalid || isLoading"
                class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out transform hover:scale-105"
              >
                <span *ngIf="isLoading" class="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                <span *ngIf="!isLoading" class="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                  </svg>
                </span>
                {{ isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
              </button>
            </div>

            <!-- Register Link -->
            <div class="text-center">
              <p class="text-sm text-gray-600">
                ¿No tienes una cuenta? 
                <a routerLink="/auth/register" class="font-medium text-mybank-blue-600 hover:text-mybank-blue-500 transition-colors duration-200">
                  Regístrate aquí
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
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      usernameOrEmail: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Leer parámetros de query string
    this.route.queryParams.subscribe(params => {
      if (params['message']) {
        this.successMessage = params['message'];
        // Limpiar el mensaje después de 5 segundos
        setTimeout(() => {
          this.successMessage = '';
        }, 5000);
      }
      
      // Pre-llenar el username si viene del registro
      if (params['username']) {
        this.loginForm.patchValue({
          usernameOrEmail: params['username']
        });
      }
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Error al iniciar sesión. Inténtalo de nuevo.';
        }
      });
    }
  }
} 