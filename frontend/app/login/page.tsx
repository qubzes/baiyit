"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Github, Twitter, Mail } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [otp, setOtp] = useState("")
  const { requestOTP, login, register } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const { isAuthenticated } = useAuth()

  // Redirect to profile if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/profile")
    }
  }, [isAuthenticated, isLoading, router])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-sky"></div>
      </div>
    )
  }

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      let success = false

      if (isLogin) {
        // Just request OTP for login
        success = await requestOTP(email)
      } else {
        // Register and then request OTP
        success = await register(firstName, lastName, email)
      }

      if (success) {
        setIsOtpSent(true)
      }
    } catch (error) {
      console.error("OTP request error:", error)
      toast.error("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const success = await login(email, otp)

      if (success) {
        router.push("/")
      }
    } catch (error) {
      console.error("Login error:", error)
      toast.error("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-md w-full space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="mt-6 text-3xl font-bold text-primary-navy">
            {isOtpSent ? "Enter verification code" : isLogin ? "Sign in to your account" : "Create a new account"}
          </h2>
          {!isOtpSent && (
            <p className="mt-2 text-sm text-gray-600">
              {isLogin ? "Or " : "Already have an account? "}
              <button
                className="font-medium text-accent-sky hover:text-accent-sky/80"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? "create a new account" : "sign in"}
              </button>
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-card p-8 rounded-2xl"
        >
          {!isOtpSent ? (
            <form className="space-y-6" onSubmit={handleRequestOTP}>
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>

              <Button type="submit" className="w-full bg-accent-sky hover:bg-accent-sky/90" disabled={isLoading}>
                {isLoading ? "Processing..." : isLogin ? "Request verification code" : "Create account"}
              </Button>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={handleVerifyOTP}>
              <div className="space-y-2">
                <Label htmlFor="otp">Verification Code</Label>
                <Input
                  id="otp"
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter the code sent to your email"
                />
              </div>

              <Button type="submit" className="w-full bg-accent-sky hover:bg-accent-sky/90" disabled={isLoading}>
                {isLoading ? "Verifying..." : "Verify and Sign In"}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  className="text-sm text-accent-sky hover:text-accent-sky/80"
                  onClick={() => setIsOtpSent(false)}
                >
                  Back to {isLogin ? "sign in" : "registration"}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <Button variant="outline" className="w-full">
                <Github className="h-5 w-5" />
              </Button>
              <Button variant="outline" className="w-full">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="outline" className="w-full">
                <Mail className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
