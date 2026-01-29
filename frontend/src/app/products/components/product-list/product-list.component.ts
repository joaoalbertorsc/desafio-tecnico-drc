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
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
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

  sortColumn = 'name';
  sortDirection = 'asc';

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
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.loadProducts();
  }

  getSortIcon(column: string): string {
    if (this.sortColumn !== column) {
      return '↕';
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
