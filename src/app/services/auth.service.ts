import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError, map } from 'rxjs';
import { User, LoginRequest, RegisterRequest, AuthResponse, ApiResponse } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('current_user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      } catch (error) {
        this.clearAuthData();
      }
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<ApiResponse<AuthResponse>>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.setAuthData(response.data);
          }
        }),
        map(response => response.data!),
        catchError(this.handleError)
      );
  }

  register(userData: RegisterRequest): Observable<User> {
    return this.http.post<ApiResponse<User>>(`${environment.apiUrl}/auth/register`, userData)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            // Después del registro exitoso, no establecemos la sesión automáticamente
            // El usuario debe hacer login para obtener el token
            console.log('Usuario registrado exitosamente:', response.data);
          }
        }),
        map(response => response.data!),
        catchError(this.handleError)
      );
  }

  logout(): void {
    this.clearAuthData();
    // Opcional: llamar al endpoint de logout del backend
    this.http.post(`${environment.apiUrl}/auth/logout`, {}).subscribe();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private setAuthData(authData: AuthResponse): void {
    localStorage.setItem('auth_token', authData.token);
    
    // Crear objeto User a partir de AuthResponse
    const user: User = {
      id: authData.userId,
      username: authData.username,
      email: authData.email,
      firstName: authData.firstName,
      lastName: authData.lastName,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem('current_user', JSON.stringify(user));
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
  }

  private clearAuthData(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  private handleError(error: any): Observable<never> {
    console.error('Auth service error:', error);
    return throwError(() => error);
  }
} 