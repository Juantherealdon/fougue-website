"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ArrowRight, ChevronDown, Sparkles } from "lucide-react"
import { NewsletterForm } from "@/components/newsletter-form"
import { WaitlistModal } from "@/components/waitlist-modal"
import { useInView } from "@/hooks/use-in-view"

type ExperienceStatus = 'available' | 'almost_available' | 'coming_soon' | 'unavailable'

interface Experience {
  id: string
  title: string
  subtitle: string
  slug?: string
  description: string
  image: string
  price: number
  duration_hours: number
  guests: string
  highlight: string
  available: boolean
  status: ExperienceStatus
}

function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <section className="relative h-screen w-full overflow-hidden">
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

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center pt-24">
        <div
          className={`transition-all duration-1000 delay-300 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-white/80 text-sm tracking-[0.4em] uppercase mb-6">
            IMMERSIVE ROMANTIC EXPERIENCES IN DUBAI
          </p>
        </div>

        <h1
          className={`text-white text-5xl md:text-7xl lg:text-8xl font-semibold leading-[0.95] mb-6 transition-all duration-1000 delay-500 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="block text-balance">
            The Art of <span className="text-[#800913]">Romance</span>
          </span>
        </h1>

        <p
          className={`text-white/70 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed transition-all duration-1000 delay-700 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Private, story-driven moments, designed for couples.
        </p>

        <div
          className={`flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-900 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Link
            href="/experiences"
            className="group inline-flex items-center gap-3 bg-[#800913] text-white px-8 py-4 text-sm tracking-[0.2em] uppercase hover:bg-[#600910] transition-all duration-300"
          >
            Discover Experiences
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
          <Link
            href="/gifts"
            className="inline-flex items-center gap-3 border border-white/30 text-white px-8 py-4 text-sm tracking-[0.2em] uppercase hover:bg-white/10 transition-all duration-300"
          >
            Gifts Collection
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <ChevronDown className="text-white/60 animate-bounce" size={32} />
      </div>
    </section>
  )
}

function IntroSection() {
  const { ref: sectionRef, isVisible } = useInView(0.2)

  return (
    <section
      ref={sectionRef}
      className="py-20 lg:py-28 px-6 bg-[#FBF5EF]"
    >
      <div className="mx-auto max-w-2xl text-center">
        {/* Logo */}
        <div
          className={`mb-8 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="font-serif text-[#800913] text-2xl md:text-3xl italic">Fougue.</span>
        </div>

        {/* L'Ancrage - Title */}
        <h2
          className={`font-serif text-[#1E1E1E] text-4xl md:text-5xl font-normal leading-tight mb-10 transition-all duration-1000 delay-100 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Love deserves intention.
        </h2>

        {/* Le Corps du texte - Narrative */}
        <div
          className={`text-[#1E1E1E]/70 text-lg leading-relaxed mb-10 space-y-6 transition-all duration-1000 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p>
            In a city of endless options, romance can feel polished yet impersonal. Fougue re-enchants the way couples spend time together by designing fully curated, private experiences built around your story.
          </p>
          <p>
            Each experience unfolds as a world you step into: crafted in detail, orchestrated seamlessly, and designed for two.
          </p>
        </div>

        {/* Horizontal line */}
        <div
          className={`flex justify-center mb-8 transition-all duration-1000 delay-300 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <span className="w-16 h-px bg-[#1E1E1E]/30" />
        </div>

        {/* La Rupture - Point d'Orgue with quotes */}
        <p
          className={`text-[#1E1E1E] text-xl md:text-2xl italic leading-relaxed mb-8 transition-all duration-1000 delay-400 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="text-[#800913]">{'"'}</span>This is not a reservation.<br />
          It is a moment written for you.<span className="text-[#800913]">{'"'}</span>
        </p>

        {/* Horizontal line */}
        <div
          className={`flex justify-center mb-8 transition-all duration-1000 delay-500 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <span className="w-16 h-px bg-[#1E1E1E]/30" />
        </div>

        {/* Le Rythme de fin - Signature */}
        <p
          className={`text-stone-400 text-[11px] uppercase tracking-[0.2em] transition-all duration-1000 delay-600 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Crafted with intention. Composed with precision. Shaped by emotion.
        </p>
      </div>
    </section>
  )
}

function ExperiencesPreview() {
  const { ref: sectionRef, isVisible } = useInView(0.1)
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showWaitlist, setShowWaitlist] = useState(false)
  const [selectedExperience, setSelectedExperience] = useState<string | undefined>()

  useEffect(() => {
    async function fetchExperiences() {
      try {
        const response = await fetch('/api/experiences')
        
        if (!response.ok) {
          return
        }

        const data = await response.json()
        
        const filteredExperiences = data
          .filter((exp: Experience) => exp.status === 'available' || exp.status === 'almost_available')
          .slice(0, 3)
          .map((exp: Experience) => ({
            ...exp,
            status: exp.status || (exp.available ? 'available' : 'coming_soon'),
          }))
        
        setExperiences(filteredExperiences)
      } catch {
        // silent
      } finally {
        setIsLoading(false)
      }
    }

    fetchExperiences()
  }, [])

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-[#1E1E1E]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16">
          <div>
            <p
              className={`text-[#800913] text-sm tracking-[0.3em] uppercase mb-4 transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              Signature Experiences
            </p>
            <h2
              className={`text-white text-4xl md:text-5xl font-light transition-all duration-700 delay-100 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              Stories You Can
              <span className="italic text-[#800913]"> Step Into</span>
            </h2>
          </div>
          <Link
            href="/experiences"
            className={`group inline-flex items-center gap-2 text-white/60 hover:text-white mt-6 lg:mt-0 text-sm tracking-[0.2em] uppercase transition-all duration-700 delay-200 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            View All Experiences
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>

        <div className={`grid grid-cols-1 gap-6 lg:gap-8 ${
          isLoading ? "md:grid-cols-3" :
          experiences.length === 1 ? "md:grid-cols-1" :
          experiences.length === 2 ? "md:grid-cols-2" :
          "md:grid-cols-3"
        }`}>
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="relative overflow-hidden aspect-[3/4] bg-[#2A2A2A] animate-pulse"
              />
            ))
          ) : (
            experiences.map((exp, index) => {
              const isAlmostAvailable = exp.status === 'almost_available'
              const count = experiences.length
              const aspectClass = count === 1 ? "aspect-[16/7]" : count === 2 ? "aspect-[4/5]" : "aspect-[3/4]"
              
              const titleSize = count === 1 ? "text-3xl md:text-4xl lg:text-5xl" : count === 2 ? "text-2xl md:text-3xl lg:text-4xl" : "text-2xl lg:text-3xl"
              const descSize = count === 1 ? "text-base md:text-lg max-w-2xl" : count === 2 ? "text-sm md:text-base max-w-md" : "text-sm"
              const padClass = count === 1 ? "p-8 lg:p-12" : "p-6 lg:p-8"
              
              const cardContent = (
                <>
                  <Image
                    src={exp.image || "/placeholder.svg"}
                    alt={exp.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
                  {isAlmostAvailable && (
                    <div className="absolute top-4 right-4 bg-[#1E1E1E]/90 text-white text-xs tracking-[0.15em] uppercase px-3 py-1.5 backdrop-blur-sm border border-white/10">
                      Coming Soon
                    </div>
                  )}
                  <div className={`absolute bottom-0 left-0 right-0 ${padClass}`}>
                    <p className="text-[#800913] text-xs tracking-[0.3em] uppercase mb-3 font-medium">
                      {exp.subtitle}
                    </p>
                    <h3 className={`text-white ${titleSize} font-light mb-3 leading-tight`}>
                      {exp.title}
                    </h3>
                    <div className="w-10 h-px bg-[#800913] mb-4 transition-all duration-500 group-hover:w-16" />
                    <p className={`text-white/70 ${descSize} leading-relaxed`}>
                      {exp.description}
                    </p>
                  </div>
                </>
              )
              
              if (isAlmostAvailable) {
                return (
                  <button
                    key={exp.id}
                    onClick={() => {
                      setSelectedExperience(exp.title)
                      setShowWaitlist(true)
                    }}
                    className={`group relative overflow-hidden ${aspectClass} transition-all duration-700 text-left ${
                      isVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-16"
                    }`}
                    style={{ transitionDelay: `${300 + index * 150}ms` }}
                  >
                    {cardContent}
                  </button>
                )
              }
              
              return (
                <Link
                  key={exp.id}
                  href={`/experiences/${exp.id}`}
                  className={`group relative overflow-hidden ${aspectClass} transition-all duration-700 ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-16"
                  }`}
                  style={{ transitionDelay: `${300 + index * 150}ms` }}
                >
                  {cardContent}
                </Link>
              )
            })
          )}
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
  const { ref: sectionRef, isVisible } = useInView(0.15)

  const pillars = [
    {
      title: "Personalised to your story",
      description: "We compose experiences shaped around your story, love language, and memories.",
    },
    {
      title: "Narrative by Design",
      description:
        "From the first invitation to the final note, every detail unfolds with intention and emotional coherence.",
    },
    {
      title: "True immersion",
      description:
        "Beyond aesthetics, we layer culture, sensory cues and thoughtful prompts to create atmosphere with meaning, and spark genuine connection.",
    },
    {
      title: "Effortless booking",
      description:
        "Transparent pricing, seamless reservation process and refined coordination - simplicity without compromise.",
    },
  ]

  return (
    <section
      ref={sectionRef}
      className="py-28 lg:py-36 bg-white relative"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-20">
          <h2
            className={`text-[#1E1E1E] text-4xl md:text-5xl lg:text-6xl font-light transition-all duration-700 delay-150 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            The <span className="italic font-serif text-[#800913]">Fougue.</span> Difference
          </h2>
          <div
            className={`mt-6 w-12 h-px bg-[#800913] mx-auto transition-all duration-700 delay-300 ${
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-0"
            }`}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {pillars.map((pillar, index) => (
            <div
              key={pillar.title}
              className={`relative text-center px-4 transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${400 + index * 150}ms` }}
            >
              <Sparkles size={16} className="text-[#800913] mx-auto mb-6" />
              <h3 className="text-[#1E1E1E] text-lg font-medium leading-snug mb-3 text-balance">
                {pillar.title}
              </h3>
              <p className="text-[#1E1E1E]/55 text-sm leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#800913]/20 to-transparent" />
    </section>
  )
}

function GiftsSection() {
  const { ref: sectionRef, isVisible } = useInView(0.2)

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-0 lg:h-screen">
      <div className="lg:grid lg:grid-cols-2 lg:h-full">
        <div className="relative h-[50vh] lg:h-full">
          <Image
            src="/images/gift-door.jpg"
            alt="Luxury gift presentation"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className={`object-cover transition-all duration-1000 ${
              isVisible ? "scale-100 opacity-100" : "scale-105 opacity-0"
            }`}
          />
        </div>

        <div className="flex items-center bg-[#FBF5EF] px-6 lg:px-16 py-16 lg:py-0">
          <div className="max-w-lg">
            <p
              className={`text-[#800913] text-sm tracking-[0.3em] uppercase mb-4 transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              Gifts Collection
            </p>
            <h2
              className={`text-[#1E1E1E] text-4xl md:text-5xl font-light mb-6 transition-all duration-700 delay-100 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              Love, Made
              <span className="italic text-[#800913]"> Tangible</span>
            </h2>
            <p
              className={`text-[#1E1E1E]/70 text-lg leading-relaxed mb-8 transition-all duration-700 delay-200 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              A curated selection of meaningful and symbolic pieces journals, designed to deepen connection, mark a moment, or carry the memory long after it unfolds.
            </p>
            <Link
              href="/gifts"
              className={`group inline-flex items-center gap-3 bg-[#800913] text-white px-8 py-4 text-sm tracking-[0.2em] uppercase hover:bg-[#600910] transition-all duration-700 delay-300 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              Explore the Collection
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function QuoteSection() {
  const { ref: sectionRef, isVisible } = useInView(0.3)

  return (
    <section
      ref={sectionRef}
      className="relative py-32 lg:py-48 overflow-hidden"
    >
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

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <blockquote
          className={`text-white text-3xl md:text-4xl lg:text-5xl font-light italic leading-relaxed transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          Every Fougue. Moment is<br />
          a story you can step into
        </blockquote>
        <div
          className={`mt-8 w-16 h-px bg-[#800913] mx-auto transition-all duration-1000 delay-300 ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-0"
          }`}
        />
      </div>
    </section>
  )
}

function CTASection() {
  const { ref: sectionRef, isVisible } = useInView(0.3)

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-[#FBF5EF]">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2
          className={`text-[#1E1E1E] text-4xl md:text-5xl font-light mb-6 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          Your <span className="italic text-[#800913]">Chapter</span> Awaits.
        </h2>
        <p
          className={`text-[#1E1E1E]/70 text-lg mb-10 transition-all duration-700 delay-100 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          {"We'll take care of every detail."}
        </p>
        <div
          className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <Link
            href="/contact"
            className="group inline-flex items-center gap-3 bg-[#800913] text-white px-8 py-4 text-sm tracking-[0.2em] uppercase hover:bg-[#600910] transition-all duration-300"
          >
            Get in Touch
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
          <Link
            href="/experiences"
            className="inline-flex items-center gap-3 border border-[#1E1E1E]/20 text-[#1E1E1E] px-8 py-4 text-sm tracking-[0.2em] uppercase hover:bg-[#1E1E1E]/5 transition-all duration-300"
          >
            Explore Experiences
          </Link>
        </div>
      </div>
    </section>
  )
}

function NewsletterSection() {
  const { ref: sectionRef, isVisible } = useInView(0.3)

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-[#1E1E1E]">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <h2
          className={`text-white text-3xl md:text-4xl font-light mb-4 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          Stay Inspired
        </h2>
        <p
          className={`text-white/60 mb-8 transition-all duration-700 delay-100 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          Receive curated stories, exclusive previews, and inspiration for your next chapter.
        </p>
        <div
          className={`transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <NewsletterForm variant="dark" />
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <main className="bg-white">
      <Navigation />
      <HeroSection />
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
