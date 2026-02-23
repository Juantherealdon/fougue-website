"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import {
  ArrowRight,
  Gift,
  Heart,
  Sparkles,
  CreditCard,
  Users,
  Smartphone,
  SlidersHorizontal,
  ChevronDown,
  X,
} from "lucide-react"
import { ProductModal, type Product } from "@/components/product-modal"

const categories = [
  {
    id: "all",
    label: "All Gifts",
    icon: Gift,
  },
  {
    id: "gift-cards",
    label: "Gift Cards & Vouchers",
    icon: CreditCard,
  },
  {
    id: "couple-gifts",
    label: "Couple Gifts",
    icon: Users,
  },
  {
    id: "digital-gifts",
    label: "Digital Gifts",
    icon: Smartphone,
  },
]

const fallbackProducts: Product[] = [
  // Gift Cards & Vouchers
  {
    id: "experience-voucher-500",
    title: "Experience Voucher",
    price: 500,
    currency: "AED",
    category: "gift-cards",
    images: ["/images/letter-seal.jpg", "/images/gift-door.jpg", "/images/surprise-hands.jpg"],
    description:
      "An elegant voucher redeemable for any Fougue. experience. Presented in our signature wax-sealed envelope with a personalized message card.",
    details: ["Valid for 12 months from purchase", "Redeemable for any experience", "Non-refundable"],
    includes: [
      "Wax-sealed presentation envelope",
      "Personalized message card",
      "Digital confirmation",
      "Concierge booking assistance",
    ],
  },
  {
    id: "experience-voucher-1000",
    title: "Premium Experience Voucher",
    price: 1000,
    currency: "AED",
    category: "gift-cards",
    images: ["/images/letter-seal.jpg", "/images/gift-door.jpg"],
    description:
      "A premium voucher for discerning gift-givers. Includes priority booking and complimentary add-ons for any selected experience.",
    details: [
      "Valid for 18 months from purchase",
      "Priority booking privileges",
      "Includes one premium add-on",
      "Non-refundable",
    ],
    includes: [
      "Luxury gift box presentation",
      "Handwritten message card",
      "Priority booking access",
      "One complimentary add-on",
      "Dedicated concierge",
    ],
  },
  {
    id: "mystery-experience-card",
    title: "Mystery Experience Card",
    price: 1500,
    currency: "AED",
    category: "gift-cards",
    images: ["/images/surprise-hands.jpg", "/images/letter-seal.jpg"],
    description:
      "The ultimate surprise. We select the perfect experience based on your preferences. The recipient discovers only the date and dress code.",
    details: [
      "Experience selected by our curators",
      "Recipient receives sealed invitation",
      "Date and dress code only revealed",
      "Non-transferable",
    ],
    includes: [
      "Curator-selected experience",
      "Sealed mystery invitation",
      "Premium gift packaging",
      "Personal concierge service",
    ],
  },
  // Couple Gifts
  {
    id: "couples-collection-classic",
    title: "The Couples Collection",
    price: 3500,
    currency: "AED",
    category: "couple-gifts",
    images: ["/images/gift-door.jpg", "/images/hero-couple-dinner.jpg", "/images/couple-dancing.jpg"],
    description:
      "Two complete experiences for couples who deserve it all. Includes French Rendez-vous and L'Interlude Français with complimentary champagne.",
    details: [
      "Valid for 12 months",
      "Flexible scheduling",
      "Experiences can be booked separately",
      "Premium upgrades available",
    ],
    includes: [
      "French Rendez-vous experience",
      "L'Interlude Français experience",
      "Complimentary Moët & Chandon",
      "Luxury presentation box",
      "Priority booking",
    ],
  },
  {
    id: "romantic-escape-box",
    title: "Romantic Escape Box",
    price: 2200,
    currency: "AED",
    category: "couple-gifts",
    images: ["/images/gift-door.jpg", "/images/experience-picnic.jpg"],
    description:
      "A curated box of romantic essentials paired with a picnic experience. Perfect for celebrating anniversaries or special moments.",
    details: [
      "L'Interlude Français experience included",
      "Artisanal products from French suppliers",
      "Hand-assembled in Dubai",
    ],
    includes: [
      "L'Interlude Français experience",
      "Premium French wine",
      "Artisanal chocolates",
      "Scented candle",
      "Personalized love letter kit",
    ],
  },
  {
    id: "anniversary-special",
    title: "Anniversary Special",
    price: 4500,
    currency: "AED",
    category: "couple-gifts",
    images: ["/images/hero-couple-dinner.jpg", "/images/couple-dancing.jpg", "/images/gift-door.jpg"],
    description:
      "Celebrate your love story with our most romantic package. A full evening experience with private photographer and keepsake album.",
    details: [
      "French Rendez-vous experience",
      "Professional photography session",
      "Custom album delivered within 2 weeks",
    ],
    includes: [
      "French Rendez-vous experience",
      "90-minute photography session",
      "20 edited digital photos",
      "Luxury printed album",
      "Rose petal decoration",
      "Complimentary champagne",
    ],
  },
  // Digital Gifts
  {
    id: "e-voucher-instant",
    title: "Instant E-Voucher",
    price: 500,
    currency: "AED",
    category: "digital-gifts",
    images: ["/images/letter-seal.jpg"],
    description:
      "Send love instantly. A beautifully designed digital voucher delivered directly to your recipient's inbox within minutes.",
    details: [
      "Instant email delivery",
      "Valid for 12 months",
      "Printable design included",
      "Mobile-friendly redemption",
    ],
    includes: [
      "Animated email presentation",
      "Personalized video message option",
      "Digital gift card",
      "Booking link included",
    ],
  },
  {
    id: "digital-mystery-invitation",
    title: "Digital Mystery Invitation",
    price: 1200,
    currency: "AED",
    category: "digital-gifts",
    images: ["/images/surprise-hands.jpg", "/images/letter-seal.jpg"],
    description:
      "A digital mystery experience with an interactive reveal. Perfect for long-distance surprises or last-minute romantic gestures.",
    details: [
      "Interactive digital invitation",
      "Scheduled delivery available",
      "Experience revealed in stages",
    ],
    includes: [
      "Interactive digital experience",
      "Countdown reveal sequence",
      "Video message integration",
      "Any experience of choice",
    ],
  },
  {
    id: "virtual-date-kit",
    title: "Virtual Date Kit",
    price: 350,
    currency: "AED",
    category: "digital-gifts",
    images: ["/images/experience-paint.jpg"],
    description:
      "For couples apart. A synchronized virtual date experience with delivered kits to both locations and guided online session.",
    details: [
      "Two kits delivered to separate addresses",
      "Scheduled virtual session",
      "Facilitated by Fougue. host",
    ],
    includes: [
      "Two matching activity kits",
      "Private video session link",
      "Guided facilitation",
      "Digital keepsake",
      "Playlist access",
    ],
  },
]

const sortOptions = [
  { id: "featured", label: "Featured" },
  { id: "price-low", label: "Price: Low to High" },
  { id: "price-high", label: "Price: High to Low" },
  { id: "newest", label: "Newest" },
]

function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <section className="relative h-[60vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/gift-door.jpg"
          alt="Luxury gift presentation"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
        <p
          className={`text-white/80 text-sm tracking-[0.4em] uppercase mb-6 transition-all duration-700 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Love, Made Tangible 
        </p>
        <h1
          className={`text-white text-5xl md:text-6xl lg:text-7xl font-light mb-6 transition-all duration-700 delay-200 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Gifts <span className="italic text-[#800913]">Collection</span>
        </h1>
        <p
          className={`text-white/70 text-lg md:text-xl max-w-2xl transition-all duration-700 delay-400 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Curated objects to celebrate love - before, during, and long after the moment.
        </p>
      </div>
    </section>
  )
}

function CategoryFilter({
  activeCategory,
  onCategoryChange,
}: {
  activeCategory: string
  onCategoryChange: (category: string) => void
}) {
  return (
    <section className="bg-white border-b border-[#1E1E1E]/10 sticky top-20 z-30">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex items-center justify-center gap-2 md:gap-8 py-6 overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`flex items-center gap-2 md:gap-3 px-4 md:px-6 py-3 text-sm tracking-[0.1em] uppercase whitespace-nowrap transition-all duration-300 ${
                activeCategory === category.id
                  ? "bg-[#800913] text-white"
                  : "bg-transparent text-[#1E1E1E]/70 hover:text-[#800913] hover:bg-[#800913]/5"
              }`}
            >
              <category.icon size={18} />
              <span className="hidden md:inline">{category.label}</span>
              <span className="md:hidden">
                {category.id === "all"
                  ? "All"
                  : category.id === "gift-cards"
                    ? "Cards"
                    : category.id === "couple-gifts"
                      ? "Couples"
                      : "Digital"}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

function FilterSidebar({
  sortBy,
  onSortChange,
  selectedSubcategory,
  onSubcategoryChange,
  subcategories,
  isOpen,
  onClose,
}: {
  sortBy: string
  onSortChange: (sort: string) => void
  selectedSubcategory: string
  onSubcategoryChange: (subcategory: string) => void
  subcategories: { id: string; name: string }[]
  isOpen: boolean
  onClose: () => void
}) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative top-0 left-0 h-full lg:h-auto w-72 lg:w-56 bg-white lg:bg-transparent z-50 lg:z-auto transform transition-transform duration-300 lg:transform-none ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6 lg:p-0 lg:sticky lg:top-40">
          {/* Mobile Header */}
          <div className="flex items-center justify-between mb-8 lg:hidden">
            <h3 className="text-[#1E1E1E] text-lg font-light">Filters</h3>
            <button onClick={onClose}>
              <X size={20} className="text-[#1E1E1E]" />
            </button>
          </div>

          {/* Sort */}
          <div className="mb-8">
            <h4 className="text-[#1E1E1E] text-xs tracking-[0.2em] uppercase mb-4">
              Sort By
            </h4>
            <div className="space-y-2">
              {sortOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => onSortChange(option.id)}
                  className={`w-full text-left px-3 py-2 text-sm transition-all duration-200 ${
                    sortBy === option.id
                      ? "text-[#800913] bg-[#800913]/5"
                      : "text-[#1E1E1E]/60 hover:text-[#1E1E1E] hover:bg-[#1E1E1E]/5"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Subcategory Filter */}
          {subcategories.length > 0 && (
            <div>
              <h4 className="text-[#1E1E1E] text-xs tracking-[0.2em] uppercase mb-4">
                Collection
              </h4>
              <div className="space-y-2">
                <button
                  onClick={() => onSubcategoryChange("all")}
                  className={`w-full text-left px-3 py-2 text-sm transition-all duration-200 ${
                    selectedSubcategory === "all"
                      ? "text-[#800913] bg-[#800913]/5"
                      : "text-[#1E1E1E]/60 hover:text-[#1E1E1E] hover:bg-[#1E1E1E]/5"
                  }`}
                >
                  All Collections
                </button>
                {subcategories.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => onSubcategoryChange(sub.name)}
                    className={`w-full text-left px-3 py-2 text-sm transition-all duration-200 ${
                      selectedSubcategory === sub.name
                        ? "text-[#800913] bg-[#800913]/5"
                        : "text-[#1E1E1E]/60 hover:text-[#1E1E1E] hover:bg-[#1E1E1E]/5"
                    }`}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}

function ProductCard({
  product,
  index,
  onClick,
}: {
  product: Product
  index: number
  onClick: () => void
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group cursor-pointer transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#FBF5EF] mb-4">
        <Image
          src={product.images[0] || "/placeholder.svg"}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={`object-cover transition-transform duration-700 ${
            isHovered ? "scale-105" : "scale-100"
          }`}
          {...(index < 4 ? { priority: true } : { loading: "lazy" as const })}
        />

        {/* Quick View Overlay */}
        <div
          className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <span className="text-white text-sm tracking-[0.2em] uppercase border border-white px-6 py-3 hover:bg-white hover:text-[#1E1E1E] transition-colors">
            Quick View
          </span>
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur-sm text-[#1E1E1E] text-[10px] tracking-[0.15em] uppercase px-3 py-1.5">
            {product.category === "gift-cards" && "Voucher"}
            {product.category === "couple-gifts" && "For Couples"}
            {product.category === "digital-gifts" && "Digital"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div>
        <h3 className="text-[#1E1E1E] text-lg font-light mb-1 group-hover:text-[#800913] transition-colors">
          {product.title}
        </h3>
        <p className="text-[#800913] text-sm">
          {product.currency} {product.price.toLocaleString("en-US")}
        </p>
      </div>
    </div>
  )
}

function WhyGiftSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const reasons = [
    {
      icon: Gift,
      title: "Signature Presentation",
      description:
        "Every gift arrives in elegant packaging, creating anticipation from the first moment.",
    },
    {
      icon: Heart,
      title: "Thoughtfully Curated",
      description:
        "Each item is selected to create meaningful connections and lasting memories.",
    },
    {
      icon: Sparkles,
      title: "Beyond Material",
      description:
        "Our gifts transform into stories—moments that become treasured memories.",
    },
  ]

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-[#1E1E1E]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <p
            className={`text-[#800913] text-sm tracking-[0.3em] uppercase mb-4 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            The Fougue. Difference
          </p>
          <h2
            className={`text-white text-4xl md:text-5xl font-light transition-all duration-700 delay-100 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            More Than <span className="italic text-[#800913]">Gifts</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {reasons.map((reason, index) => (
            <div
              key={reason.title}
              className={`text-center transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${200 + index * 150}ms` }}
            >
              <div className="w-16 h-16 mx-auto mb-6 border border-[#800913] flex items-center justify-center">
                <reason.icon className="text-[#800913]" size={28} />
              </div>
              <h3 className="text-white text-xl font-light mb-4">{reason.title}</h3>
              <p className="text-white/60 leading-relaxed">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ComingSoonSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.2 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || isSubmitting) return
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (response.ok) {
        setIsSubmitted(true)
        setEmail("")
      }
    } catch {
      // Silently fail
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section ref={sectionRef} className="py-32 lg:py-48 bg-[#FBF5EF]">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <div
          className={`mb-8 transition-all duration-700 ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"
          }`}
        >
          <Sparkles size={32} className="text-[#800913] mx-auto" />
        </div>

        <p
          className={`text-[#800913] text-sm tracking-[0.3em] uppercase mb-6 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          The Collection
        </p>

        <h2
          className={`text-[#1E1E1E] text-4xl md:text-5xl lg:text-6xl font-light mb-8 transition-all duration-700 delay-100 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Coming <span className="italic text-[#800913]">Soon</span>
        </h2>

        <p
          className={`text-[#1E1E1E]/60 text-lg md:text-xl leading-relaxed mb-6 transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Our collection is quietly taking form.
        </p>

        <p
          className={`text-[#1E1E1E]/50 text-base md:text-lg leading-relaxed mb-14 max-w-xl mx-auto transition-all duration-700 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          A series of symbolic keepsakes and intimate rituals designed to extend the art of romance beyond the moment.
        </p>

        <div
          className={`transition-all duration-700 delay-[400ms] ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-[#1E1E1E]/70 text-sm tracking-[0.15em] uppercase mb-6">
            {"Join Fougue inner circle for early access"}
          </p>

          {isSubmitted ? (
            <div className="flex items-center justify-center gap-3 py-4">
              <Heart size={18} className="text-[#800913]" />
              <p className="text-[#1E1E1E]/70 text-sm">
                {"You're on the list. We'll be in touch."}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-5 py-3.5 bg-white border border-[#1E1E1E]/10 text-[#1E1E1E] text-sm placeholder:text-[#1E1E1E]/40 focus:outline-none focus:border-[#800913]/40 transition-colors"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3.5 bg-[#800913] text-white text-sm tracking-[0.15em] uppercase hover:bg-[#600910] transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                {isSubmitting ? "..." : "Join"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

interface ProductWithSubcategory extends Product {
  subcategory?: string
}

export default function GiftsPage() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [selectedSubcategory, setSelectedSubcategory] = useState("all")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [products, setProducts] = useState<ProductWithSubcategory[]>([])
  const [hasLoadedFromDb, setHasLoadedFromDb] = useState(false)
  const [dbHasProducts, setDbHasProducts] = useState(true)
  const [subcategories, setSubcategories] = useState<{ id: string; name: string }[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000])

  // Load products and subcategories from Supabase
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch('/api/products')
        if (response.ok) {
          const data = await response.json()
          
          // Map database fields to component interface
          const mappedProducts: ProductWithSubcategory[] = data.map((prod: any) => ({
            id: prod.id,
            title: prod.name,
            price: Number(prod.price) || 0,
            currency: prod.currency || 'AED',
            category: prod.category || 'gift-cards',
            subcategory: prod.subcategory || '',
            images: prod.images || ['/placeholder.jpg'],
            description: prod.description || '',
            details: prod.badges || [],
            includes: [],
          }))
          
          setHasLoadedFromDb(true)
          if (mappedProducts.length > 0) {
            setProducts(mappedProducts)
            setDbHasProducts(true)
          } else {
            setProducts([])
            setDbHasProducts(false)
          }
        } else {
          setHasLoadedFromDb(true)
          setProducts(fallbackProducts)
        }
      } catch (error) {
        console.error("Error loading products:", error)
        setHasLoadedFromDb(true)
        setProducts(fallbackProducts)
      }
    }
    
    const loadSubcategories = async () => {
      try {
        const response = await fetch('/api/product-subcategories')
        if (response.ok) {
          const data = await response.json()
          setSubcategories(data)
        }
      } catch (error) {
        console.error("Error loading subcategories:", error)
      }
    }
    
    loadProducts()
    loadSubcategories()
  }, [])

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
      const categoryMatch = activeCategory === "all" || product.category === activeCategory
      const subcategoryMatch = selectedSubcategory === "all" || product.subcategory === selectedSubcategory
      const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1]
      return categoryMatch && subcategoryMatch && priceMatch
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "newest":
          return 0 // Would use date in real implementation
        default:
          return 0
      }
    })

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product)
    setModalOpen(true)
  }

  return (
    <main>
      <Navigation />
      <HeroSection />
      {hasLoadedFromDb && !dbHasProducts ? (
        <ComingSoonSection />
      ) : (
        <>
          <CategoryFilter activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

          {/* Products Section */}
          <section className="py-16 lg:py-24 bg-[#FBF5EF]">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              {/* Mobile Filter Button */}
              <div className="flex items-center justify-between mb-8 lg:hidden">
                <p className="text-[#1E1E1E]/60 text-sm">
                  {filteredProducts.length} products
                </p>
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="flex items-center gap-2 text-[#1E1E1E] text-sm"
                >
                  <SlidersHorizontal size={16} />
                  Filter & Sort
                </button>
              </div>

              <div className="flex gap-12">
                {/* Sidebar */}
                <FilterSidebar
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                  selectedSubcategory={selectedSubcategory}
                  onSubcategoryChange={setSelectedSubcategory}
                  subcategories={subcategories}
                  isOpen={sidebarOpen}
                  onClose={() => setSidebarOpen(false)}
                />

                {/* Products Grid */}
                <div className="flex-1">
                  {/* Desktop Header */}
                  <div className="hidden lg:flex items-center justify-between mb-8">
                    <p className="text-[#1E1E1E]/60 text-sm">
                      Showing {filteredProducts.length} products
                    </p>
                  </div>

                  {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
                      {filteredProducts.map((product, index) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          index={index}
                          onClick={() => handleProductClick(product)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <p className="text-[#1E1E1E]/60 text-lg mb-4">No products found</p>
                      <button
                        onClick={() => {
                          setActiveCategory("all")
                          setSelectedSubcategory("all")
                        }}
                        className="text-[#800913] text-sm underline hover:no-underline"
                      >
                        Clear all filters
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          <WhyGiftSection />
        </>
      )}

      <Footer />

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </main>
  )
}
