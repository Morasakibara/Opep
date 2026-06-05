import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h2 className="text-4xl font-black text-gray-900 mb-4">404 - Page non trouvée</h2>
      <p className="text-gray-500 mb-8">Désolé, la page que vous recherchez n'existe pas.</p>
      <Link
        href="/"
        className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition"
      >
        Retour à l'accueil
      </Link>
    </div>
  )
}
