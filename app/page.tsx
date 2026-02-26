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
  tagline?: string
  description?: string
  price?: number
  duration?: string
  image?: string
  status?: string
  available?: boolean
}

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <main className="min-h-screen bg-[#FBF5EF]">
      <Navigation />
      <HeroSection isLoaded={isLoaded} />
      <IntroSection />
      <ExperiencesPreview />
      <DifferenceSection />
      <GiftsSection />
      <QuoteSection />
      <CTASection />
      <NewsletterSection />
      <Footer />
    </main>
  )
}

function HeroSection({ isLoaded }: { isLoaded: boolean }) {
  return (
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
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl">
        <h1
          className={`font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-6 transition-all duration-1000 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Love, Crafted
        </h1>
        <p
          className={`text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10 transition-all duration-1000 delay-300 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Bespoke romantic experiences for those who believe love deserves to be
          celebrated with intention
        </p>
        <div
          className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-500 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Link
            href="/experiences"
            className="inline-flex items-center justify-center gap-2 bg-white text-[#1E1E1E] px-8 py-4 text-sm tracking-wider hover:bg-white/90 transition-colors"
          >
            DISCOVER EXPERIENCES
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/gifts"
            className="inline-flex items-center justify-center gap-2 border border-white text-white px-8 py-4 text-sm tracking-wider hover:bg-white/10 transition-colors"
          >
            EXPLORE GIFTS
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="text-white/60" size={32} />
      </div>
    </section>
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
      className="py-24 md:py-32 px-6 bg-[#FBF5EF]"
    >
      <div className="max-w-4xl mx-auto text-center">
        <p
          className={`text-sm tracking-[0.3em] text-[#800913] mb-6 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          THE FOUGUE PHILOSOPHY
        </p>
        <h2
          className={`font-serif text-3xl md:text-5xl text-[#1E1E1E] mb-8 leading-tight transition-all duration-700 delay-150 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          We believe that the most meaningful moments in love are the ones we
          intentionally create
        </h2>
        <p
          className={`text-lg text-[#1E1E1E]/70 max-w-2xl mx-auto transition-all duration-700 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Each Fougue experience is designed to transform ordinary evenings into
          extraordinary memories, weaving together atmosphere, sensation, and
          emotion into something unforgettable.
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
          const available = data.filter((exp: Experience) => exp.status === "available" || exp.available)
          setExperiences(available.slice(0, 3))
        }
      } catch (error) {
        console.error("Error fetching experiences:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchExperiences()
  }, [])

  const handleWaitlistClick = (experienceTitle: string) => {
    setSelectedExperience(experienceTitle)
    setShowWaitlist(true)
  }

  return (
    <section ref={sectionRef} className="py-24 md:py-32 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-sm tracking-[0.3em] text-[#800913] mb-4">
            SIGNATURE EXPERIENCES
          </p>
          <h2 className="font-serif text-3xl md:text-5xl text-[#1E1E1E]">
            Evenings Designed for Two
          </h2>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-[#1E1E1E]/10 mb-6" />
                <div className="h-6 bg-[#1E1E1E]/10 mb-2 w-3/4" />
                <div className="h-4 bg-[#1E1E1E]/10 w-1/2" />
              </div>
            ))}
          </div>
        ) : experiences.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8">
            {experiences.map((exp, index) => (
              <Link
                key={exp.id}
                href={`/experiences/${exp.id}`}
                className={`group transition-all duration-700 delay-${index * 150} ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-12"
                }`}
              >
                <div className="relative aspect-[3/4] mb-6 overflow-hidden">
                  <Image
                    src={exp.image || "/placeholder.svg"}
                    alt={exp.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <h3 className="font-serif text-2xl text-[#1E1E1E] mb-2 group-hover:text-[#800913] transition-colors">
                  {exp.title}
                </h3>
                <p className="text-[#1E1E1E]/60 text-sm">{exp.tagline}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-[#1E1E1E]/60 mb-6">
              Our experiences are coming soon.
            </p>
            <button
              onClick={() => handleWaitlistClick("Upcoming Experiences")}
              className="inline-flex items-center gap-2 text-[#800913] hover:text-[#800913]/80 transition-colors"
            >
              <Sparkles size={16} />
              Join the waitlist
            </button>
          </div>
        )}

        <div
          className={`text-center mt-12 transition-all duration-700 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Link
            href="/experiences"
            className="inline-flex items-center gap-2 text-[#1E1E1E] hover:text-[#800913] transition-colors text-sm tracking-wider"
          >
            VIEW ALL EXPERIENCES
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <WaitlistModal
        isOpen={showWaitlist}
        onClose={() => setShowWaitlist(false)}
        experienceName={selectedExperience}
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
      title: "Thoughtfully Curated",
      description:
        "Every element is selected to create a cohesive sensory journey",
    },
    {
      title: "Effortlessly Elegant",
      description:
        "Sophisticated experiences that feel natural, never forced",
    },
    {
      title: "Intimately Personal",
      description: "Designed for two, focused on connection and presence",
    },
  ]

  return (
    <section ref={sectionRef} className="py-24 md:py-32 px-6 bg-[#1E1E1E]">
      <div className="max-w-6xl mx-auto">
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-sm tracking-[0.3em] text-[#800913] mb-4">
            THE FOUGUE DIFFERENCE
          </p>
          <h2 className="font-serif text-3xl md:text-5xl text-white">
            Beyond the Ordinary
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`text-center transition-all duration-700 delay-${
                index * 150
              } ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <div className="w-px h-12 bg-[#800913] mx-auto mb-8" />
              <h3 className="font-serif text-xl text-white mb-4">
                {feature.title}
              </h3>
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
    <section ref={sectionRef} className="py-24 md:py-32 px-6 bg-[#FBF5EF]">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div
            className={`relative aspect-[4/5] transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-12"
            }`}
          >
            <Image
              src="/images/gift-door.jpg"
              alt="Luxury gift presentation"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className={`object-cover transition-all duration-1000 ${
                isVisible ? "scale-100" : "scale-105"
              }`}
            />
          </div>

          <div
            className={`transition-all duration-1000 delay-300 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-12"
            }`}
          >
            <p className="text-sm tracking-[0.3em] text-[#800913] mb-4">
              THOUGHTFUL GIFTS
            </p>
            <h2 className="font-serif text-3xl md:text-5xl text-[#1E1E1E] mb-6">
              For Moments That Matter
            </h2>
            <p className="text-[#1E1E1E]/70 mb-8 text-lg">
              Discover our collection of carefully selected gifts, each chosen
              to complement your romantic moments and create lasting memories.
            </p>
            <Link
              href="/gifts"
              className="inline-flex items-center gap-2 bg-[#1E1E1E] text-white px-8 py-4 text-sm tracking-wider hover:bg-[#1E1E1E]/90 transition-colors"
            >
              EXPLORE COLLECTION
              <ArrowRight size={16} />
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
    <section ref={sectionRef} className="relative py-32 md:py-48 px-6">
      <div className="absolute inset-0">
        <Image
          src="/images/couple-dancing.jpg"
          alt="Couple dancing in the street"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <blockquote
          className={`font-serif text-3xl md:text-5xl text-white italic leading-relaxed transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          &ldquo;The greatest thing you&apos;ll ever learn is just to love and be
          loved in return.&rdquo;
        </blockquote>
        <p
          className={`mt-8 text-white/80 tracking-wider transition-all duration-1000 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          — EDEN AHBEZ
        </p>
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
    <section ref={sectionRef} className="py-24 md:py-32 px-6 bg-white">
      <div
        className={`max-w-4xl mx-auto text-center transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <h2 className="font-serif text-3xl md:text-5xl text-[#1E1E1E] mb-6">
          Ready to Create Something Beautiful?
        </h2>
        <p className="text-lg text-[#1E1E1E]/70 mb-10 max-w-2xl mx-auto">
          Whether you&apos;re planning a special evening or searching for the
          perfect gift, we&apos;re here to help you celebrate love with intention.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/experiences"
            className="inline-flex items-center justify-center gap-2 bg-[#800913] text-white px-8 py-4 text-sm tracking-wider hover:bg-[#800913]/90 transition-colors"
          >
            EXPLORE EXPERIENCES
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 border border-[#1E1E1E] text-[#1E1E1E] px-8 py-4 text-sm tracking-wider hover:bg-[#1E1E1E] hover:text-white transition-colors"
          >
            GET IN TOUCH
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
    <section ref={sectionRef} className="py-24 md:py-32 px-6 bg-[#1E1E1E]">
      <div
        className={`max-w-xl mx-auto text-center transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <p className="text-sm tracking-[0.3em] text-[#800913] mb-4">
          STAY INSPIRED
        </p>
        <h2 className="font-serif text-3xl md:text-4xl text-white mb-6">
          Join Our Circle
        </h2>
        <p className="text-white/70 mb-8">
          Receive curated inspiration, early access to new experiences, and
          exclusive offers designed for lovers of intentional romance.
        </p>
        <NewsletterForm variant="dark" />
      </div>
    </section>
  )
}
