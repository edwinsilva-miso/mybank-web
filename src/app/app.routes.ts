import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { PublicGuard } from './guards/public.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    canActivate: [PublicGuard],
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
      }
    ]
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'accounts',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/accounts/accounts.component').then(m => m.AccountsComponent)
  },
  {
    path: 'transactions',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/transactions/transactions.component').then(m => m.TransactionsComponent)
      },
      {
        path: 'new',
        loadComponent: () => import('./features/transactions/new-transaction.component').then(m => m.NewTransactionComponent)
      },
      {
        path: 'pending',
        loadComponent: () => import('./features/transactions/transactions.component').then(m => m.TransactionsComponent)
      }
    ]
  },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent)
  },

  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
