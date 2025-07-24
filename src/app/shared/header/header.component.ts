import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  currentUser: User | null = null;
  showUserMenu = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  getUserInitials(): string {
    if (!this.currentUser) return '';
    return `${this.currentUser.firstName?.charAt(0) || ''}${this.currentUser.lastName?.charAt(0) || ''}`.toUpperCase();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
} 