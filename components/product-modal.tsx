"use client"

import { useState } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight, Heart, ShoppingBag, Minus, Plus, Check } from "lucide-react"
import { useCart } from "./cart-context"

export interface Product {
  id: string
  title: string
  price: number
  currency: string
  category: "gift-cards" | "couple-gifts" | "digital-gifts"
  images: string[]
  description: string
  details: string[]
  includes: string[]
}

interface ProductModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isLiked, setIsLiked] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const { addItem } = useCart()

  if (!isOpen || !product) return null

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)
  }

  const handleAddToCart = () => {
    addItem(
      {
        type: 'product',
        id: product.id,
        title: product.title,
        price: product.price,
        currency: product.currency,
        image: product.images[0],
      },
      quantity
    )
    setAddedToCart(true)
    setTimeout(() => {
      setAddedToCart(false)
      onClose()
    }, 1000)
  }

  const handleBuyNow = () => {
    addItem(
      {
        type: 'product',
        id: product.id,
        title: product.title,
        price: product.price,
        currency: product.currency,
        image: product.images[0],
      },
      quantity
    )
    window.location.href = "/checkout"
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-4xl bg-white animate-fade-in-up overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
        >
          <X size={20} className="text-[#1E1E1E]" />
        </button>

        <div className="flex flex-col md:flex-row max-h-[85vh]">
          {/* Image Gallery - Compact */}
          <div className="relative md:w-2/5 bg-[#FBF5EF] flex-shrink-0">
            <div className="relative aspect-square">
              <Image
                src={product.images[currentImageIndex] || "/placeholder.svg"}
                alt={product.title}
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover"
              />

              {/* Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <ChevronLeft size={18} className="text-[#1E1E1E]" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <ChevronRight size={18} className="text-[#1E1E1E]" />
                  </button>
                </>
              )}

              {/* Image Dots */}
              {product.images.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {product.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                        index === currentImageIndex
                          ? "bg-[#800913] w-4"
                          : "bg-[#1E1E1E]/30 hover:bg-[#1E1E1E]/50"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {product.images.length > 1 && (
              <div className="hidden md:flex gap-1.5 p-3 bg-white border-t border-[#1E1E1E]/10">
                {product.images.slice(0, 4).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative w-12 h-12 overflow-hidden transition-all duration-300 ${
                      index === currentImageIndex
                        ? "ring-2 ring-[#800913]"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.title} ${index + 1}`}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details - Scrollable */}
          <div className="md:w-3/5 p-6 md:p-8 overflow-y-auto max-h-[50vh] md:max-h-[85vh]">
            {/* Category Badge */}
            <p className="text-[#800913] text-xs tracking-[0.2em] uppercase mb-2">
              {product.category === "gift-cards" && "Gift Cards & Vouchers"}
              {product.category === "couple-gifts" && "Couple Gifts"}
              {product.category === "digital-gifts" && "Digital Gifts"}
            </p>

            {/* Title & Price */}
            <h2 className="text-[#1E1E1E] text-2xl md:text-3xl font-light mb-1">
              {product.title}
            </h2>
            <p className="text-[#800913] text-xl font-light mb-4">
              {product.currency} {product.price.toLocaleString()}
            </p>

            {/* Description */}
            <p className="text-[#1E1E1E]/70 text-sm leading-relaxed mb-4">
              {product.description}
            </p>

            {/* What's Included - Compact */}
            <div className="mb-4 pb-4 border-b border-[#1E1E1E]/10">
              <h3 className="text-[#1E1E1E] text-xs tracking-[0.15em] uppercase mb-2">
                What's Included
              </h3>
              <ul className="grid grid-cols-2 gap-1.5">
                {product.includes.slice(0, 4).map((item) => (
                  <li key={item} className="flex items-center gap-2 text-[#1E1E1E]/70 text-xs">
                    <span className="w-1 h-1 bg-[#800913] rounded-full flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity & Actions - Fixed at Bottom */}
            <div className="space-y-3">
              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="text-[#1E1E1E] text-xs tracking-[0.1em] uppercase">
                  Qty
                </span>
                <div className="flex items-center border border-[#1E1E1E]/20">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 flex items-center justify-center hover:bg-[#FBF5EF] transition-colors"
                  >
                    <Minus size={14} className="text-[#1E1E1E]" />
                  </button>
                  <span className="w-10 text-center text-[#1E1E1E] text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 flex items-center justify-center hover:bg-[#FBF5EF] transition-colors"
                  >
                    <Plus size={14} className="text-[#1E1E1E]" />
                  </button>
                </div>

                {/* Like Button */}
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`ml-auto w-10 h-10 flex items-center justify-center border transition-all duration-300 ${
                    isLiked
                      ? "bg-[#800913] border-[#800913]"
                      : "border-[#1E1E1E]/20 hover:border-[#800913]"
                  }`}
                >
                  <Heart
                    size={18}
                    className={isLiked ? "text-white fill-white" : "text-[#1E1E1E]"}
                  />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={addedToCart}
                  className={`flex-1 py-3 text-xs tracking-[0.15em] uppercase flex items-center justify-center gap-2 border transition-all duration-300 ${
                    addedToCart
                      ? "bg-[#1E1E1E] border-[#1E1E1E] text-white"
                      : "border-[#1E1E1E] text-[#1E1E1E] hover:bg-[#1E1E1E] hover:text-white"
                  }`}
                >
                  {addedToCart ? (
                    <>
                      <Check size={16} />
                      Added
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={16} />
                      Add to Cart
                    </>
                  )}
                </button>

                {/* Buy Now */}
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-[#800913] text-white py-3 text-xs tracking-[0.15em] uppercase hover:bg-[#600910] transition-colors"
                >
                  Buy Now
                </button>
              </div>

              {/* Shipping Info */}
              <p className="text-[#1E1E1E]/40 text-xs text-center pt-2">
                Free Dubai delivery • Gift wrapping included
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
