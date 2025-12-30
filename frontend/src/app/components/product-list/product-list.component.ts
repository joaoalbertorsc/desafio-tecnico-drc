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
    <div class="main-card">
      <!-- Header Row: Title, Stock, Add Button -->
      <div class="card-header">
        <div class="title-section">
          <h2>Lista de Produtos</h2>
          <div *ngIf="totalStockValue !== null" class="stock-badge">
            <span class="stock-label">Total em Estoque:</span>
            <span class="stock-value">{{ totalStockValue | currency:'BRL' }}</span>
          </div>
        </div>
        <button routerLink="/products/new" class="btn-primary">
          <span class="plus-icon">+</span> Novo Produto
        </button>
      </div>

      <!-- Filter Row -->
      <div class="filter-row">
        <div class="search-input-group">
          <span class="search-icon">🔍</span>
          <input type="text" [(ngModel)]="filterName" placeholder="Buscar por nome..." (ngModelChange)="onFilterChange()">
        </div>
        <div class="search-input-group">
          <span class="search-icon">📂</span>
          <input type="text" [(ngModel)]="filterCategory" placeholder="Filtrar por categoria..." (ngModelChange)="onFilterChange()">
        </div>
      </div>

      <div *ngIf="isLoading" class="loading">
        <div class="spinner"></div> Carregando produtos...
      </div>

      <div *ngIf="errorMessage" class="error-message">
        <h3>Erro:</h3>
        <p>{{ errorMessage }}</p>
      </div>

      <div class="table-responsive" *ngIf="!isLoading && !errorMessage">
        <table>
          <thead>
          <tr>
            <th (click)="onSort('name')" class="sortable">
              Nome <span class="sort-icon">{{ getSortIcon('name') }}</span>
            </th>
            <th (click)="onSort('category')" class="sortable">
              Categoria <span class="sort-icon">{{ getSortIcon('category') }}</span>
            </th>
            <th (click)="onSort('price')" class="sortable">
              Preço <span class="sort-icon">{{ getSortIcon('price') }}</span>
            </th>
            <th (click)="onSort('stockQuantity')" class="sortable">
              Estoque <span class="sort-icon">{{ getSortIcon('stockQuantity') }}</span>
            </th>
            <th (click)="onSort('active')" class="sortable">
              Status <span class="sort-icon">{{ getSortIcon('active') }}</span>
            </th>
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
              <button [routerLink]="['/products', product.id, 'edit']" class="btn-icon edit" title="Editar">✏️</button>
              <button (click)="openDeleteModal(product.id!)" class="btn-icon delete" title="Excluir">🗑️</button>
            </td>
          </tr>
          <tr *ngIf="products.length === 0">
            <td colspan="6" style="text-align: center; padding: 30px; color: #888;">
              Nenhum produto encontrado.
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination" *ngIf="!isLoading && !errorMessage">
        <button (click)="changePage(-1)" [disabled]="currentPage === 0" class="btn-page">Anterior</button>
        <span class="page-info">Página {{ currentPage + 1 }} de {{ totalPages }}</span>
        <button (click)="changePage(1)" [disabled]="currentPage >= totalPages - 1" class="btn-page">Próxima</button>
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
    /* Card Container */
    .main-card {
      background: white;
      border-radius: 10px;
      box-shadow: 0 2px 15px rgba(0,0,0,0.04);
      padding: 25px;
      margin-top: 10px;
    }

    /* Header Section */
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      flex-wrap: wrap;
      gap: 15px;
    }
    .title-section {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    h2 { margin: 0; color: #2c3e50; font-size: 1.5rem; }

    /* Stock Badge */
    .stock-badge {
      background-color: #e3f2fd;
      color: #1565c0;
      padding: 5px 10px;
      border-radius: 15px;
      font-size: 0.85rem;
      display: flex;
      gap: 5px;
      align-items: center;
    }
    .stock-label { font-weight: 500; }
    .stock-value { font-weight: 700; }

    /* Add Button */
    .btn-primary {
      background: linear-gradient(135deg, #28a745 0%, #218838 100%);
      color: white;
      padding: 8px 20px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 3px 10px rgba(40, 167, 69, 0.2);
    }
    .plus-icon { font-size: 1.1em; line-height: 1; }

    /* Filter Row */
    .filter-row {
      display: flex;
      gap: 15px;
      margin-bottom: 20px;
    }
    .search-input-group {
      position: relative;
      flex: 1;
    }
    .search-icon {
      position: absolute;
      left: 10px;
      top: 50%;
      transform: translateY(-50%);
      color: #aaa;
      font-size: 0.85em;
    }
    .search-input-group input {
      width: 100%;
      padding: 10px 10px 10px 35px; /* Space for icon */
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      font-size: 0.9rem;
      transition: border-color 0.2s;
      box-sizing: border-box;
    }
    .search-input-group input:focus {
      border-color: #2a5298;
      outline: none;
    }

    /* Table */
    .table-responsive { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
    th {
      text-align: left;
      padding: 12px 15px;
      color: #6c757d;
      font-weight: 600;
      border-bottom: 2px solid #f1f1f1;
      background-color: #fff;
      user-select: none; /* Prevent text selection on double click */
    }
    th.sortable {
      cursor: pointer;
      transition: background-color 0.2s;
    }
    th.sortable:hover {
      background-color: #f8f9fa;
      color: #2a5298;
    }
    .sort-icon {
      font-size: 0.8em;
      margin-left: 5px;
      color: #aaa;
    }
    td {
      padding: 12px 15px;
      border-bottom: 1px solid #f1f1f1;
      color: #333;
      vertical-align: middle;
    }
    tr:last-child td { border-bottom: none; }
    tr:hover { background-color: #f8f9fa; }

    /* Status & Badges */
    .active { color: #28a745; font-weight: 600; background: #e8f5e9; padding: 3px 8px; border-radius: 4px; font-size: 0.8em; }
    .inactive { color: #dc3545; font-weight: 600; background: #fbe9eb; padding: 3px 8px; border-radius: 4px; font-size: 0.8em; }
    .badge-sale { background-color: #fff3cd; color: #856404; padding: 3px 6px; border-radius: 4px; font-size: 0.7em; font-weight: 700; margin-left: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
    .low-stock { color: #d9534f; font-weight: 700; }

    /* Action Buttons */
    .btn-icon {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1em;
      padding: 5px;
      border-radius: 4px;
      transition: background 0.2s;
    }
    .btn-icon.edit:hover { background-color: #e3f2fd; }
    .btn-icon.delete:hover { background-color: #fbe9eb; }

    /* Pagination */
    .pagination {
      margin-top: 25px;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 12px;
    }
    .btn-page {
      background-color: white;
      border: 1px solid #dee2e6;
      color: #2a5298;
      padding: 6px 14px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 0.9rem;
    }
    .btn-page:hover:not(:disabled) {
      background-color: #e3f2fd;
      border-color: #2a5298;
    }
    .btn-page:disabled {
      color: #ccc;
      cursor: not-allowed;
      background-color: #f8f9fa;
    }
    .page-info { color: #6c757d; font-weight: 500; font-size: 0.9rem; }

    /* Loading & Error */
    .loading { text-align: center; padding: 40px; color: #666; font-size: 1em; }
    .error-message { color: #721c24; background-color: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 8px; margin-bottom: 20px; }

    /* Modal */
    .modal-overlay {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex; justify-content: center; align-items: center;
      z-index: 1000;
      backdrop-filter: blur(2px);
    }
    .modal-content {
      background-color: white; padding: 25px; border-radius: 10px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      max-width: 380px; width: 90%; text-align: center;
    }
    .modal-actions { display: flex; justify-content: center; gap: 15px; margin-top: 25px; }
    .btn-secondary { background-color: #6c757d; color: white; padding: 8px 18px; border: none; border-radius: 6px; cursor: pointer; font-size: 0.9rem; }
    .btn-danger { background-color: #dc3545; color: white; padding: 8px 18px; border: none; border-radius: 6px; cursor: pointer; font-size: 0.9rem; }
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

  // Sorting State
  sortColumn = 'name';
  sortDirection = 'asc';

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

  onFilterChange(): void {
    this.currentPage = 0;
    this.loadProducts();
  }

  onSort(column: string): void {
    if (this.sortColumn === column) {
      // Toggle direction
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // New column, default to asc
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.loadProducts();
  }

  getSortIcon(column: string): string {
    if (this.sortColumn !== column) {
      return '↕'; // Neutral sort icon
    }
    return this.sortDirection === 'asc' ? '↑' : '↓';
  }

  loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const sortParam = `${this.sortColumn},${this.sortDirection}`;

    this.productService.getProducts(this.currentPage, this.pageSize, this.filterName, this.filterCategory, sortParam)
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
