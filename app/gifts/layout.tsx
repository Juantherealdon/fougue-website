import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Gifts | Fougue. Thoughtful Presents for Couples",
  description:
    "Discover our curated collection of luxury gifts for couples. From artisanal products to experience vouchers, find the perfect gift to express your love.",
  openGraph: {
    title: "Gifts | Fougue. Thoughtful Presents for Couples",
    description:
      "Discover our curated collection of luxury gifts for couples. From artisanal products to experience vouchers, find the perfect gift to express your love.",
  },
}

export default function GiftsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
