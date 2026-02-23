export default function Loading() {
  return (
    <div className="min-h-screen bg-[#1E1E1E]">
      {/* Hero skeleton */}
      <div className="h-screen w-full bg-[#1E1E1E] animate-pulse flex flex-col items-center justify-center px-6">
        <div className="h-4 w-64 bg-white/10 mb-8" />
        <div className="h-16 w-96 max-w-full bg-white/10 mb-4" />
        <div className="h-6 w-80 max-w-full bg-white/5 mb-12" />
        <div className="flex gap-4">
          <div className="h-14 w-52 bg-[#800913]/30" />
          <div className="h-14 w-40 border border-white/10" />
        </div>
      </div>
    </div>
  )
}
