import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './shared/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HeaderComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <app-header *ngIf="showHeader"></app-header>
      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: []
})
export class App {
  showHeader = true;

  constructor(private router: Router) {
    // Ocultar header solo en páginas de autenticación
    this.router.events.subscribe(() => {
      const currentPath = this.router.url;
      this.showHeader = !currentPath.includes('/auth/');
    });
  }
}
