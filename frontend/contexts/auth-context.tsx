"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { authService, type UserResponse } from "@/lib/api/auth-service"
import { toast } from "sonner"

interface AuthContextType {
  user: UserResponse | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, otp: string) => Promise<boolean>
  logout: () => Promise<void>
  requestOTP: (email: string) => Promise<boolean>
  register: (firstName: string, lastName: string, email: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true)

      if (authService.isAuthenticated()) {
        try {
          const storedUser = authService.getUser()
          if (storedUser) {
            setUser(storedUser)
            setIsAuthenticated(true)
          } else {
            // If we have a token but no user, fetch the user
            const { data, error } = await authService.getCurrentUser()
            if (!error && data) {
              setUser(data)
              setIsAuthenticated(true)
            } else {
              // If there's an error, clear tokens
              authService.clearTokens()
              setIsAuthenticated(false)
            }
          }
        } catch (error) {
          console.error("Auth check failed:", error)
          authService.clearTokens()
          setIsAuthenticated(false)
        }
      } else {
        setIsAuthenticated(false)
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (email: string, otp: string): Promise<boolean> => {
    try {
      const { data, error } = await authService.verifyOTP(email, otp)

      if (error || !data) {
        toast.error(error || "Invalid verification code")
        return false
      }

      authService.saveTokens(data)
      setUser(data.user)
      setIsAuthenticated(true)
      toast.success("Successfully logged in")
      return true
    } catch (error) {
      console.error("Login failed:", error)
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"
      toast.error(errorMessage)
      return false
    }
  }

  const logout = async (): Promise<void> => {
    try {
      if (isAuthenticated) {
        await authService.signOut()
      }
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      authService.clearTokens()
      setUser(null)
      setIsAuthenticated(false)
      toast.success("Successfully logged out")
    }
  }

  const requestOTP = async (email: string): Promise<boolean> => {
    try {
      const { error } = await authService.requestOTP(email)
      if (error) {
        toast.error(error)
        return false
      }
      toast.success("Verification code sent to your email")
      return true
    } catch (error) {
      console.error("Request OTP failed:", error)
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"
      toast.error(errorMessage)
      return false
    }
  }

  const register = async (firstName: string, lastName: string, email: string): Promise<boolean> => {
    try {
      const { error } = await authService.register({
        first_name: firstName,
        last_name: lastName,
        email,
      })

      if (error) {
        toast.error(error)
        return false
      }

      // If registration is successful, request OTP
      toast.success("Account created successfully")
      return await requestOTP(email)
    } catch (error) {
      console.error("Registration failed:", error)
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"
      toast.error(errorMessage)
      return false
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        requestOTP,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Update the saveTokens method to also set cookies
authService.saveTokens = (authResponse: any) => {
  // Set in localStorage
  localStorage.setItem("access_token", authResponse.access_token)
  localStorage.setItem("refresh_token", authResponse.refresh_token)
  localStorage.setItem("token_expires_at", authResponse.expires_at.toString())
  localStorage.setItem("refresh_token_expires_at", authResponse.refresh_token_expires_at.toString())
  localStorage.setItem("user", JSON.stringify(authResponse.user))

  // Set in cookies for middleware access
  document.cookie = `access_token=${authResponse.access_token}; path=/; max-age=${authResponse.expires_at - Math.floor(Date.now() / 1000)}`
}

// Update the clearTokens method to also clear cookies
authService.clearTokens = () => {
  localStorage.removeItem("access_token")
  localStorage.removeItem("refresh_token")
  localStorage.removeItem("token_expires_at")
  localStorage.removeItem("refresh_token_expires_at")
  localStorage.removeItem("user")

  // Clear cookies
  document.cookie = "access_token=; path=/; max-age=0"
}
