"use client"

import React from "react"

import { useState } from "react"
import { User, Mail, Lock, Eye, EyeOff, Phone, ArrowRight } from "lucide-react"

interface AccountStepProps {
  onContinueAsGuest: () => void
  onLogin: (email: string, password: string) => Promise<boolean>
  onRegister: (data: {
    email: string
    password: string
    firstName: string
    lastName: string
    phone?: string
  }) => Promise<boolean>
}

type AccountMode = "choice" | "login" | "register"

export default function AccountStep({
  onContinueAsGuest,
  onLogin,
  onRegister,
}: AccountStepProps) {
  const [mode, setMode] = useState<AccountMode>("choice")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  // Login form
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  // Register form
  const [regFirstName, setRegFirstName] = useState("")
  const [regLastName, setRegLastName] = useState("")
  const [regEmail, setRegEmail] = useState("")
  const [regPhone, setRegPhone] = useState("")
  const [regPassword, setRegPassword] = useState("")
  const [regConfirmPassword, setRegConfirmPassword] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    try {
      const success = await onLogin(loginEmail, loginPassword)
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

  const [confirmationEmail, setConfirmationEmail] = useState("")

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (regPassword !== regConfirmPassword) {
      setError("Passwords do not match.")
      return
    }
    if (regPassword.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }

    setIsLoading(true)
    try {
      const success = await onRegister({
        email: regEmail,
        password: regPassword,
        firstName: regFirstName,
        lastName: regLastName,
        phone: regPhone || undefined,
      })
      if (!success) {
        setError("Could not create account. Email might already be in use.")
      }
    } catch (err: any) {
      if (err?.message === "EMAIL_CONFIRMATION_REQUIRED") {
        setConfirmationEmail(regEmail)
      } else if (err?.message === "EMAIL_EXISTS") {
        setError("An account with this email already exists. Please sign in instead.")
      } else {
        setError("An error occurred. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Choice screen
  if (mode === "choice") {
    return (
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl lg:text-3xl font-light text-[#1E1E1E] mb-3">
            How would you like to proceed?
          </h2>
          <p className="text-[#1E1E1E]/60 text-sm">
            Create an account to track your orders and save your details for next time.
          </p>
        </div>

        <div className="space-y-4">
          {/* Login */}
          <button
            onClick={() => setMode("login")}
            className="w-full flex items-center gap-4 p-5 bg-white border border-[#1E1E1E]/10 hover:border-[#800913]/30 transition-all group text-left"
          >
            <div className="w-12 h-12 rounded-full bg-[#800913]/5 flex items-center justify-center shrink-0 group-hover:bg-[#800913]/10 transition-colors">
              <User size={20} className="text-[#800913]" />
            </div>
            <div className="flex-1">
              <h3 className="text-[#1E1E1E] font-medium mb-0.5">
                Sign in to my account
              </h3>
              <p className="text-[#1E1E1E]/50 text-sm">
                Access your saved details and order history
              </p>
            </div>
            <ArrowRight
              size={18}
              className="text-[#1E1E1E]/30 group-hover:text-[#800913] transition-colors"
            />
          </button>

          {/* Register */}
          <button
            onClick={() => setMode("register")}
            className="w-full flex items-center gap-4 p-5 bg-white border border-[#1E1E1E]/10 hover:border-[#800913]/30 transition-all group text-left"
          >
            <div className="w-12 h-12 rounded-full bg-[#800913]/5 flex items-center justify-center shrink-0 group-hover:bg-[#800913]/10 transition-colors">
              <Mail size={20} className="text-[#800913]" />
            </div>
            <div className="flex-1">
              <h3 className="text-[#1E1E1E] font-medium mb-0.5">
                Create an account
              </h3>
              <p className="text-[#1E1E1E]/50 text-sm">
                Save your cart and track your orders
              </p>
            </div>
            <ArrowRight
              size={18}
              className="text-[#1E1E1E]/30 group-hover:text-[#800913] transition-colors"
            />
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 py-2">
            <div className="flex-1 h-px bg-[#1E1E1E]/10" />
            <span className="text-[#1E1E1E]/40 text-xs tracking-[0.1em] uppercase">
              or
            </span>
            <div className="flex-1 h-px bg-[#1E1E1E]/10" />
          </div>

          {/* Guest */}
          <button
            onClick={onContinueAsGuest}
            className="w-full p-4 text-center text-[#1E1E1E]/60 hover:text-[#800913] text-sm tracking-[0.05em] transition-colors"
          >
            Continue as guest
          </button>
        </div>
      </div>
    )
  }

  // Login form
  if (mode === "login") {
    return (
      <div className="max-w-md mx-auto">
        <button
          onClick={() => {
            setMode("choice")
            setError("")
          }}
          className="text-[#1E1E1E]/50 hover:text-[#800913] text-sm mb-6 transition-colors"
        >
          {"<-"} Back
        </button>

        <h2 className="text-2xl font-light text-[#1E1E1E] mb-8">
          Sign in to your account
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-[#1E1E1E]/50 text-xs tracking-[0.1em] uppercase mb-2">
              Email
            </label>
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1E1E1E]/30"
              />
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-[#FBF5EF]/50 border border-[#1E1E1E]/10 text-[#1E1E1E] focus:border-[#800913]/50 focus:bg-white focus:outline-none transition-all"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#1E1E1E]/50 text-xs tracking-[0.1em] uppercase mb-2">
              Password
            </label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1E1E1E]/30"
              />
              <input
                type={showPassword ? "text" : "password"}
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                className="w-full pl-10 pr-10 py-3 bg-[#FBF5EF]/50 border border-[#1E1E1E]/10 text-[#1E1E1E] focus:border-[#800913]/50 focus:bg-white focus:outline-none transition-all"
                placeholder="Your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1E1E1E]/30 hover:text-[#1E1E1E]/60"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-[#800913] text-white text-sm tracking-[0.1em] uppercase hover:bg-[#600910] disabled:opacity-50 transition-colors"
          >
            {isLoading ? "Signing in..." : "Sign In & Continue"}
          </button>
        </form>

        <p className="text-center text-[#1E1E1E]/50 text-sm mt-6">
          {"Don't have an account? "}
          <button
            onClick={() => {
              setMode("register")
              setError("")
            }}
            className="text-[#800913] hover:underline"
          >
            Create one
          </button>
        </p>
      </div>
    )
  }

  // Email confirmation screen
  if (confirmationEmail) {
    return (
      <div className="max-w-md mx-auto text-center py-8">
        <div className="w-16 h-16 bg-[#800913]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail size={32} className="text-[#800913]" />
        </div>
        <h2 className="text-2xl font-light text-[#1E1E1E] mb-3">
          Check Your Email
        </h2>
        <p className="text-[#1E1E1E]/60 text-sm mb-2">
          {"We've sent a confirmation link to"}
        </p>
        <p className="font-medium text-[#1E1E1E] mb-6">
          {confirmationEmail}
        </p>
        <p className="text-[#1E1E1E]/50 text-xs mb-8">
          Click the link in the email to activate your account, then come back here to sign in.
        </p>
        <button
          onClick={() => {
            setConfirmationEmail("")
            setMode("login")
            setError("")
          }}
          className="w-full bg-[#800913] text-white py-4 text-sm tracking-[0.15em] uppercase hover:bg-[#600910] transition-colors"
        >
          Go to Sign In
        </button>
        <button
          onClick={() => onContinueAsGuest()}
          className="mt-4 text-sm text-[#1E1E1E]/50 hover:text-[#1E1E1E] transition-colors"
        >
          Or continue as guest for now
        </button>
      </div>
    )
  }

  // Register form
  return (
    <div className="max-w-md mx-auto">
      <button
        onClick={() => {
          setMode("choice")
          setError("")
        }}
        className="text-[#1E1E1E]/50 hover:text-[#800913] text-sm mb-6 transition-colors"
      >
        {"<-"} Back
      </button>

      <h2 className="text-2xl font-light text-[#1E1E1E] mb-8">
        Create your account
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[#1E1E1E]/50 text-xs tracking-[0.1em] uppercase mb-2">
              First Name *
            </label>
            <input
              type="text"
              value={regFirstName}
              onChange={(e) => setRegFirstName(e.target.value)}
              required
              className="w-full px-4 py-3 bg-[#FBF5EF]/50 border border-[#1E1E1E]/10 text-[#1E1E1E] focus:border-[#800913]/50 focus:bg-white focus:outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-[#1E1E1E]/50 text-xs tracking-[0.1em] uppercase mb-2">
              Last Name *
            </label>
            <input
              type="text"
              value={regLastName}
              onChange={(e) => setRegLastName(e.target.value)}
              required
              className="w-full px-4 py-3 bg-[#FBF5EF]/50 border border-[#1E1E1E]/10 text-[#1E1E1E] focus:border-[#800913]/50 focus:bg-white focus:outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-[#1E1E1E]/50 text-xs tracking-[0.1em] uppercase mb-2">
            Email *
          </label>
          <div className="relative">
            <Mail
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1E1E1E]/30"
            />
            <input
              type="email"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 bg-[#FBF5EF]/50 border border-[#1E1E1E]/10 text-[#1E1E1E] focus:border-[#800913]/50 focus:bg-white focus:outline-none transition-all"
              placeholder="your@email.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-[#1E1E1E]/50 text-xs tracking-[0.1em] uppercase mb-2">
            Phone
          </label>
          <div className="relative">
            <Phone
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1E1E1E]/30"
            />
            <input
              type="tel"
              value={regPhone}
              onChange={(e) => setRegPhone(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#FBF5EF]/50 border border-[#1E1E1E]/10 text-[#1E1E1E] focus:border-[#800913]/50 focus:bg-white focus:outline-none transition-all"
              placeholder="+971 XX XXX XXXX"
            />
          </div>
        </div>

        <div>
          <label className="block text-[#1E1E1E]/50 text-xs tracking-[0.1em] uppercase mb-2">
            Password *
          </label>
          <div className="relative">
            <Lock
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1E1E1E]/30"
            />
            <input
              type={showPassword ? "text" : "password"}
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              required
              minLength={6}
              className="w-full pl-10 pr-10 py-3 bg-[#FBF5EF]/50 border border-[#1E1E1E]/10 text-[#1E1E1E] focus:border-[#800913]/50 focus:bg-white focus:outline-none transition-all"
              placeholder="Min. 6 characters"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1E1E1E]/30 hover:text-[#1E1E1E]/60"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-[#1E1E1E]/50 text-xs tracking-[0.1em] uppercase mb-2">
            Confirm Password *
          </label>
          <div className="relative">
            <Lock
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1E1E1E]/30"
            />
            <input
              type={showPassword ? "text" : "password"}
              value={regConfirmPassword}
              onChange={(e) => setRegConfirmPassword(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 bg-[#FBF5EF]/50 border border-[#1E1E1E]/10 text-[#1E1E1E] focus:border-[#800913]/50 focus:bg-white focus:outline-none transition-all"
              placeholder="Confirm your password"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 bg-[#800913] text-white text-sm tracking-[0.1em] uppercase hover:bg-[#600910] disabled:opacity-50 transition-colors"
        >
          {isLoading ? "Creating account..." : "Create Account & Continue"}
        </button>
      </form>

      <p className="text-center text-[#1E1E1E]/50 text-sm mt-6">
        Already have an account?{" "}
        <button
          onClick={() => {
            setMode("login")
            setError("")
          }}
          className="text-[#800913] hover:underline"
        >
          Sign in
        </button>
      </p>
    </div>
  )
}
