import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { Account, CreateAccountRequest, AccountSummary } from '../models/account.model';
import { ApiResponse } from '../models/user.model';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getAccounts(): Observable<Account[]> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('User not authenticated'));
    }
    
    return this.http.get<ApiResponse<Account[]>>(`${environment.apiUrl}/accounts/user/${currentUser.id}`)
      .pipe(
        map(response => response.data || []),
        catchError(this.handleError)
      );
  }

  getAccountById(id: number): Observable<Account> {
    return this.http.get<ApiResponse<Account>>(`${environment.apiUrl}/accounts/${id}`)
      .pipe(
        map(response => response.data!),
        catchError(this.handleError)
      );
  }

  getAccountByNumber(accountNumber: string): Observable<Account> {
    return this.http.get<ApiResponse<Account>>(`${environment.apiUrl}/accounts/number/${accountNumber}`)
      .pipe(
        map(response => response.data!),
        catchError(this.handleError)
      );
  }

  createAccount(accountData: CreateAccountRequest): Observable<Account> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('User not authenticated'));
    }

    const url = `${environment.apiUrl}/accounts?userId=${currentUser.id}`;
    
    return this.http.post<ApiResponse<Account>>(url, accountData)
      .pipe(
        map(response => response.data!),
        catchError(this.handleError)
      );
  }

  getAccountSummary(): Observable<AccountSummary> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('User not authenticated'));
    }

    // Como no hay endpoint de summary, vamos a obtener las cuentas y calcular el resumen
    return this.getAccounts().pipe(
      map(accounts => {
        const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
        const activeAccounts = accounts.filter(account => account.status === 'ACTIVE').length;
        
        return {
          totalAccounts: accounts.length,
          totalBalance: totalBalance,
          activeAccounts: activeAccounts,
          accounts: accounts
        };
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('Account service error:', error);
    return throwError(() => error);
  }
} 