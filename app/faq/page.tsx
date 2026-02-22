"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "What does Fougue. offer?",
    answer: `Fougue. creates curated romantic experiences designed as stories to live.

Each experience brings together a setting, a narrative, and carefully selected partners — venues, artists, and thoughtful details — to turn time together into a lasting memory.

This is not event planning. It's emotional design.`
  },
  {
    question: "How do I get started?",
    answer: `Choose the experience that resonates with you and select your preferred date.

Once your booking is confirmed, we get in touch — coordination, timing, and details — so you can simply show up and enjoy the moment. We'll walk you through the next steps and answer any questions along the way.`
  },
  {
    question: "What makes Fougue. different?",
    answer: `Fougue. doesn't sell activities. We create unique, immersive, story-driven moments with intention.

Every experience is:
• Thoughtfully curated, not mass-produced
• Limited in availability
• Designed to feel effortless for you
• Built around emotion, presence, storytelling, and meaning

You don't manage logistics. You live the story. It's not just what we do — it's how we do it that sets us apart.`
  },
  {
    question: "Is Fougue. suitable for proposals or special occasions?",
    answer: `Yes, absolutely. Fougue. experiences may be adapted for proposals, anniversaries, or milestones — all designed to elevate everyday moments. Specific requests can be discussed at the time of booking.`
  },
  {
    question: "How does booking a Fougue. Experience work?",
    answer: `Each Fougue. experience is offered in limited availability.

Once you select an experience and your preferred date, payment confirms the booking and secures all partners involved. You'll then receive a confirmation with the next steps and any practical details.`
  },
  {
    question: "When is the payment required?",
    answer: `Payment is required to confirm your booking.

In most cases, full payment is requested at booking. For experiences involving a broader scope or multiple elements, a partial payment may be accepted to secure the date, with the balance due prior to the experience.

This allows us to reserve venues, artists, and suppliers with care and precision.`
  },
  {
    question: "Are Fougue. experiences refundable?",
    answer: `No. Due to the curated, date-specific, and limited nature of Fougue. experiences, all payments are non-refundable once a booking is confirmed.`
  },
  {
    question: "Can I reschedule my experience?",
    answer: `One reschedule request may be accepted if made at least a week prior to the scheduled experience, subject to availability.

Rescheduling is not available for last-minute cancellations or no-shows.`
  },
  {
    question: "How can I contact you?",
    answer: `You can reach us anytime via our contact page, email hello@fougue.ae, via WhatsApp +971 52 315 7273 or via Instagram @lovewithfougue.

We will respond as soon as possible to assist you.`
  }
]

export default function FAQPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <main className="min-h-screen bg-[#FBF5EF]">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center bg-[#1E1E1E]">
        <div className="absolute inset-0 bg-[url('/images/surprise-hands.jpg')] bg-cover bg-center opacity-30" />
        <div className="relative z-10 text-center px-6">
          <p
            className={`text-sm tracking-[0.3em] uppercase text-white/60 mb-4 transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Help Center
          </p>
          <h1
            className={`text-5xl md:text-6xl lg:text-7xl text-white font-light tracking-wide transition-all duration-1000 delay-100 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Your Questions, Answered
          </h1>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20 lg:py-32">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                delay={index * 50}
                isVisible={isVisible}
              />
            ))}
          </div>

          {/* Contact CTA */}
          <div
            className={`mt-20 text-center transition-all duration-1000 delay-500 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <p className="text-[#1E1E1E]/60 text-lg mb-6">
              Still have questions? We'd love to hear from you.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-3 bg-[#800913] text-white px-8 py-4 text-sm tracking-[0.2em] uppercase hover:bg-[#600910] transition-colors duration-300"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

function FAQItem({
  question,
  answer,
  isOpen,
  onClick,
  delay,
  isVisible
}: {
  question: string
  answer: string
  isOpen: boolean
  onClick: () => void
  delay: number
  isVisible: boolean
}) {
  return (
    <div
      className={`border border-[#1E1E1E]/10 bg-white transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <button
        onClick={onClick}
        className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-[#FBF5EF]/50 transition-colors duration-300"
      >
        <span className="text-xl md:text-2xl font-light text-[#1E1E1E] pr-8">
          {question}
        </span>
        <ChevronDown
          size={24}
          className={`text-[#800913] flex-shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-500 ${
          isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-8 pb-8">
          <div className="pt-4 border-t border-[#1E1E1E]/10">
            <p className="text-[#1E1E1E]/70 text-lg leading-relaxed whitespace-pre-line">
              {answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
