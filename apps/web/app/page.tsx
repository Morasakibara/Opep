'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/login');
  }, [router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-900 text-white">
      <h1 className="text-4xl font-black italic tracking-tighter text-blue-400 animate-pulse">
        OPEP
      </h1>
      <p className="mt-4 text-gray-400">Redirection vers le portail de connexion...</p>
    </main>
  );
}
