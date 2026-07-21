'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AgenciesPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/companies');
  }, [router]);

  return null;
}
