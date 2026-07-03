'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';

type Role = 'SUPER_ADMIN' | 'AGENCY_ADMIN' | 'CASHIER' | 'CONTROLLER' | 'DRIVER';

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
