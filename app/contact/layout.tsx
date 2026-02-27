import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact | Fougue. Get in Touch",
  description:
    "Have a question or want to book an experience? Contact Fougue. We're here to help you create unforgettable moments together.",
  openGraph: {
    title: "Contact | Fougue. Get in Touch",
    description:
      "Have a question or want to book an experience? Contact Fougue. We're here to help you create unforgettable moments together.",
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
