'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: ('SUPER_ADMIN' | 'AGENCY_ADMIN' | 'CASHIER' | 'CONTROLLER' | 'DRIVER')[];
}

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }

    if (!isLoading && isAuthenticated && roles && user && !roles.includes(user.role)) {
      router.push('/unauthorized'); // You should create this page
    }
  }, [isAuthenticated, isLoading, router, roles, user]);

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
