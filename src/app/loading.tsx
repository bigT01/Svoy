// app/loading.tsx
export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-4">
        {/* Simple Tailwind Spinner */}
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
        <p className="text-white text-sm font-medium animate-pulse">LOADING VIDEOS...</p>
      </div>
    </div>
  );
}