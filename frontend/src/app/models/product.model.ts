export interface Product {
  id?: number;
  name: string;
  category: string;
  description?: string;
  price: number;
  stockQuantity: number;
  barcode?: string;
  active: boolean;
  onSale?: boolean;
  lowStock?: boolean;
}

export interface ProductResponse {
  content: Product[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
