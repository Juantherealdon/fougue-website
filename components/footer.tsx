import Link from "next/link"
import Image from "next/image"
import { Instagram, Mail } from "lucide-react"
import { NewsletterForm } from "./newsletter-form"

export function Footer() {
  return (
    <footer className="bg-[#1E1E1E] text-white">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-white text-2xl lg:text-3xl font-light mb-3">
                Stay in the <span className="italic text-[#800913]">Loop</span>
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Be the first to discover new experiences, exclusive offers, and romantic inspiration.
              </p>
            </div>
            <NewsletterForm variant="dark" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* Policies */}
          <div>
            <h4 className="text-sm tracking-[0.2em] uppercase mb-6 text-white/40">
              Policies
            </h4>
            <ul className="space-y-4">
              <li>
                <Link href="/terms" className="text-white/60 hover:text-white transition-colors duration-300">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-white/60 hover:text-white transition-colors duration-300">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund" className="text-white/60 hover:text-white transition-colors duration-300">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-white/60 hover:text-white transition-colors duration-300">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigate */}
          <div>
            <h4 className="text-sm tracking-[0.2em] uppercase mb-6 text-white/40">
              Navigate
            </h4>
            <ul className="space-y-4">
              {[
                { label: "Home", href: "/" },
                { label: "Experiences", href: "/experiences" },
                { label: "Gifts Collection", href: "/gifts" },
                { label: "About", href: "/about" },
                { label: "Contact", href: "/contact" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-white/60 hover:text-white transition-colors duration-300">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-sm tracking-[0.2em] uppercase mb-6 text-white/40">
              Connect
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:hello@fougue.ae"
                  className="text-white/60 hover:text-white transition-colors duration-300 flex items-center gap-2"
                >
                  <Mail size={16} />
                  hello@fougue.ae
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/lovewithfougue"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white transition-colors duration-300 flex items-center gap-2"
                >
                  <Instagram size={16} />
                  @lovewithfougue
                </a>
              </li>
              <li className="pt-2">
                <p className="text-white/40 text-sm">Dubai, UAE</p>
              </li>
            </ul>
          </div>

          {/* Secure Checkout - 4th column */}
          <div>
            <h4 className="text-sm tracking-[0.2em] uppercase mb-6 text-white/40">
              Secure Checkout
            </h4>
            <p className="text-white/30 text-xs tracking-wide mb-4">Powered by Stripe</p>
            <div className="flex flex-wrap gap-2">
              {/* Visa */}
              <svg width="42" height="28" viewBox="0 0 42 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-40">
                <rect width="42" height="28" rx="4" fill="white" fillOpacity="0.1"/>
                <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" fontFamily="sans-serif">VISA</text>
              </svg>
              {/* Mastercard */}
              <svg width="42" height="28" viewBox="0 0 42 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-40">
                <rect width="42" height="28" rx="4" fill="white" fillOpacity="0.1"/>
                <circle cx="17" cy="14" r="7" fill="#EB001B" fillOpacity="0.7"/>
                <circle cx="25" cy="14" r="7" fill="#F79E1B" fillOpacity="0.7"/>
              </svg>
              {/* Apple Pay */}
              <svg width="42" height="28" viewBox="0 0 42 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-40">
                <rect width="42" height="28" rx="4" fill="white" fillOpacity="0.1"/>
                <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="7" fontWeight="500" fontFamily="sans-serif"> Pay</text>
              </svg>
              {/* Google Pay */}
              <svg width="42" height="28" viewBox="0 0 42 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-40">
                <rect width="42" height="28" rx="4" fill="white" fillOpacity="0.1"/>
                <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="7" fontWeight="500" fontFamily="sans-serif">G Pay</text>
              </svg>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Left: copyright */}
            <p className="text-white/40 text-sm md:w-1/3">
              &copy; {new Date().getFullYear()} Fougue. All rights reserved.
            </p>
            {/* Center: logo */}
            <div className="flex justify-center md:w-1/3">
              <Image
                src="/images/fougue-logo-white-transparent.png"
                alt="Fougue."
                width={100}
                height={40}
                className="h-8 w-auto opacity-60"
              />
            </div>
            {/* Right: tagline */}
            <p className="text-white/40 text-sm italic md:w-1/3 md:text-right">
              The Art of Romance.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
