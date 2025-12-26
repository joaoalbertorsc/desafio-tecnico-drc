import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <header>
      <h1>Gerenciamento de Loja de Variedades</h1>
    </header>
    <main>
      <router-outlet></router-outlet>
    </main>
    <footer>
      <p>&copy; 2024 DRC Challenge</p>
    </footer>
  `,
  styles: [`
    header { background-color: #333; color: white; padding: 1rem; text-align: center; }
    main { padding: 20px; min-height: 80vh; }
    footer { background-color: #f1f1f1; text-align: center; padding: 10px; margin-top: 20px; }
  `]
})
export class AppComponent {
  title = 'frontend';
}
