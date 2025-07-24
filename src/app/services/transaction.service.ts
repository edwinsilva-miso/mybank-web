import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { Transaction, TransactionFilter, TransactionSummary, CreateTransactionRequest } from '../models/transaction.model';
import { ApiResponse } from '../models/user.model';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getTransactions(filter?: TransactionFilter): Observable<Transaction[]> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('User not authenticated'));
    }

    let url = `${environment.apiUrl}/transactions/user/${currentUser.id}`;
    
    if (filter?.accountId) {
      url = `${environment.apiUrl}/transactions/account/${filter.accountId}`;
    }

    // Agregar parámetros de filtro si existen
    if (filter) {
      const params = new URLSearchParams();
      if (filter.transactionType) params.append('transactionType', filter.transactionType);
      if (filter.status) params.append('status', filter.status);
      if (filter.startDate) params.append('startDate', filter.startDate);
      if (filter.endDate) params.append('endDate', filter.endDate);
      if (filter.limit) params.append('limit', filter.limit.toString());
      if (filter.offset) params.append('offset', filter.offset.toString());
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
    }

    return this.http.get<ApiResponse<Transaction[]>>(url)
      .pipe(
        map(response => response.data || []),
        catchError(this.handleError)
      );
  }

  getTransactionById(id: number): Observable<Transaction> {
    return this.http.get<ApiResponse<Transaction>>(`${environment.apiUrl}/transactions/${id}`)
      .pipe(
        map(response => response.data!),
        catchError(this.handleError)
      );
  }

  getTransactionByNumber(transactionNumber: string): Observable<Transaction> {
    return this.http.get<ApiResponse<Transaction>>(`${environment.apiUrl}/transactions/number/${transactionNumber}`)
      .pipe(
        map(response => response.data!),
        catchError(this.handleError)
      );
  }

  getTransactionsByAccount(accountId: number, filter?: TransactionFilter): Observable<Transaction[]> {
    let url = `${environment.apiUrl}/transactions/account/${accountId}`;
    
    if (filter) {
      const params = new URLSearchParams();
      if (filter.transactionType) params.append('transactionType', filter.transactionType);
      if (filter.status) params.append('status', filter.status);
      if (filter.startDate) params.append('startDate', filter.startDate);
      if (filter.endDate) params.append('endDate', filter.endDate);
      if (filter.limit) params.append('limit', filter.limit.toString());
      if (filter.offset) params.append('offset', filter.offset.toString());
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
    }

    return this.http.get<ApiResponse<Transaction[]>>(url)
      .pipe(
        map(response => response.data || []),
        catchError(this.handleError)
      );
  }

  getTransactionSummary(filter?: TransactionFilter): Observable<TransactionSummary> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('User not authenticated'));
    }

    // Como no hay endpoint de summary, vamos a obtener las transacciones y calcular el resumen
    return this.getTransactions(filter).pipe(
      map(transactions => {
        const totalAmount = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
        
        return {
          totalTransactions: transactions.length,
          totalAmount: totalAmount,
          transactions: transactions
        };
      }),
      catchError(this.handleError)
    );
  }

  createTransaction(transactionData: CreateTransactionRequest): Observable<Transaction> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('User not authenticated'));
    }

    const url = `${environment.apiUrl}/transactions?userId=${currentUser.id}`;
    
    return this.http.post<ApiResponse<Transaction>>(url, transactionData)
      .pipe(
        map(response => response.data!),
        catchError(this.handleError)
      );
  }

  processTransaction(transactionId: number): Observable<Transaction> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('User not authenticated'));
    }

    const url = `${environment.apiUrl}/transactions/${transactionId}/process?userId=${currentUser.id}`;
    
    return this.http.post<ApiResponse<Transaction>>(url, {})
      .pipe(
        map(response => response.data!),
        catchError(this.handleError)
      );
  }

  getPendingTransactions(): Observable<Transaction[]> {
    return this.http.get<ApiResponse<Transaction[]>>(`${environment.apiUrl}/transactions/pending`)
      .pipe(
        map(response => response.data || []),
        catchError(this.handleError)
      );
  }

  getPendingTransactionsCount(): Observable<number> {
    return this.getPendingTransactions().pipe(
      map(transactions => transactions.length),
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('Transaction service error:', error);
    return throwError(() => error);
  }
} 