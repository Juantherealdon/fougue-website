import React from "react"
import type { Metadata } from "next"
import { Cormorant_Garamond } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { CartProvider } from "@/components/cart-context"
import { CartDrawer } from "@/components/cart-drawer"
import { AuthProvider } from "@/components/auth-context"
import { AuthModal } from "@/components/auth-modal"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { ScrollToTop } from "@/components/scroll-to-top"
import "./globals.css"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Fougue. | Intimate Experiences for Couples in Dubai",
  description:
    "Fougue. is a Dubai-based brand creating original, themed and intimate experiences for couples who want more than the usual. Re-enchant the way you spend time together.",
  generator: "v0.app",
  keywords: [
    "romantic experiences",
    "couples Dubai",
    "intimate experiences",
    "date ideas Dubai",
    "luxury experiences",
  ],
  icons: {
    icon: [
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
      {
        url: "/icon-light-32x32.jpg",
        media: "(prefers-color-scheme: light)",
        sizes: "32x32",
      },
      {
        url: "/icon-dark-32x32.jpg",
        media: "(prefers-color-scheme: dark)",
        sizes: "32x32",
      },
    ],
    apple: "/apple-icon.jpg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${cormorant.className} antialiased`}>
        <AuthProvider>
          <CartProvider>
            <ScrollToTop />
            {children}
            <CartDrawer />
            <AuthModal />
            <WhatsAppButton />
          </CartProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
