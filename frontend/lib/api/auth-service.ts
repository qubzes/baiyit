import { apiClient } from "./api-client";

export interface UserCreate {
  email: string;
  first_name: string;
  last_name: string;
}

export interface RequestOTP {
  email: string;
}

export interface VerifyOTP {
  email: string;
  otp: string;
}

export interface RefreshToken {
  refresh_token: string;
}

export interface UserResponse {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  avatar: string | null;
  role: "customer" | "admin";
  is_suspended: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  token_type: string;
  access_token: string;
  expires_at: number;
  refresh_token: string;
  refresh_token_expires_at: number;
  user: UserResponse;
}

class AuthService {
  async register(userData: UserCreate) {
    return apiClient.post<UserResponse>("/auth/register", userData);
  }

  async requestOTP(email: string) {
    return apiClient.post<{ message: string }>("/auth/request-otp", { email });
  }

  async verifyOTP(email: string, otp: string) {
    return apiClient.post<AuthResponse>("/auth/verify-otp", { email, otp });
  }

  async getCurrentUser() {
    return apiClient.get<UserResponse>("/auth/me", true);
  }

  async refreshToken(refreshToken: string) {
    return apiClient.post<AuthResponse>("/auth/refresh", {
      refresh_token: refreshToken,
    });
  }

  async signOut() {
    return apiClient.post<{ message: string }>("/auth/sign-out", {}, true);
  }

  // Helper methods for token management
  saveTokens(authResponse: AuthResponse) {
    localStorage.setItem("access_token", authResponse.access_token);
    localStorage.setItem("refresh_token", authResponse.refresh_token);
    localStorage.setItem(
      "token_expires_at",
      authResponse.expires_at.toString(),
    );
    localStorage.setItem(
      "refresh_token_expires_at",
      authResponse.refresh_token_expires_at.toString(),
    );
    localStorage.setItem("user", JSON.stringify(authResponse.user));
  }

  clearTokens() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("token_expires_at");
    localStorage.removeItem("refresh_token_expires_at");
    localStorage.removeItem("user");
  }

  isAuthenticated() {
    const token = localStorage.getItem("access_token");
    const expiresAt = localStorage.getItem("token_expires_at");

    if (!token || !expiresAt) {
      return false;
    }

    // Check if token is expired
    const now = Math.floor(Date.now() / 1000);
    return now < Number.parseInt(expiresAt);
  }

  getUser(): UserResponse | null {
    const userJson = localStorage.getItem("user");
    return userJson ? JSON.parse(userJson) : null;
  }
}

export const authService = new AuthService();
