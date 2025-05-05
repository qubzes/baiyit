// Base API client for making requests to the backend

const API_BASE_URL = "http://localhost:8000";

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: any;
  requiresAuth?: boolean;
}

interface ApiResponse<T> {
  data: T;
  error?: string;
  status: number;
}

class ApiClient {
  private async getAuthHeaders(): Promise<Record<string, string>> {
    // Get token from localStorage or session storage
    const token = localStorage.getItem("access_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async request<T>(
    endpoint: string,
    options: RequestOptions = {},
  ): Promise<ApiResponse<T>> {
    const {
      method = "GET",
      headers = {},
      body,
      requiresAuth = false,
    } = options;

    let requestHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...headers,
    };

    if (requiresAuth) {
      const authHeaders = await this.getAuthHeaders();
      requestHeaders = { ...requestHeaders, ...authHeaders };
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : undefined,
      });

      const isJson = response.headers
        .get("content-type")
        ?.includes("application/json");
      const data = isJson ? await response.json() : await response.text();

      if (!response.ok) {
        return {
          data: null as unknown as T,
          error: isJson
            ? data.detail || data.message || "An error occurred"
            : "An error occurred",
          status: response.status,
        };
      }

      return {
        data,
        status: response.status,
      };
    } catch (error) {
      console.error("API request failed:", error);
      return {
        data: null as unknown as T,
        error: error instanceof Error ? error.message : "Network error",
        status: 0,
      };
    }
  }

  async get<T>(
    endpoint: string,
    requiresAuth = false,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { requiresAuth });
  }

  async post<T>(
    endpoint: string,
    data: any,
    requiresAuth = false,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data,
      requiresAuth,
    });
  }

  async put<T>(
    endpoint: string,
    data: any,
    requiresAuth = false,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data,
      requiresAuth,
    });
  }

  async delete<T>(
    endpoint: string,
    requiresAuth = false,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "DELETE",
      requiresAuth,
    });
  }

  async patch<T>(
    endpoint: string,
    data: any,
    requiresAuth = false,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data,
      requiresAuth,
    });
  }
}

export const apiClient = new ApiClient();
