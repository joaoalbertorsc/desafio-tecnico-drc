import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container">
      <h2>Lista de Produtos</h2>

      <div class="actions">
        <button routerLink="/products/new" class="btn-primary">Novo Produto</button>
        <div class="filters">
          <input type="text" [(ngModel)]="filterName" placeholder="Buscar por nome" (input)="loadProducts()">
          <input type="text" [(ngModel)]="filterCategory" placeholder="Filtrar por categoria" (input)="loadProducts()">
        </div>
      </div>

      <div *ngIf="totalStockValue !== null" class="stock-info">
        <strong>Valor Total em Estoque: </strong> {{ totalStockValue | currency:'BRL' }}
      </div>

      <div *ngIf="isLoading" class="loading">Carregando produtos...</div>

      <div *ngIf="errorMessage" class="error-message">
        <h3>Erro:</h3>
        <p>{{ errorMessage }}</p>
      </div>

      <table *ngIf="!isLoading && !errorMessage">
        <thead>
        <tr>
          <th>Nome</th>
          <th>Categoria</th>
          <th>Preço</th>
          <th>Estoque</th>
          <th>Status</th>
          <th>Ações</th>
        </tr>
        </thead>
        <tbody>
        <tr *ngFor="let product of products">
          <td>{{ product.name }}</td>
          <td>{{ product.category }}</td>
          <td>
            {{ product.price | currency:'BRL' }}
            <span *ngIf="product.onSale" class="badge-sale">Promoção</span>
          </td>
          <td [class.low-stock]="product.lowStock">
            {{ product.stockQuantity }}
            <span *ngIf="product.lowStock" class="warning-icon" title="Estoque Baixo">⚠️</span>
          </td>
          <td>
              <span [class.active]="product.active" [class.inactive]="!product.active">
                {{ product.active ? 'Ativo' : 'Inativo' }}
              </span>
          </td>
          <td>
            <button [routerLink]="['/products', product.id, 'edit']" class="btn-edit">Editar</button>
            <button (click)="openDeleteModal(product.id!)" class="btn-delete">Excluir</button>
          </td>
        </tr>
        <tr *ngIf="products.length === 0">
          <td colspan="6" style="text-align: center;">Nenhum produto encontrado.</td>
        </tr>
        </tbody>
      </table>

      <div class="pagination" *ngIf="!isLoading && !errorMessage">
        <button (click)="changePage(-1)" [disabled]="currentPage === 0">Anterior</button>
        <span>Página {{ currentPage + 1 }} de {{ totalPages }}</span>
        <button (click)="changePage(1)" [disabled]="currentPage >= totalPages - 1">Próxima</button>
      </div>

      <!-- Custom Confirmation Modal -->
      <div class="modal-overlay" *ngIf="showDeleteModal">
        <div class="modal-content">
          <h3>Confirmar Exclusão</h3>
          <p>Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.</p>
          <div class="modal-actions">
            <button (click)="cancelDelete()" class="btn-secondary">Cancelar</button>
            <button (click)="confirmDelete()" class="btn-danger">Excluir</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
    .actions { display: flex; justify-content: space-between; margin-bottom: 20px; }
    .filters { display: flex; gap: 10px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
    .active { color: green; font-weight: bold; }
    .inactive { color: red; font-weight: bold; }
    .pagination { margin-top: 20px; display: flex; justify-content: center; gap: 10px; }
    .stock-info { margin-bottom: 10px; font-size: 1.1em; }
    .btn-primary { background-color: #007bff; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; text-decoration: none; }
    .btn-edit { margin-right: 5px; cursor: pointer; }
    .btn-delete { color: red; cursor: pointer; }
    .badge-sale { background-color: #ffc107; color: #000; padding: 2px 6px; border-radius: 4px; font-size: 0.8em; margin-left: 5px; }
    .low-stock { color: #d9534f; font-weight: bold; }
    .warning-icon { margin-left: 5px; cursor: help; }
    .loading { text-align: center; font-size: 1.2em; color: #666; margin: 20px 0; }
    .error-message { color: red; background: #fee; padding: 10px; border: 1px solid red; margin: 20px 0; }

    /* Modal Styles */
    .modal-overlay {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex; justify-content: center; align-items: center;
      z-index: 1000;
    }
    .modal-content {
      background-color: white; padding: 20px; border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      max-width: 400px; width: 100%; text-align: center;
    }
    .modal-actions { display: flex; justify-content: center; gap: 10px; margin-top: 20px; }
    .btn-secondary { background-color: #6c757d; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; }
    .btn-danger { background-color: #dc3545; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; }
  `]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  totalElements = 0;
  totalPages = 0;
  currentPage = 0;
  pageSize = 10;
  isLoading = false;
  errorMessage = '';

  filterName = '';
  filterCategory = '';
  totalStockValue: number | null = null;

  // Modal State
  showDeleteModal = false;
  productToDeleteId: number | null = null;

  constructor(
    private productService: ProductService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadTotalStockValue();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.productService.getProducts(this.currentPage, this.pageSize, this.filterName, this.filterCategory)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cd.detectChanges();
        })
      )
      .subscribe({
        next: (response) => {
          this.products = response.content || [];
          this.totalElements = response.totalElements;
          this.totalPages = response.totalPages;
        },
        error: (err) => {
          console.error('Erro ao carregar produtos', err);
          this.errorMessage = 'Falha ao conectar com o servidor.';
          if (err.status === 0) {
            this.errorMessage += ' (Erro de Conexão/CORS)';
          } else {
            this.errorMessage += ` (Status: ${err.status})`;
          }
        }
      });
  }

  loadTotalStockValue(): void {
    this.productService.getTotalStockValue().subscribe({
      next: (res) => {
        this.totalStockValue = res.totalValue;
        this.cd.detectChanges();
      },
      error: (err) => console.error('Erro ao carregar valor total do estoque', err)
    });
  }

  openDeleteModal(id: number): void {
    this.productToDeleteId = id;
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.productToDeleteId = null;
  }

  confirmDelete(): void {
    if (this.productToDeleteId !== null) {
      this.productService.deleteProduct(this.productToDeleteId).subscribe({
        next: () => {
          this.loadProducts();
          this.loadTotalStockValue();
          this.cancelDelete();
        },
        error: (err) => {
          alert('Erro ao excluir produto.');
          this.cancelDelete();
        }
      });
    }
  }

  changePage(delta: number): void {
    this.currentPage += delta;
    this.loadProducts();
  }
}
