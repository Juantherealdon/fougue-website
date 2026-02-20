"use client"

import React from "react"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function TermsPage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <main className="min-h-screen bg-[#FBF5EF]">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center bg-[#1E1E1E]">
        <div className="absolute inset-0 bg-[url('/images/letter-seal.jpg')] bg-cover bg-center opacity-30" />
        <div className="relative z-10 text-center px-6">
          <h1
            className={`text-5xl md:text-6xl lg:text-7xl text-white font-light tracking-wide transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Terms & Conditions
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 lg:py-32">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-[#1E1E1E]/70 leading-relaxed mb-12">
              Be sure to read the Terms of Use below, as they cover the terms and conditions that apply to all bookings made with Fougue.
            </p>

            <Section title="1. Introduction">
              <p>
                These Terms & Conditions ("Terms") govern the use of the Fougue. website and the booking or purchase of any Fougue. experience, gift card, or digital product.
              </p>
              <p>
                By accessing our website or completing a booking or purchase, you confirm that you have read, understood, and agreed to be bound by these Terms.
              </p>
              <p>Fougue. operates in the United Arab Emirates.</p>
            </Section>

            <Section title="2. Services">
              <p>
                Fougue. offers curated romantic experiences, partner experiences, bespoke services, fixed-price gifts, and digital products.
              </p>
              <p>
                All services are subject to availability and may be modified, replaced, or withdrawn at any time.
              </p>
              <p>
                Experience descriptions, visuals, and themes are indicative and may vary due to availability, venue constraints, weather conditions, or partner requirements, while preserving the overall spirit and value of the experience.
              </p>
            </Section>

            <Section title="3. Booking & Payment">
              <ul className="list-disc pl-6 space-y-3">
                <li>All Fougue. experiences are confirmed <strong>only upon receipt of payment</strong>. Fougue. experiences are curated, date-specific, and involve the reservation of venues, partners, and services. As such, payment is required to secure the booking.</li>
                <li>In most cases, <strong>full payment is required at the time of booking</strong>. For experiences involving a broader scope or multiple elements, Fougue. may, at its discretion, accept a <strong>partial non-refundable payment to secure the date</strong>, with the remaining balance due prior to the experience.</li>
                <li>The applicable payment structure will be communicated clearly at the time of booking.</li>
                <li>Optional add-ons must be confirmed and paid for prior to the experience date and are subject to availability.</li>
                <li>Fougue. reserves the right to cancel or suspend a booking if payment is not completed within the required timeframe.</li>
                <li>All payments are processed in AED via secure third-party payment providers.</li>
              </ul>
            </Section>

            <Section title="4. Pricing">
              <p>All prices are displayed in AED unless stated otherwise.</p>
              <p>
                The price of a Fougue. experience may vary depending on the scope of the experience, selected add-ons, and availability. Any applicable price will be confirmed at the time of booking.
              </p>
              <p>Fougue. gifts are sold at fixed prices. Digital products are delivered immediately upon purchase.</p>
            </Section>

            <Section title="5. Cancellation, Refunds & Rescheduling">
              <ul className="list-disc pl-6 space-y-3">
                <li>Due to the curated, time-specific, and limited nature of Fougue. experiences, <strong>all payments are non-refundable</strong> once a booking is confirmed.</li>
                <li>One reschedule request may be accepted if made at least <strong>72 hours prior</strong> to the scheduled experience, subject to availability.</li>
                <li>No refunds or reschedules will be granted for late arrivals, no-shows, or last-minute cancellations.</li>
                <li>Gift cards and digital products are non-refundable.</li>
              </ul>
            </Section>

            <Section title="6. Late Arrival & No-Show">
              <p>Late arrival may result in a shortened experience without refund.</p>
              <p>Failure to attend an experience without notice will result in full forfeiture of the booking or reschedule.</p>
            </Section>

            <Section title="7. Disclaimer & Third-Party Services">
              <p>
                Fougue. curates and coordinates romantic experiences in collaboration with carefully selected third-party partners, including venues, artists, chefs, photographers, and service providers.
              </p>
              <p>
                While Fougue. takes care in selecting trusted partners and designing each experience, Fougue. does not directly operate or control the services provided by third parties.
              </p>
              <p>
                By participating in a Fougue. experience, you acknowledge and agree that certain elements of the experience are delivered by independent service providers, who remain responsible for their own operations, safety measures, and conduct.
              </p>
              <p>
                Fougue. shall not be held liable for any loss, damage, injury, or incident arising from the actions or omissions of third-party service providers, <strong>except where liability cannot be excluded under applicable UAE law</strong>.
              </p>
              <p>
                Clients are responsible for assessing their own suitability for participation in any experience and are encouraged to hold appropriate personal insurance where relevant.
              </p>
            </Section>

            <Section title="8. Force Majeure">
              <p>
                Fougue. shall not be liable for delays, modifications, or cancellations caused by events beyond reasonable control, including but not limited to weather conditions, government restrictions, supplier unavailability, or force majeure events. In such cases, Fougue. may offer rescheduling at its discretion.
              </p>
            </Section>

            <Section title="9. Health, Safety & Conduct">
              <p>
                Clients agree to follow all reasonable safety instructions provided by Fougue. and its partners. Fougue. reserves the right to terminate an experience without refund if a client behaves in a dangerous, disruptive, or inappropriate manner.
              </p>
            </Section>

            <Section title="10. Limitation of Liability">
              <p>
                To the fullest extent permitted by UAE law, Fougue. shall not be liable for indirect, incidental, special, or consequential damages arising from the use of its services.
              </p>
              <p>
                If liability is found to exist, Fougue.'s total liability shall be limited to the amount paid by the client for the relevant service.
              </p>
              <p>Nothing in these Terms excludes liability that cannot be limited or excluded under applicable law.</p>
            </Section>

            <Section title="11. Intellectual Property">
              <p>
                All content on the Fougue. website, including text, visuals, branding, concepts, and materials, is the exclusive property of Fougue. and may not be copied, reproduced, or used without prior written consent.
              </p>
            </Section>

            <Section title="12. Privacy">
              <p>
                Personal data is handled in accordance with applicable UAE data protection regulations. Information provided during booking is used solely for the purpose of delivering Fougue. services.
              </p>
            </Section>

            <Section title="13. No Use by Minors">
              <p>
                Fougue. services are intended for individuals aged <strong>18 years or older</strong>. By using the website or making a booking, you confirm that you meet this requirement.
              </p>
            </Section>

            <Section title="14. Amendments to Terms">
              <p>
                Fougue. reserves the right to amend these Terms at any time by posting the updated version on the website. Continued use of the website or services after changes are published constitutes acceptance of the revised Terms.
              </p>
            </Section>

            <Section title="15. Governing Law">
              <p>
                These Terms are governed by and construed in accordance with the laws of the United Arab Emirates. Any disputes shall be subject to the exclusive jurisdiction of the courts of the UAE.
              </p>
            </Section>

            <Section title="16. Severability">
              <p>
                If any provision of these Terms is held to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.
              </p>
            </Section>

            <Section title="17. Acceptance">
              <p>
                By accessing the Fougue. website or completing a booking or purchase, you acknowledge that you have read, understood, and agreed to be bound by these Terms & Conditions.
              </p>
            </Section>

            <Section title="18. Contact Us">
              <p>
                If you have any questions about these Terms & Conditions, you may contact us at:{" "}
                <a href="mailto:love@fougue.ae" className="text-[#800913] hover:underline">
                  love@fougue.ae
                </a>
              </p>
            </Section>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-12">
      <h2 className="text-2xl md:text-3xl font-light text-[#1E1E1E] mb-6">{title}</h2>
      <div className="text-[#1E1E1E]/70 leading-relaxed space-y-4">{children}</div>
    </div>
  )
}
