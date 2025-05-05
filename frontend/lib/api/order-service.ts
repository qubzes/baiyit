import { apiClient } from "./api-client";

export type OrderStatus = "Processing" | "Shipped" | "Delivered" | "Cancelled";

export interface OrderItemCreate {
  product_id: string;
  quantity: number;
}

export interface OrderCreate {
  items: OrderItemCreate[];
}

export interface OrderItemResponse {
  product_id: string;
  quantity: number;
  title: string;
  price: number;
  image: string;
}

export interface OrderResponse {
  id: string;
  user_id: string;
  total: number;
  status: OrderStatus;
  items: OrderItemResponse[] | null;
  created_at: string;
  updated_at: string;
}

export interface PaginatedOrderResponse {
  data: OrderResponse[];
  total: number;
  page: number;
  pages: number;
}

export interface OrderQueryParams {
  page?: number;
  size?: number;
  sort_by?: string;
  descending?: boolean;
  use_or?: boolean;
  search?: string;
  status?: OrderStatus;
}

class OrderService {
  async listOrders(params: OrderQueryParams = {}) {
    // Convert params to query string
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const queryString = queryParams.toString();
    const endpoint = `/orders/${queryString ? `?${queryString}` : ""}`;

    return apiClient.get<PaginatedOrderResponse>(endpoint, true);
  }

  async getOrder(orderId: string) {
    return apiClient.get<OrderResponse>(`/orders/${orderId}`, true);
  }

  async createOrder(order: OrderCreate) {
    return apiClient.post<OrderResponse>("/orders/", order, true);
  }

  async cancelOrder(orderId: string) {
    return apiClient.patch<string>(`/orders/${orderId}/cancel`, {}, true);
  }
}

export const orderService = new OrderService();
