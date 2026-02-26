import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Fougue. | Our Story & Mission",
  description:
    "Discover the story behind Fougue. We create original, themed and intimate experiences for couples in Dubai who want more than the usual.",
  openGraph: {
    title: "About Fougue. | Our Story & Mission",
    description:
      "Discover the story behind Fougue. We create original, themed and intimate experiences for couples in Dubai who want more than the usual.",
  },
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
