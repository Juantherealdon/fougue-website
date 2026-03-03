"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ArrowRight, ChevronDown } from "lucide-react"

function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#FBF5EF] flex flex-col items-center justify-center">
      {/* Background Image with overlays */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/couple-dancing.jpg"
          alt="Couple dancing in the night"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        {/* Seamless fade to cream at bottom */}
        <div
          className="absolute bottom-0 left-0 w-full h-50"
          style={{
            background: 'linear-gradient(to top, rgba(251, 245, 239, 1) 0%, rgba(251, 245, 239, 0.95) 15%, rgba(251, 245, 239, 0.8) 30%, rgba(251, 245, 239, 0.5) 60%, rgba(251, 245, 239, 0) 100%)'
          }}
        />
      </div>

      {/* Content */}
      <div
        className={`relative z-10 text-center flex flex-col items-center px-6 transition-all duration-[3000ms] ease-in-out ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
      >
        <p className="text-white/80 text-sm tracking-[0.4em] uppercase mb-6">
          The Brand
        </p>

        <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-light leading-none drop-shadow-md mb-4">
          A Maison devoted to<br />
          <span className="italic text-[#800913]">modern romance.</span>
        </h1>

        {/* Dictionary definition */}
        <div className="flex flex-col items-center px-4 mt-2">
          <p className="text-white text-xs tracking-[0.2em] uppercase mb-2">
            [foog] : noun - French
          </p>
          <p className="text-white text-lg md:text-xl italic font-light">
            A feeling of strong passion, enthusiasm, ardour.
          </p>
        </div>
      </div>

      {/* Scroll arrow */}
      <button
        onClick={() => {
          document.getElementById('philosophy-section')?.scrollIntoView({ behavior: 'smooth' })
        }}
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-10 transition-all duration-700 delay-500 ${isLoaded ? "opacity-100" : "opacity-0"
          }`}
        aria-label="Scroll to next section"
      >
        <ChevronDown className="text-white/60 animate-bounce" size={32} />
      </button>
    </section>
  )
}

function PhilosophySection() {
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
    <section id="philosophy-section" ref={sectionRef} className="pt-8 pb-32 md:pb-40 px-6 flex flex-col items-center text-center bg-[#FBF5EF] relative z-10">
      {/* Vertical line with drop animation */}
      <div
        className={`w-px bg-[#1E1E1E]/20 mb-16 transition-all duration-[2000ms] ease-out ${isVisible ? "h-20 opacity-100" : "h-0 opacity-0"
          }`}
      />

      <p
        className={`text-[#800913] text-sm tracking-[0.4em] uppercase mb-10 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
      >
        Our Philosophy
      </p>

      <h2
        className={`text-[#1E1E1E] text-2xl md:text-3xl lg:text-4xl font-light leading-snug max-w-3xl mb-12 transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
      >
        In a city of endless options, romance can feel polished, yet impersonal. <br />
        <span className="italic text-[#800913]">Fougue is our quiet antidote.</span>
      </h2>

      <p
        className={`text-[#1E1E1E]/70 text-lg leading-relaxed max-w-2xl transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
      >
        We believe romance lives in the feeling — in presence rather than performance. We compose immersive experiences, thoughtfully curated and shaped as stories. Each Fougue Moment is intimate, personal by design, where moments become memories.
      </p>
    </section>
  )
}

function DNASection() {
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

  const values = [
    {
      title: "Emotion",
      description: "Moments designed to move the heart and linger in memory.",
    },
    {
      title: "Connection",
      description: "Designed for presence, closeness, and shared meaning.",
    },
    {
      title: "Thoughtful Craft",
      description: "Inspired by culture. Shaped by story. Refined in every detail.",
    },
    {
      title: "Bold Romance",
      description: "Romance, reimagined with curiosity and creative intention.",
    },
  ]

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-[#1E1E1E]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <p
            className={`text-[#800913] text-sm tracking-[0.3em] uppercase mb-4 transition-all duration-700 ${isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
              }`}
          >
            What defines us
          </p>
          <h2
            className={`text-white text-4xl md:text-5xl font-light mb-8 transition-all duration-700 delay-100 ${isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
              }`}
          >
            Our{" "}
            <span className="italic text-[#800913]">DNA</span>
          </h2>

          {/* Definition */}
          <div
            className={`bg-white/5 px-8 py-6 inline-block transition-all duration-700 delay-200 ${isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
              }`}
          >
            <p className="text-white/40 text-sm tracking-wide mb-2">
              [foog]: noun - French
            </p>
            <p className="text-white text-lg italic">
              A feeling of strong passion, enthusiasm, ardour.
            </p>
          </div>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {values.map((value, index) => (
            <div
              key={value.title}
              className={`text-center p-8 border border-white/10 hover:border-[#800913]/30 transition-all duration-500 ${isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
                }`}
              style={{ transitionDelay: `${300 + index * 100}ms` }}
            >
              <h3 className="text-white text-xl font-light mb-3">
                {value.title}
              </h3>
              <p className="text-white/50 text-sm italic">{value.description}</p>
            </div>
          ))}
        </div>

        {/* Vision & Mission */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div
            className={`transition-all duration-700 delay-500 ${isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
              }`}
          >
            <h3 className="text-[#800913] text-sm tracking-[0.2em] uppercase mb-4">
              Vision
            </h3>
            <p className="text-white/70 text-lg leading-relaxed">
              To become the region&apos;s reference for curated, story-driven romantic experiences.
            </p>
          </div>

          <div
            className={`transition-all duration-700 delay-600 ${isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
              }`}
          >
            <h3 className="text-[#800913] text-sm tracking-[0.2em] uppercase mb-4">
              Mission
            </h3>
            <p className="text-white/70 text-lg leading-relaxed">
              To redefine modern romance in Dubai — crafting immersive, intentional experiences that bring couples closer together.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function FounderSection() {
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
    <section ref={sectionRef} className="py-24 lg:py-32 bg-[#FBF5EF]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div
            className={`relative transition-all duration-1000 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
              }`}
          >
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src="/images/manon-founder.jpg"
                alt="Manon Gaillard - Founder of Fougue"
                fill
                className="object-cover grayscale"
              />
            </div>
            {/* Decorative frame */}
            <div className="absolute -bottom-6 -right-6 w-full h-full border border-[#800913]/20 -z-10" />
          </div>

          {/* Content */}
          <div className="lg:pl-8">
            <p
              className={`text-[#800913] text-sm tracking-[0.3em] uppercase mb-4 transition-all duration-700 ${isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
                }`}
            >
              Meet the Founder
            </p>

            <h2
              className={`text-[#1E1E1E] text-4xl md:text-5xl font-light italic mb-8 transition-all duration-700 delay-100 ${isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
                }`}
            >
              Bonjour!
            </h2>

            <div
              className={`space-y-6 text-[#1E1E1E]/70 text-lg leading-relaxed text-justify transition-all duration-700 delay-200 ${isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
                }`}
            >
              <p>
                I&apos;m Manon, a Parisian romantic at heart drawn to stories,
                beauty, and the quiet power of thoughtful details. To me,
                romance is about leaving a trace, surprising with care, and
                creating moments that genuinely resonate.
              </p>
              <p>
                After years in Dubai designing events and brand experiences for
                luxury houses and international companies, I learned how to
                shape moments with precision and meaning. Over time, I felt the
                growing desire to bring that approach into something more
                personal.
              </p>
              <p>
                I realised the city didn&apos;t lack places or options, but moments for two that felt intimate and authentic.
              </p>
              <p className="text-[#1E1E1E] italic">
                Fougue. was born from that conviction, to create a more
                intentional way of experiencing romance.
              </p>
            </div>

            <div
              className={`mt-10 pt-8 border-t border-[#1E1E1E]/10 transition-all duration-700 delay-300 ${isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
                }`}
            >
              <p className="text-[#1E1E1E] text-xl font-light">Manon Gaillard</p>
              <p className="text-[#800913] text-sm tracking-wide italic">
                Founder & Creative Director
              </p>
            </div>
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
    <section
      ref={sectionRef}
      className="relative py-32 lg:py-48 overflow-hidden"
    >
      <div className="absolute inset-0">
        <Image
          src="/images/letter-seal.jpg"
          alt="Fougue wax seal"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <blockquote
          className={`text-white text-3xl md:text-4xl lg:text-5xl font-light italic leading-relaxed transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
        >
          &ldquo;Romance lives in the feeling. In presence rather than
          performance.&rdquo;
        </blockquote>
        <div
          className={`mt-8 w-16 h-px bg-[#800913] mx-auto transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-0"
            }`}
        />
        <p
          className={`text-white/50 text-sm tracking-[0.2em] uppercase mt-6 transition-all duration-700 delay-500 ${isVisible ? "opacity-100" : "opacity-0"
            }`}
        >
          Our Belief
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
    <section ref={sectionRef} className="py-24 lg:py-32 bg-[#FBF5EF]">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <p
          className={`text-[#800913] text-sm tracking-[0.3em] uppercase mb-4 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          Start Your Journey
        </p>
        <h2
          className={`text-[#1E1E1E] text-4xl md:text-5xl font-light mb-6 transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
        >
          Welcome to{" "}
          <span className="italic text-[#800913]">Fougue.</span>
        </h2>
        <p
          className={`text-[#1E1E1E]/70 text-lg mb-10 transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
        >
          Discover our curated experiences and let us craft your next love
          story.
        </p>
        <div
          className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
        >
          <Link
            href="/experiences"
            className="group inline-flex items-center justify-center gap-3 bg-[#800913] text-white px-8 py-4 text-sm tracking-[0.2em] uppercase hover:bg-[#600910] transition-all duration-300"
          >
            Explore Experiences
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-3 border border-[#1E1E1E]/30 text-[#1E1E1E] px-8 py-4 text-sm tracking-[0.2em] uppercase hover:bg-[#1E1E1E]/5 transition-all duration-300"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  )
}

export default function AboutPage() {
  return (
    <main>
      <Navigation />
      <HeroSection />
      <PhilosophySection />
      <DNASection />
      <FounderSection />
      <QuoteSection />
      <CTASection />
      <Footer />
    </main>
  )
}
