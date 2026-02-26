import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Experiences | Fougue. Intimate Moments for Couples",
  description:
    "Explore our curated collection of intimate experiences designed for couples in Dubai. From romantic dinners to artistic workshops, find your perfect moment.",
  openGraph: {
    title: "Experiences | Fougue. Intimate Moments for Couples",
    description:
      "Explore our curated collection of intimate experiences designed for couples in Dubai. From romantic dinners to artistic workshops, find your perfect moment.",
  },
}

export default function ExperiencesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
