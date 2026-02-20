"use client"

import React from "react"

import { useState } from "react"
import { X, Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight } from "lucide-react"
import { useAuth } from "./auth-context"

export function AuthModal() {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalView,
    setAuthModalView,
    login,
    register,
    resetPassword,
  } = useAuth()

  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  // Login form state
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  // Register form state
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [registerFirstName, setRegisterFirstName] = useState("")
  const [registerLastName, setRegisterLastName] = useState("")
  const [registerPhone, setRegisterPhone] = useState("")

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState("")
  const [forgotSent, setForgotSent] = useState(false)

  const [confirmationEmail, setConfirmationEmail] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const success = await login(loginEmail, loginPassword)
      if (!success) {
        setError("Invalid email or password. Please check your credentials.")
      }
    } catch (err: any) {
      if (err?.message === "EMAIL_NOT_CONFIRMED") {
        setError("Please check your inbox and confirm your email before signing in.")
      } else {
        setError("An error occurred. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const success = await register({
        email: registerEmail,
        password: registerPassword,
        firstName: registerFirstName,
        lastName: registerLastName,
        phone: registerPhone,
      })
      if (!success) {
        setError("Registration failed. Please try again.")
      }
    } catch (err: any) {
      if (err?.message === "EMAIL_CONFIRMATION_REQUIRED") {
        setConfirmationEmail(registerEmail)
      } else if (err?.message === "EMAIL_EXISTS") {
        setError("An account with this email already exists. Please sign in instead.")
      } else {
        setError("An error occurred. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    try {
      const success = await resetPassword(forgotEmail)
      if (success) {
        setForgotSent(true)
      } else {
        setError("Could not send reset link. Please try again.")
      }
    } catch {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthModalOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => setIsAuthModalOpen(false)}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-[#FBF5EF] overflow-hidden animate-fade-in-up">
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 p-2 text-[#1E1E1E]/60 hover:text-[#1E1E1E] transition-colors z-10"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="bg-[#1E1E1E] px-8 py-10 text-center">
          <h2 className="text-2xl md:text-3xl text-white font-light tracking-wide">
            {authModalView === "login" && "Welcome Back"}
            {authModalView === "register" && "Join Fougue."}
            {authModalView === "forgot" && "Reset Password"}
          </h2>
          <p className="text-white/60 mt-2 text-sm">
            {authModalView === "login" && "Sign in to access your account"}
            {authModalView === "register" && "Create an account for exclusive benefits"}
            {authModalView === "forgot" && "We'll send you a reset link"}
          </p>
        </div>

        {/* Content */}
        <div className="p-8">
          {error && (
            <div className="mb-6 p-3 bg-[#800913]/10 border border-[#800913]/20 text-[#800913] text-sm text-center">
              {error}
            </div>
          )}

          {/* Login Form */}
          {authModalView === "login" && (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs tracking-[0.15em] uppercase text-[#1E1E1E]/60 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1E1E1E]/40"
                  />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3 bg-white border border-[#1E1E1E]/10 focus:border-[#800913] outline-none transition-colors text-[#1E1E1E]"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs tracking-[0.15em] uppercase text-[#1E1E1E]/60 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1E1E1E]/40"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    className="w-full pl-12 pr-12 py-3 bg-white border border-[#1E1E1E]/10 focus:border-[#800913] outline-none transition-colors text-[#1E1E1E]"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1E1E1E]/40 hover:text-[#1E1E1E]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setAuthModalView("forgot")}
                  className="text-sm text-[#800913] hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#800913] text-white py-4 text-sm tracking-[0.2em] uppercase hover:bg-[#600910] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <p className="text-center text-sm text-[#1E1E1E]/60 mt-6">
                {"Don't have an account? "}
                <button
                  type="button"
                  onClick={() => setAuthModalView("register")}
                  className="text-[#800913] hover:underline font-medium"
                >
                  Create one
                </button>
              </p>
            </form>
          )}

          {/* Register Form */}
          {authModalView === "register" && confirmationEmail ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-[#800913]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail size={32} className="text-[#800913]" />
              </div>
              <h3 className="text-xl font-medium text-[#1E1E1E] mb-2">
                Check Your Email
              </h3>
              <p className="text-[#1E1E1E]/60 text-sm mb-2">
                {"We've sent a confirmation link to"}
              </p>
              <p className="font-medium text-[#1E1E1E] mb-6">
                {confirmationEmail}
              </p>
              <p className="text-[#1E1E1E]/50 text-xs mb-6">
                Click the link in the email to activate your account, then come back here to sign in.
              </p>
              <button
                onClick={() => {
                  setConfirmationEmail("")
                  setAuthModalView("login")
                }}
                className="w-full bg-[#800913] text-white py-4 text-sm tracking-[0.2em] uppercase hover:bg-[#600910] transition-colors flex items-center justify-center gap-2"
              >
                Go to Sign In
                <ArrowRight size={16} />
              </button>
            </div>
          ) : authModalView === "register" ? (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs tracking-[0.15em] uppercase text-[#1E1E1E]/60 mb-2">
                    First Name
                  </label>
                  <div className="relative">
                    <User
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1E1E1E]/40"
                    />
                    <input
                      type="text"
                      value={registerFirstName}
                      onChange={(e) => setRegisterFirstName(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3 bg-white border border-[#1E1E1E]/10 focus:border-[#800913] outline-none transition-colors text-[#1E1E1E]"
                      placeholder="First"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs tracking-[0.15em] uppercase text-[#1E1E1E]/60 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={registerLastName}
                    onChange={(e) => setRegisterLastName(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white border border-[#1E1E1E]/10 focus:border-[#800913] outline-none transition-colors text-[#1E1E1E]"
                    placeholder="Last"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs tracking-[0.15em] uppercase text-[#1E1E1E]/60 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1E1E1E]/40"
                  />
                  <input
                    type="email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3 bg-white border border-[#1E1E1E]/10 focus:border-[#800913] outline-none transition-colors text-[#1E1E1E]"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs tracking-[0.15em] uppercase text-[#1E1E1E]/60 mb-2">
                  Phone (Optional)
                </label>
                <div className="relative">
                  <Phone
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1E1E1E]/40"
                  />
                  <input
                    type="tel"
                    value={registerPhone}
                    onChange={(e) => setRegisterPhone(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-[#1E1E1E]/10 focus:border-[#800913] outline-none transition-colors text-[#1E1E1E]"
                    placeholder="+971 XX XXX XXXX"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs tracking-[0.15em] uppercase text-[#1E1E1E]/60 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1E1E1E]/40"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full pl-12 pr-12 py-3 bg-white border border-[#1E1E1E]/10 focus:border-[#800913] outline-none transition-colors text-[#1E1E1E]"
                    placeholder="Minimum 8 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1E1E1E]/40 hover:text-[#1E1E1E]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#800913] text-white py-4 text-sm tracking-[0.2em] uppercase hover:bg-[#600910] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-6"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <p className="text-center text-sm text-[#1E1E1E]/60 mt-4">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setAuthModalView("login")}
                  className="text-[#800913] hover:underline font-medium"
                >
                  Sign in
                </button>
              </p>
            </form>
          ) : null}

          {/* Forgot Password Form */}
          {authModalView === "forgot" && (
            <div>
              {!forgotSent ? (
                <form onSubmit={handleForgotPassword} className="space-y-5">
                  <div>
                    <label className="block text-xs tracking-[0.15em] uppercase text-[#1E1E1E]/60 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1E1E1E]/40"
                      />
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        required
                        className="w-full pl-12 pr-4 py-3 bg-white border border-[#1E1E1E]/10 focus:border-[#800913] outline-none transition-colors text-[#1E1E1E]"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#800913] text-white py-4 text-sm tracking-[0.2em] uppercase hover:bg-[#600910] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Send Reset Link
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>

                  <p className="text-center text-sm text-[#1E1E1E]/60 mt-6">
                    <button
                      type="button"
                      onClick={() => setAuthModalView("login")}
                      className="text-[#800913] hover:underline"
                    >
                      Back to Sign In
                    </button>
                  </p>
                </form>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-[#800913]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Mail size={32} className="text-[#800913]" />
                  </div>
                  <h3 className="text-xl font-medium text-[#1E1E1E] mb-2">
                    Check Your Email
                  </h3>
                  <p className="text-[#1E1E1E]/60 text-sm mb-6">
                    {"We've sent a password reset link to"}
                    <br />
                    <span className="font-medium text-[#1E1E1E]">
                      {forgotEmail}
                    </span>
                  </p>
                  <button
                    onClick={() => {
                      setAuthModalView("login")
                      setForgotSent(false)
                    }}
                    className="text-[#800913] hover:underline text-sm"
                  >
                    Back to Sign In
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
