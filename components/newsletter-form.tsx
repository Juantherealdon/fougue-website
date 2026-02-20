"use client"

import React from "react"

import { useState } from "react"
import { ArrowRight, Check, Loader2, Mail } from "lucide-react"
import { subscribeUser } from "@/app/actions/newsletter"

interface NewsletterFormProps {
  variant?: "light" | "dark"
  className?: string
}

export function NewsletterForm({ variant = "light", className = "" }: NewsletterFormProps) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) return

    setStatus("loading")

    try {
      const result = await subscribeUser({
        email,
        source: 'footer'
      })

      if (result.success) {
        setStatus("success")
        setMessage(result.message || "Welcome to the Fougue. family. Expect something beautiful soon.")
        setEmail("")

        // Reset after 5 seconds
        setTimeout(() => {
          setStatus("idle")
          setMessage("")
        }, 5000)
      } else {
        setStatus("error")
        setMessage(result.message || "Something went wrong. Please try again.")
        setTimeout(() => {
          setStatus("idle")
          setMessage("")
        }, 5000)
      }
    } catch (error) {
      console.error("[v0] Newsletter subscription error:", error)
      setStatus("error")
      setMessage("Something went wrong. Please try again.")
      setTimeout(() => {
        setStatus("idle")
        setMessage("")
      }, 5000)
    }
  }

  const isDark = variant === "dark"

  return (
    <div className={className}>
      {status === "success" ? (
        <div className={`flex items-center gap-3 ${isDark ? "text-white" : "text-[#1E1E1E]"}`}>
          <div className="w-10 h-10 rounded-full bg-[#800913] flex items-center justify-center">
            <Check size={20} className="text-white" />
          </div>
          <p className="text-sm">{message}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Mail
              size={18}
              className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                isDark ? "text-white/40" : "text-[#1E1E1E]/40"
              }`}
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className={`w-full pl-12 pr-4 py-4 text-sm transition-all duration-300 outline-none ${
                isDark
                  ? "bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
                  : "bg-white border border-[#1E1E1E]/10 text-[#1E1E1E] placeholder:text-[#1E1E1E]/40 focus:border-[#800913]/40"
              }`}
            />
          </div>
          <button
            type="submit"
            disabled={status === "loading"}
            className={`group flex items-center justify-center gap-2 px-6 py-4 text-sm tracking-[0.15em] uppercase transition-all duration-300 ${
              isDark
                ? "bg-white text-[#1E1E1E] hover:bg-white/90"
                : "bg-[#800913] text-white hover:bg-[#600910]"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {status === "loading" ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                Subscribe
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  )
}
