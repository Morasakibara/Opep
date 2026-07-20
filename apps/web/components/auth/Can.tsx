'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';

type Role = 'ADMIN_PLATFORM' | 'COMPANY_DIRECTOR' | 'CENTRE_MANAGER' | 'AGENCY_MANAGER' | 'CASHIER' | 'CONTROLLER' | 'DRIVER' | 'CLIENT';

interface CanProps {
  roles: Role[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function Can({ roles, children, fallback = null }: CanProps) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return fallback;
  }

  if (roles.includes(user.role)) {
    return <>{children}</>;
  }

  return fallback;
}
