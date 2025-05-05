import { apiClient } from "./api-client";

export interface ProductCreate {
  title: string;
  description: string;
  price: number;
  discount_price?: number | null;
  image: string;
  rating: number;
  category?: string | null;
  featured?: boolean | null;
  specs?: string[] | null;
}

export interface ProductUpdate {
  title?: string | null;
  description?: string | null;
  price?: number | null;
  discount_price?: number | null;
  image?: string | null;
  rating?: number | null;
  category?: string | null;
  featured?: boolean | null;
  specs?: string[] | null;
}

export interface ProductResponse {
  id: string;
  title: string;
  description: string;
  price: number;
  discount_price: number | null;
  image: string;
  rating: number;
  category: string | null;
  featured: boolean | null;
  specs: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface PaginatedProductResponse {
  data: ProductResponse[];
  total: number;
  page: number;
  pages: number;
}

export interface ProductQueryParams {
  page?: number;
  size?: number;
  sort_by?: string;
  descending?: boolean;
  use_or?: boolean;
  search?: string;
  category?: string;
  featured?: boolean;
  min_price?: number;
  max_price?: number;
  min_rating?: number;
}

class ProductService {
  async listProducts(params: ProductQueryParams = {}) {
    // Convert params to query string
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const queryString = queryParams.toString();
    const endpoint = `/products/${queryString ? `?${queryString}` : ""}`;

    return apiClient.get<PaginatedProductResponse>(endpoint);
  }

  async getProduct(productId: string) {
    return apiClient.get<ProductResponse>(`/products/${productId}`);
  }

  async createProduct(product: ProductCreate) {
    return apiClient.post<ProductResponse>("/products/", product, true);
  }

  async updateProduct(productId: string, product: ProductUpdate) {
    return apiClient.put<ProductResponse>(
      `/products/${productId}`,
      product,
      true,
    );
  }

  async deleteProduct(productId: string) {
    return apiClient.delete<{ message: string }>(
      `/products/${productId}`,
      true,
    );
  }
}

export const productService = new ProductService();
