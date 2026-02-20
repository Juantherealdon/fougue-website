"use client"

import Image from "next/image"
import Link from "next/link"
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight } from "lucide-react"
import { useCart } from "./cart-context"

export function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeItem, totalItems, totalPrice, clearCart } = useCart()

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isCartOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-500 ease-out ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#1E1E1E]/10">
            <div className="flex items-center gap-3">
              <ShoppingBag size={20} className="text-[#800913]" />
              <h2 className="text-[#1E1E1E] text-lg tracking-[0.1em] uppercase">
                Your Cart
              </h2>
              <span className="text-[#1E1E1E]/50 text-sm">({totalItems})</span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="w-10 h-10 flex items-center justify-center hover:bg-[#FBF5EF] transition-colors"
            >
              <X size={20} className="text-[#1E1E1E]" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-[#FBF5EF] flex items-center justify-center mb-6">
                  <ShoppingBag size={32} className="text-[#800913]/50" />
                </div>
                <h3 className="text-[#1E1E1E] text-xl font-light mb-2">
                  Your cart is empty
                </h3>
                <p className="text-[#1E1E1E]/60 text-sm mb-8">
                  Discover our curated collection of gifts and experiences
                </p>
                <Link
                  href="/gifts"
                  onClick={() => setIsCartOpen(false)}
                  className="inline-flex items-center gap-2 text-[#800913] text-sm tracking-[0.1em] uppercase hover:gap-3 transition-all"
                >
                  Browse Collection
                  <ArrowRight size={16} />
                </Link>
              </div>
            ) : (
              <div className="p-6 space-y-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    {/* Image */}
                    <div className="relative w-24 h-24 bg-[#FBF5EF] flex-shrink-0 overflow-hidden">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[#1E1E1E] text-sm font-medium mb-1 truncate">
                        {item.title}
                      </h3>
                      
                      {/* Experience details */}
                      {item.type === 'experience' && (
                        <div className="text-xs text-[#1E1E1E]/60 mb-2 space-y-0.5">
                          <p>{new Date(item.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                          <p>{item.time} • {item.guests} {item.guests === 1 ? 'guest' : 'guests'}</p>
                          {item.addOns && item.addOns.length > 0 && (
                            <p className="text-[#800913]">+{item.addOns.length} add-on{item.addOns.length > 1 ? 's' : ''}</p>
                          )}
                        </div>
                      )}
                      
                      <p className="text-[#800913] text-sm mb-3">
                        {item.currency} {item.price.toLocaleString()}
                      </p>

                      {/* Quantity Controls - Only for products */}
                      <div className="flex items-center justify-between">
                        {item.type === 'product' && (
                          <div className="flex items-center border border-[#1E1E1E]/20">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-[#FBF5EF] transition-colors"
                            >
                              <Minus size={14} className="text-[#1E1E1E]" />
                            </button>
                            <span className="w-8 text-center text-[#1E1E1E] text-sm">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-[#FBF5EF] transition-colors"
                            >
                              <Plus size={14} className="text-[#1E1E1E]" />
                            </button>
                          </div>
                        )}

                        {/* Remove Button */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-[#1E1E1E]/40 hover:text-[#800913] transition-colors ml-auto"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Clear Cart */}
                {items.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-[#1E1E1E]/50 text-xs tracking-[0.1em] uppercase hover:text-[#800913] transition-colors"
                  >
                    Clear Cart
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-[#1E1E1E]/10 p-6 space-y-4 bg-white">
              {/* Subtotal */}
              <div className="flex items-center justify-between">
                <span className="text-[#1E1E1E]/70 text-sm">Subtotal</span>
                <span className="text-[#1E1E1E] text-lg">
                  AED {totalPrice.toLocaleString()}
                </span>
              </div>

              <p className="text-[#1E1E1E]/50 text-xs">
                Shipping and taxes calculated at checkout
              </p>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="block w-full bg-[#800913] text-white py-4 text-center text-sm tracking-[0.15em] uppercase hover:bg-[#600910] transition-colors"
              >
                Proceed to Checkout
              </Link>

              {/* Continue Shopping */}
              <button
                onClick={() => setIsCartOpen(false)}
                className="block w-full text-center text-[#1E1E1E] text-sm tracking-[0.1em] uppercase hover:text-[#800913] transition-colors py-2"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
