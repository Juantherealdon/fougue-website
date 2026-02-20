import Link from "next/link"

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams

  return (
    <div className="min-h-screen bg-[#FBF5EF] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-10 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#800913"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>
        <h1 className="text-2xl font-light text-[#1E1E1E] mb-3">
          Authentication Error
        </h1>
        <p className="text-[#1E1E1E]/60 text-sm mb-8">
          {params?.error || "An error occurred during authentication. Please try again."}
        </p>
        <Link
          href="/"
          className="inline-block bg-[#800913] text-white px-8 py-3 text-sm tracking-[0.15em] uppercase hover:bg-[#600910] transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}
