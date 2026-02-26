"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ArrowRight, ChevronDown, Sparkles } from "lucide-react"
import { NewsletterForm } from "@/components/newsletter-form"
import { WaitlistModal } from "@/components/waitlist-modal"

interface Experience {
  id: string
  title: string
  subtitle?: string
  description?: string
  shortDescription?: string
  image?: string
  images?: string[]
  price?: number
  duration?: string
  location?: string
  available?: boolean
  status?: string
  slug?: string
}

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-surprise.jpg"
            alt="Romantic surprise moment"
            fill
            sizes="100vw"
            className={`object-cover object-top transition-transform duration-[2s] ${
              isLoaded ? "scale-100" : "scale-110"
            }`}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1
            className={`font-serif text-5xl md:text-7xl lg:text-8xl font-light mb-6 transition-all duration-1000 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Fougue
          </h1>
          <p
            className={`text-xl md:text-2xl font-light text-white/80 mb-8 transition-all duration-1000 delay-300 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Curated romantic experiences for unforgettable moments
          </p>
          <Link
            href="/experiences"
            className={`inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white hover:bg-white/20 transition-all duration-500 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Discover Experiences
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-white/60" />
        </div>
      </section>

      {/* Intro Section */}
      <IntroSection />

      {/* Experiences Preview */}
      <ExperiencesPreview />

      {/* Difference Section */}
      <DifferenceSection />

      {/* Gifts Section */}
      <GiftsSection />

      {/* Quote Section */}
      <QuoteSection />

      {/* CTA Section */}
      <CTASection />

      {/* Newsletter Section */}
      <NewsletterSection />

      <Footer />
    </div>
  )
}

function IntroSection() {
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

  return (
    <section
      ref={sectionRef}
      className="py-32 px-4 bg-[#0a0a0a]"
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2
          className={`font-serif text-4xl md:text-5xl font-light mb-8 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          The Art of Romantic Surprise
        </h2>
        <p
          className={`text-lg md:text-xl text-white/70 leading-relaxed transition-all duration-1000 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          At Fougue, we believe that the most beautiful moments are those that take your breath away. 
          Our curated experiences are designed to create unforgettable memories, 
          where every detail is thoughtfully crafted to celebrate love in its most passionate form.
        </p>
      </div>
    </section>
  )
}

function ExperiencesPreview() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showWaitlist, setShowWaitlist] = useState(false)
  const [selectedExperience, setSelectedExperience] = useState<string | undefined>()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    async function fetchExperiences() {
      try {
        const response = await fetch("/api/experiences")
        if (response.ok) {
          const data = await response.json()
          setExperiences(data.slice(0, 3))
        }
      } catch (error) {
        console.error("Failed to fetch experiences:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchExperiences()
  }, [])

  return (
    <section ref={sectionRef} className="py-32 px-4 bg-[#111]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2
            className={`font-serif text-4xl md:text-5xl font-light mb-4 transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Curated Experiences
          </h2>
          <p
            className={`text-white/60 text-lg transition-all duration-1000 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Discover our handpicked romantic adventures
          </p>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-[3/4] bg-white/5 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {experiences.map((exp, index) => (
              <Link
                key={exp.id}
                href={`/experiences/${exp.slug || exp.id}`}
                className={`group relative aspect-[3/4] overflow-hidden rounded-lg transition-all duration-700 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-12"
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="absolute inset-0">
                  <Image
                    src={exp.image || "/placeholder.svg"}
                    alt={exp.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-serif text-2xl mb-2">{exp.title}</h3>
                  <p className="text-white/70 text-sm line-clamp-2">
                    {exp.shortDescription || exp.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div
          className={`text-center mt-12 transition-all duration-1000 delay-600 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Link
            href="/experiences"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            View all experiences
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <WaitlistModal
        isOpen={showWaitlist}
        onClose={() => setShowWaitlist(false)}
        experienceTitle={selectedExperience}
      />
    </section>
  )
}

function DifferenceSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.15 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const features = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Thoughtfully Curated",
      description: "Every experience is handpicked and refined to ensure perfection"
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Personalized Touch",
      description: "Customized details that reflect your unique love story"
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Seamless Execution",
      description: "We handle every detail so you can focus on the moment"
    }
  ]

  return (
    <section ref={sectionRef} className="py-32 px-4 bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto">
        <h2
          className={`font-serif text-4xl md:text-5xl font-light text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          The Fougue Difference
        </h2>

        <div className="grid md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`text-center transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-6">
                {feature.icon}
              </div>
              <h3 className="font-serif text-xl mb-3">{feature.title}</h3>
              <p className="text-white/60">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function GiftsSection() {
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

  return (
    <section ref={sectionRef} className="py-32 px-4 bg-[#111]">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div
            className={`relative aspect-[4/5] overflow-hidden rounded-lg transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
            }`}
          >
            <Image
              src="/images/gift-door.jpg"
              alt="Luxury gift presentation"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div
            className={`transition-all duration-1000 delay-300 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
            }`}
          >
            <h2 className="font-serif text-4xl md:text-5xl font-light mb-6">
              Curated Gifts
            </h2>
            <p className="text-white/70 text-lg mb-8 leading-relaxed">
              Complement your experience with our selection of thoughtfully curated gifts. 
              From artisanal chocolates to bespoke accessories, each item is chosen to 
              enhance your romantic gesture.
            </p>
            <Link
              href="/gifts"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full hover:bg-white/90 transition-colors"
            >
              Explore Gifts
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function QuoteSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="relative py-32 px-4 overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/couple-dancing.jpg"
          alt="Couple dancing in the street"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <blockquote
          className={`font-serif text-3xl md:text-4xl lg:text-5xl font-light italic leading-relaxed transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {'"'}The best thing to hold onto in life is each other.{'"'}
        </blockquote>
        <cite
          className={`block mt-8 text-white/60 text-lg not-italic transition-all duration-1000 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          — Audrey Hepburn
        </cite>
      </div>
    </section>
  )
}

function CTASection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-32 px-4 bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto text-center">
        <h2
          className={`font-serif text-4xl md:text-5xl font-light mb-6 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Ready to Create Magic?
        </h2>
        <p
          className={`text-white/70 text-lg mb-8 transition-all duration-1000 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Let us help you plan an unforgettable romantic experience
        </p>
        <div
          className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-400 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Link
            href="/experiences"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black rounded-full hover:bg-white/90 transition-colors"
          >
            Browse Experiences
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/20 rounded-full hover:bg-white/10 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  )
}

function NewsletterSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-32 px-4 bg-[#111]">
      <div className="max-w-2xl mx-auto text-center">
        <h2
          className={`font-serif text-3xl md:text-4xl font-light mb-4 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Stay Inspired
        </h2>
        <p
          className={`text-white/60 mb-8 transition-all duration-1000 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Subscribe to receive romantic inspiration and exclusive offers
        </p>
        <div
          className={`transition-all duration-1000 delay-400 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <NewsletterForm />
        </div>
      </div>
    </section>
  )
}
