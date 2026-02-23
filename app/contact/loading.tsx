export default function Loading() {
  return (
    <div className="min-h-screen bg-[#FBF5EF]">
      <div className="h-[70vh] w-full bg-[#1E1E1E] animate-pulse flex flex-col items-center justify-center px-6">
        <div className="h-4 w-32 bg-white/10 mb-6" />
        <div className="h-14 w-72 max-w-full bg-white/10 mb-4" />
        <div className="h-5 w-64 max-w-full bg-white/5" />
      </div>
    </div>
  )
}
