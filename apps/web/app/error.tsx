'use client'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h2 className="text-4xl font-black text-gray-900 mb-4">Une erreur est survenue</h2>
      <p className="text-gray-500 mb-8">{error.message}</p>
      <button
        onClick={() => reset()}
        className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition"
      >
        Réessayer
      </button>
    </div>
  )
}
