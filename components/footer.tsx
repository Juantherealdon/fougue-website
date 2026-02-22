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
          {/* Logo & Tagline */}
          <div className="lg:col-span-2">
            <Image
              src="/images/fougue-logo-white-transparent.png"
              alt="Fougue."
              width={150}
              height={60}
              className="h-12 w-auto mb-6"
            />
            <p className="text-white/60 text-lg leading-relaxed max-w-md">
              Re-enchanting the way couples spend time together. Every moment is
              a story you can step into.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm tracking-[0.2em] uppercase mb-6 text-white/40">
              Navigate
            </h4>
            <ul className="space-y-4">
              {["Home", "Experiences", "Gifts Collection", "About", "Contact"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href={
                        item === "Home"
                          ? "/"
                          : item === "Gifts Collection"
                            ? "/gifts"
                            : `/${item.toLowerCase()}`
                      }
                      className="text-white/60 hover:text-white transition-colors duration-300"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact */}
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
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-white/40 text-sm">
              &copy; {new Date().getFullYear()} Fougue. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="/terms"
                className="text-white/40 text-sm hover:text-white transition-colors duration-300"
              >
                Terms & Conditions
              </Link>
              <Link
                href="/privacy"
                className="text-white/40 text-sm hover:text-white transition-colors duration-300"
              >
                Privacy Policy
              </Link>
              <Link
                href="/faq"
                className="text-white/40 text-sm hover:text-white transition-colors duration-300"
              >
                FAQ
              </Link>
            </div>
            <p className="text-white/40 text-sm italic">
              The Art of Romance. 
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
