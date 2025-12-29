import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="container">
      <h2>{{ isEditMode ? 'Editar Produto' : 'Novo Produto' }}</h2>

      <form [formGroup]="productForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="name">Nome *</label>
          <input id="name" type="text" formControlName="name" class="form-control" placeholder="Ex: Caneca Plástica, Lápis Colorido...">
          <div *ngIf="productForm.get('name')?.invalid && productForm.get('name')?.touched" class="error">
            <div *ngIf="productForm.get('name')?.hasError('required')">Nome é obrigatório.</div>
            <div *ngIf="productForm.get('name')?.hasError('pattern')">O nome deve conter pelo menos uma letra.</div>
          </div>
        </div>

        <div class="form-group">
          <label for="category">Categoria *</label>
          <input id="category" type="text" formControlName="category" class="form-control" placeholder="Ex: Papelaria, Cozinha...">
          <div *ngIf="productForm.get('category')?.invalid && productForm.get('category')?.touched" class="error">
            <div *ngIf="productForm.get('category')?.hasError('required')">Categoria é obrigatória.</div>
            <div *ngIf="productForm.get('category')?.hasError('pattern')">A categoria deve conter pelo menos uma letra.</div>
          </div>
        </div>

        <div class="form-group">
          <label for="description">Descrição</label>
          <textarea id="description" formControlName="description" class="form-control" maxlength="255" placeholder="Ex: Descrição simples do produto..."></textarea>
          <div class="char-counter">
            {{ productForm.get('description')?.value?.length || 0 }} / 255
          </div>
          <div *ngIf="productForm.get('description')?.invalid && productForm.get('description')?.touched" class="error">
            <div *ngIf="productForm.get('description')?.hasError('maxlength')">A descrição não pode exceder 255 caracteres.</div>
            <div *ngIf="productForm.get('description')?.hasError('pattern')">A descrição deve conter pelo menos uma letra.</div>
          </div>
        </div>

        <div class="form-group">
          <label for="price">Preço *</label>
          <input id="price" type="number" formControlName="price" class="form-control" placeholder="Ex: 500,00">
          <div *ngIf="productForm.get('price')?.invalid && productForm.get('price')?.touched" class="error">
            Preço deve ser maior que zero.
          </div>
        </div>

        <div class="form-group">
          <label for="stockQuantity">Quantidade em Estoque *</label>
          <input id="stockQuantity" type="number" formControlName="stockQuantity" class="form-control" placeholder="Ex: 20">
          <div *ngIf="productForm.get('stockQuantity')?.invalid && productForm.get('stockQuantity')?.touched" class="error">
            Quantidade deve ser maior ou igual a zero.
          </div>
        </div>

        <div class="form-group">
          <label for="barcode">Código de Barras</label>
          <input id="barcode" type="text" formControlName="barcode" class="form-control" placeholder="Ex: 1234567890">
          <div *ngIf="productForm.get('barcode')?.invalid && productForm.get('barcode')?.touched" class="error">
            <div *ngIf="productForm.get('barcode')?.hasError('pattern')">O código de barras deve conter apenas números.</div>
          </div>
        </div>

        <div class="form-group checkbox-group">
          <label for="active">
            <input id="active" type="checkbox" formControlName="active">
            Ativo
          </label>
        </div>

        <div class="form-group checkbox-group">
          <label for="onSale">
            <input id="onSale" type="checkbox" formControlName="onSale">
            Em Promoção
          </label>
        </div>

        <div class="actions">
          <button type="submit" [disabled]="productForm.invalid" class="btn-primary">Salvar</button>
          <button type="button" routerLink="/products" class="btn-secondary">Cancelar</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .container { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
    .form-group { margin-bottom: 15px; }
    label { display: block; margin-bottom: 5px; font-weight: bold; }
    .form-control { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
    .error { color: red; font-size: 0.875em; margin-top: 5px; }
    .actions { display: flex; gap: 10px; margin-top: 20px; }
    .btn-primary { background-color: #28a745; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
    .btn-primary:disabled { background-color: #94d3a2; cursor: not-allowed; }
    .btn-secondary { background-color: #6c757d; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
    .checkbox-group { display: flex; align-items: center; }
    .checkbox-group input { width: auto; margin-right: 10px; }
    .char-counter { font-size: 0.8em; color: #666; text-align: right; margin-top: 2px; }

    /* Hide number input arrows (spinners) */
    /* Chrome, Safari, Edge, Opera */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    /* Firefox */
    input[type=number] {
      -moz-appearance: textfield;
    }
  `]
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEditMode = false;
  productId?: number;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/[a-zA-Z\u00C0-\u00FF]/)]],
      category: ['', [Validators.required, Validators.pattern(/[a-zA-Z\u00C0-\u00FF]/)]],
      description: ['', [Validators.maxLength(255), Validators.pattern(/^$|.*[a-zA-Z\u00C0-\u00FF].*/)]],
      price: [null, [Validators.required, Validators.min(0.01)]],
      stockQuantity: [null, [Validators.required, Validators.min(0)]],
      barcode: ['', Validators.pattern(/^\d*$/)],
      active: [true],
      onSale: [false]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.productId = +id;
      this.loadProduct(this.productId);
    }
  }

  loadProduct(id: number): void {
    this.productService.getProductById(id).subscribe({
      next: (product) => this.productForm.patchValue(product),
      error: (err) => console.error('Erro ao carregar produto', err)
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) return;

    const product: Product = this.productForm.value;

    if (this.isEditMode && this.productId) {
      this.productService.updateProduct(this.productId, product).subscribe({
        next: () => this.router.navigate(['/products']),
        error: (err) => console.error('Erro ao atualizar produto', err)
      });
    } else {
      this.productService.createProduct(product).subscribe({
        next: () => this.router.navigate(['/products']),
        error: (err) => console.error('Erro ao criar produto', err)
      });
    }
  }
}
