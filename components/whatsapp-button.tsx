"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { X, MessageCircle } from "lucide-react"

// WhatsApp Business Configuration
const WHATSAPP_CONFIG = {
  // WhatsApp Business number (include country code, no + or spaces)
  phoneNumber: "971523157273",
  // Default message when users click to chat
  defaultMessage: "Hello Fougue! I'm interested in learning more about your romantic experiences.",
}

export function WhatsAppButton() {
  const pathname = usePathname()
  const isHomepage = pathname === "/"
  
  // Initialize isVisible based on current page and scroll position
  const [isVisible, setIsVisible] = useState(() => {
    if (!isHomepage) return true
    // On homepage, hide initially (will check scroll in useEffect)
    return typeof window !== "undefined" ? window.scrollY > 100 : false
  })
  
  const [isExpanded, setIsExpanded] = useState(false)
  const [customMessage, setCustomMessage] = useState(WHATSAPP_CONFIG.defaultMessage)

  // Hide button on homepage hero banner, show after scroll
  useEffect(() => {
    if (!isHomepage) {
      setIsVisible(true)
      return
    }

    // Check initial scroll position
    const hasScrolled = window.scrollY > 100
    setIsVisible(hasScrolled)

    const handleScroll = () => {
      // If user has scrolled down more than 100px, show the button
      const hasScrolled = window.scrollY > 100
      setIsVisible(hasScrolled)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isHomepage])

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(customMessage)
    const whatsappUrl = `https://wa.me/${WHATSAPP_CONFIG.phoneNumber}?text=${encodedMessage}`
    window.open(whatsappUrl, "_blank", "noopener,noreferrer")
    setIsExpanded(false)
  }

  return (
    <>
      {/* Expanded Chat Interface */}
      <div
        className={`fixed bottom-24 right-6 z-50 transition-all duration-500 ease-out ${
          isExpanded && isVisible
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <div className="bg-white rounded-2xl shadow-2xl w-[340px] overflow-hidden border border-[#1E1E1E]/5">
          {/* Header */}
          <div className="bg-[#800913] px-5 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">Fougue.</h3>
                  <p className="text-white/70 text-xs">Typically replies instantly</p>
                </div>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-white/70 hover:text-white transition-colors"
                aria-label="Close chat"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Chat Body */}
          <div className="bg-[#FBF5EF] p-4">
            {/* Welcome Message Bubble */}
            <div className="bg-white rounded-lg rounded-tl-none p-3 shadow-sm max-w-[85%]">
              <p className="text-[#1E1E1E] text-sm leading-relaxed">
                Hello! Welcome to Fougue. How can we help you create an unforgettable experience?
              </p>
              <span className="text-[#1E1E1E]/40 text-xs mt-1 block">Just now</span>
            </div>
          </div>

          {/* Message Input */}
          <div className="p-4 bg-white border-t border-[#1E1E1E]/5">
            <div className="flex flex-col gap-3">
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-full px-4 py-3 bg-[#FBF5EF] rounded-lg text-sm text-[#1E1E1E] placeholder:text-[#1E1E1E]/40 focus:outline-none focus:ring-2 focus:ring-[#800913]/20 resize-none"
                rows={2}
              />
              <button
                onClick={handleWhatsAppClick}
                className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white py-3 rounded-lg text-sm font-medium transition-colors duration-300 flex items-center justify-center gap-2"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Start Chat on WhatsApp
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="px-4 pb-4 bg-white">
            <p className="text-[#1E1E1E]/40 text-xs mb-2">Quick messages:</p>
            <div className="flex flex-wrap gap-2">
              {[
                "Book an experience",
                "Gift ideas",
                "Custom request",
              ].map((quickMsg) => (
                <button
                  key={quickMsg}
                  onClick={() => setCustomMessage(`Hello! I'd like to ${quickMsg.toLowerCase()}.`)}
                  className="px-3 py-1.5 bg-[#FBF5EF] hover:bg-[#800913]/10 text-[#1E1E1E] text-xs rounded-full transition-colors duration-300"
                >
                  {quickMsg}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-500 hover:scale-110 ${
          isExpanded
            ? "bg-[#1E1E1E] rotate-0"
            : "bg-[#25D366] hover:bg-[#20BD5A]"
        } ${
          isVisible
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        aria-label={isExpanded ? "Close WhatsApp chat" : "Open WhatsApp chat"}
      >
        {isExpanded ? (
          <X size={24} className="text-white" />
        ) : (
          <svg
            viewBox="0 0 24 24"
            className="w-7 h-7 text-white"
            fill="currentColor"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        )}
      </button>

      {/* Pulse Animation on Button */}
      {!isExpanded && isVisible && (
        <span className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#25D366] animate-ping opacity-30 pointer-events-none" />
      )}

      {/* Tooltip */}
      {!isExpanded && isVisible && (
        <div className="fixed bottom-8 right-24 z-50 bg-white px-4 py-2 rounded-lg shadow-lg opacity-0 hover:opacity-100 pointer-events-none transition-opacity duration-300">
          <p className="text-[#1E1E1E] text-sm whitespace-nowrap">Chat with us</p>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full">
            <div className="border-8 border-transparent border-l-white" />
          </div>
        </div>
      )}
    </>
  )
}
