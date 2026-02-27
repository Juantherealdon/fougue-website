"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, ShoppingBag, User } from "lucide-react"
import { useCart } from "./cart-context"
import { useAuth } from "./auth-context"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/experiences", label: "Experiences" },
  { href: "/gifts", label: "Gifts Collection" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { totalItems, setIsCartOpen } = useCart()
  const { user, setIsAuthModalOpen, setAuthModalView } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleAccountClick = () => {
    if (user) {
      // Navigate to account page
      window.location.href = "/account"
    } else {
      setAuthModalView("login")
      setIsAuthModalOpen(true)
    }
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-[#1E1E1E]/95 backdrop-blur-md py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="relative z-10">
              <Image
                src="/images/fougue-logo-white-transparent.png"
                alt="Fougue."
                width={120}
                height={50}
                className="h-10 w-auto"
                priority
                loading="eager"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-white/90 hover:text-white text-sm tracking-[0.2em] uppercase transition-colors duration-300 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#800913] transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </div>

            {/* Account, Cart & Mobile Menu */}
            <div className="flex items-center gap-2">
              {/* Account Button */}
              <button
                onClick={handleAccountClick}
                className="relative text-white p-2 hover:text-[#800913] transition-colors"
                aria-label={user ? "My Account" : "Sign In"}
              >
                <User size={22} />
                {user && (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#800913] rounded-full" />
                )}
              </button>

              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative text-white p-2 hover:text-[#800913] transition-colors"
                aria-label="Open cart"
              >
                <ShoppingBag size={22} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#800913] text-white text-xs flex items-center justify-center rounded-full">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden text-white p-2"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 bg-[#1E1E1E] transition-transform duration-500 lg:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navLinks.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white text-2xl tracking-[0.2em] uppercase transition-all duration-300 hover:text-[#800913]"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={() => {
              setIsMobileMenuOpen(false)
              handleAccountClick()
            }}
            className="text-white text-2xl tracking-[0.2em] uppercase transition-all duration-300 hover:text-[#800913] mt-4"
          >
            {user ? "My Account" : "Sign In"}
          </button>
        </div>
      </div>
    </>
  )
}
