
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <header class="app-header">
      <div class="header-content">
        <div class="logo">
          <h1>📦 DRC Store Management System</h1>
        </div>
        <nav>
          <span class="user-greeting">Bem-vindo, Admin</span>
        </nav>
      </div>
    </header>
    <main>
      <router-outlet></router-outlet>
    </main>
    <footer>
      <p>&copy; 2026 DRC Challenge - Gerenciamento de Estoque</p>
    </footer>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f4f6f9;
    }
    .app-header {
      background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
      color: white;
      padding: 0.8rem 2rem;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .header-content {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo h1 {
      margin: 0;
      font-size: 1.4rem;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    .user-greeting {
      font-size: 0.9rem;
      opacity: 0.9;
    }
    main {
      flex: 1;
      padding: 20px;
      max-width: 1400px;
      margin: 0 auto;
      width: 100%;
      box-sizing: border-box;
    }
    footer {
      background-color: #f8f9fa;
      color: #6c757d;
      text-align: center;
      padding: 15px;
      border-top: 1px solid #e9ecef;
      font-size: 0.85rem;
    }
  `]
})
export class AppComponent {
  title = 'frontend';
}
