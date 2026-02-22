"use client"

import React from "react"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 lg:py-32">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-[#1E1E1E]/70 leading-relaxed mb-12">
              Fougue. ("we", "us", or "our") respects your privacy and is committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, store, and protect your information when you visit our website or book a Fougue. experience.
            </p>
            <p className="text-[#1E1E1E]/60 mb-12">
              By using our website or services, you agree to the practices described in this Privacy Policy.
            </p>

            <Section title="1. Information We Collect">
              <p>We collect only the information necessary to provide and improve our services.</p>
              
              <h3 className="text-xl font-medium text-[#1E1E1E] mt-6 mb-3">a. Personal Information</h3>
              <p>When you interact with Fougue., we may collect:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>First and last name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Information shared during booking or enquiries (such as preferred date, experience details, or special requests)</li>
              </ul>

              <h3 className="text-xl font-medium text-[#1E1E1E] mt-6 mb-3">b. Usage & Technical Information</h3>
              <p>When you visit our website, we may automatically collect:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>IP address</li>
                <li>Browser type and device information</li>
                <li>Pages visited and time spent on the site</li>
              </ul>
              <p className="mt-3">This data helps us understand how our website is used and improve the experience.</p>

              <h3 className="text-xl font-medium text-[#1E1E1E] mt-6 mb-3">c. Cookies</h3>
              <p>
                We use cookies and similar technologies to ensure proper website functionality and basic analytics. You may disable cookies in your browser settings, though some features of the site may not function properly.
              </p>
            </Section>

            <Section title="2. How We Use Your Information">
              <p>We use your information to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Process and manage bookings</li>
                <li>Communicate with you regarding your experience</li>
                <li>Respond to enquiries and provide customer support</li>
                <li>Send relevant updates or information related to Fougue.</li>
                <li>Improve our website and services</li>
              </ul>
              <p className="mt-4">
                We do not collect more data than necessary, and we do not use your information for purposes unrelated to Fougue.
              </p>
            </Section>

            <Section title="3. Marketing Communications">
              <p>
                With your consent, we may contact you with information about Fougue. experiences, updates, or special releases.
              </p>
              <p>
                You may opt out of marketing communications at any time by following the unsubscribe link or contacting us directly.
              </p>
            </Section>

            <Section title="4. Payments">
              <p>
                Payments made through the Fougue. website are processed by secure third-party payment providers.
              </p>
              <p>
                Fougue. does <strong>not</strong> store or have access to your payment card details. Payment information is handled directly by the payment provider in accordance with their own privacy and security policies.
              </p>
            </Section>

            <Section title="5. Sharing of Information">
              <p>We do not sell or rent your personal information.</p>
              <p>We may share limited information only when necessary:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>With trusted service providers (such as payment processors or technical partners) strictly to deliver Fougue. services</li>
                <li>When required by law or legal process</li>
              </ul>
              <p className="mt-3">All third parties are expected to handle your information securely and confidentially.</p>
            </Section>

            <Section title="6. Data Retention">
              <p>We retain personal information only for as long as necessary to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Deliver Fougue. services</li>
                <li>Comply with legal or accounting obligations</li>
                <li>Resolve disputes or enforce agreements</li>
              </ul>
              <p className="mt-3">When data is no longer required, it is securely deleted or anonymized.</p>
            </Section>

            <Section title="7. International Data Transfers">
              <p>Fougue. operates in the United Arab Emirates.</p>
              <p>
                If you access our website or services from outside the UAE, your information may be transferred to and processed in the UAE. We take reasonable steps to ensure your data is handled securely and in accordance with this Privacy Policy.
              </p>
            </Section>

            <Section title="8. Your Rights">
              <p>Depending on your location, you may have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access the personal data we hold about you</li>
                <li>Request correction or deletion of your data</li>
                <li>Withdraw consent to marketing communications</li>
              </ul>
              <p className="mt-3">
                To exercise these rights, please contact us using the details below. We may need to verify your identity before processing your request.
              </p>
            </Section>

            <Section title="9. Children's Privacy">
              <p>Fougue. services are intended for individuals aged <strong>18 and over</strong>.</p>
              <p>We do not knowingly collect personal data from children under 18.</p>
            </Section>

            <Section title="10. Updates to This Policy">
              <p>We may update this Privacy Policy from time to time.</p>
              <p>
                Any changes will be posted on this page with an updated "Last updated" date. Continued use of our website or services constitutes acceptance of the revised policy.
              </p>
            </Section>

            <Section title="11. Contact Us">
              <p>
                If you have any questions about this Privacy Policy or how your information is handled, you may contact us at:{" "}
                <a href="mailto:hello@fougue.ae" className="text-[#800913] hover:underline">
                  hello@fougue.ae
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
