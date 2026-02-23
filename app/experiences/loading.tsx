export default function Loading() {
  return (
    <div className="min-h-screen bg-[#FBF5EF]">
      {/* Hero skeleton */}
      <div className="h-[70vh] w-full bg-[#1E1E1E] animate-pulse flex flex-col items-center justify-center px-6">
        <div className="h-4 w-48 bg-white/10 mb-6" />
        <div className="h-14 w-96 max-w-full bg-white/10 mb-4" />
        <div className="h-5 w-72 max-w-full bg-white/5" />
      </div>
      {/* Experience cards skeleton */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col lg:flex-row gap-12 mb-20">
            <div className={`relative w-full lg:w-1/2 aspect-[4/3] bg-[#1E1E1E]/5 animate-pulse ${i % 2 === 1 ? 'lg:order-2' : ''}`} />
            <div className="flex-1 flex flex-col justify-center gap-4">
              <div className="h-3 w-32 bg-[#800913]/20" />
              <div className="h-10 w-64 bg-[#1E1E1E]/10" />
              <div className="h-4 w-full max-w-md bg-[#1E1E1E]/5" />
              <div className="h-4 w-3/4 max-w-sm bg-[#1E1E1E]/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
