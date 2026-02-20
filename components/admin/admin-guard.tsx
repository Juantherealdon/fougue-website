"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Lock, Shield } from "lucide-react"

const ADMIN_PASSWORD = "Fougue2026"
const ADMIN_2FA_CODE = "101088"
const SESSION_KEY = "admin_session_valid"

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [step, setStep] = useState<"password" | "2fa">("password")
  const [password, setPassword] = useState("")
  const [twoFACode, setTwoFACode] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    // Check if user has valid session
    const sessionValid = localStorage.getItem(SESSION_KEY) === "true"
    setIsAuthenticated(sessionValid)
    setIsLoading(false)
  }, [])

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password === ADMIN_PASSWORD) {
      setStep("2fa")
      setPassword("")
    } else {
      setError("Mot de passe incorrect")
      setPassword("")
    }
  }

  const handleTwoFASubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (twoFACode === ADMIN_2FA_CODE) {
      localStorage.setItem(SESSION_KEY, "true")
      setIsAuthenticated(true)
      setTwoFACode("")
    } else {
      setError("Code de vérification incorrect")
      setTwoFACode("")
    }
  }

  // Handle OTP value change
  const handleOTPChange = (value: string) => {
    setTwoFACode(value)
    setError("")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1E1E1E] flex items-center justify-center">
        <div className="text-white/60">Chargement...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#1E1E1E] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#800913] rounded-full mb-4">
              {step === "password" ? (
                <Lock className="w-8 h-8 text-white" />
              ) : (
                <Shield className="w-8 h-8 text-white" />
              )}
            </div>
            <h1 className="text-2xl font-light text-white mb-2">
              Administration Fougue
            </h1>
            <p className="text-white/60 text-sm">
              {step === "password"
                ? "Entrez votre mot de passe pour continuer"
                : "Entrez le code de vérification (2FA)"}
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-[#2A2A2A] border border-white/10 rounded-lg p-6">
            {step === "password" ? (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white/80">
                    Mot de passe
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setError("")
                    }}
                    placeholder="Entrez votre mot de passe"
                    className="bg-[#1E1E1E] border-white/10 text-white placeholder:text-white/40"
                    autoFocus
                  />
                </div>

                {error && (
                  <div className="text-red-400 text-sm p-3 bg-red-500/10 border border-red-500/20 rounded">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-[#800913] hover:bg-[#600711] text-white"
                >
                  Continuer
                </Button>
              </form>
            ) : (
              <form onSubmit={handleTwoFASubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="2fa" className="text-white/80">
                    Code de vérification
                  </Label>
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={twoFACode}
                      onChange={handleOTPChange}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} className="bg-[#1E1E1E] border-white/10 text-white" />
                        <InputOTPSlot index={1} className="bg-[#1E1E1E] border-white/10 text-white" />
                        <InputOTPSlot index={2} className="bg-[#1E1E1E] border-white/10 text-white" />
                        <InputOTPSlot index={3} className="bg-[#1E1E1E] border-white/10 text-white" />
                        <InputOTPSlot index={4} className="bg-[#1E1E1E] border-white/10 text-white" />
                        <InputOTPSlot index={5} className="bg-[#1E1E1E] border-white/10 text-white" />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>

                {error && (
                  <div className="text-red-400 text-sm p-3 bg-red-500/10 border border-red-500/20 rounded">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Button
                    type="submit"
                    className="w-full bg-[#800913] hover:bg-[#600711] text-white"
                  >
                    Vérifier
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setStep("password")
                      setTwoFACode("")
                      setError("")
                    }}
                    className="w-full text-white/60 hover:text-white hover:bg-white/5"
                  >
                    Retour
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export function logout() {
  localStorage.removeItem(SESSION_KEY)
  window.location.href = "/admin"
}
