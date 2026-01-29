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
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
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
