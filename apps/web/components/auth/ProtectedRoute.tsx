'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: ('ADMIN_PLATFORM' | 'COMPANY_DIRECTOR' | 'CENTRE_MANAGER' | 'AGENCY_MANAGER' | 'CASHIER' | 'CONTROLLER' | 'DRIVER' | 'CLIENT')[];
  /** If true, show an error fallback instead of redirecting */
  fallback?: boolean;
}

export function ProtectedRoute({ children, roles, fallback: useFallback }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }

    if (!isLoading && isAuthenticated && roles && user && !roles.includes(user.role)) {
      if (!useFallback) {
        router.push('/unauthorized');
      }
    }
  }, [isAuthenticated, isLoading, router, roles, user, useFallback]);

  // If fallback is enabled and user doesn't have required role, show inline error
  if (!isLoading && isAuthenticated && roles && user && !roles.includes(user.role) && useFallback) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-error_red/10 flex items-center justify-center mb-6">
          <ShieldAlert size={32} className="text-error_red" />
        </div>
        <h2 className="text-xl font-bold text-on_surface mb-2">Accès restreint</h2>
        <p className="text-on_surface_variant mb-6 max-w-md">
          Vous n&apos;avez pas les permissions nécessaires pour voir ce contenu.
        </p>
        <Link href="/unauthorized">
          <Button variant="outline">En savoir plus</Button>
        </Link>
      </div>
    );
  }

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#111316] flex flex-col items-center justify-center gap-4">
        <Loader2 size={48} className="text-primary animate-spin" />
        <p className="text-on_surface_variant font-medium animate-pulse">Vérification de la session...</p>
      </div>
    );
  }

  return <>{children}</>;
}
