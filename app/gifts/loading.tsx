export default function Loading() {
  return (
    <div className="min-h-screen bg-[#FBF5EF]">
      {/* Hero skeleton */}
      <div className="h-[60vh] w-full bg-[#1E1E1E] animate-pulse flex flex-col items-center justify-center px-6">
        <div className="h-4 w-40 bg-white/10 mb-6" />
        <div className="h-14 w-80 max-w-full bg-white/10 mb-4" />
        <div className="h-5 w-64 max-w-full bg-white/5" />
      </div>
      {/* Product grid skeleton */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex gap-3 mb-12 justify-center">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-10 w-24 bg-[#1E1E1E]/5 animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[4/5] bg-[#1E1E1E]/5 mb-4" />
              <div className="h-4 w-3/4 bg-[#1E1E1E]/5 mb-2" />
              <div className="h-3 w-1/2 bg-[#1E1E1E]/5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
