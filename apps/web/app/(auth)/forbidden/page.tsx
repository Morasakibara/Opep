'use client';

import React from 'react';
import Link from 'next/link';
import { LockKeyhole, Home, ArrowLeft, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { AnimatedMount } from '@/components/ui/AnimatedMount';

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Abstract Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[60%] h-[60%] bg-error_red/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 w-[50%] h-[50%] bg-warning_yellow/10 rounded-full blur-[120px]" />
      </div>

      <AnimatedMount animation="slide-up" durationMs={700} className="w-full max-w-lg text-center relative z-10">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-error_red/10 border border-error_red/20 mb-8 shadow-xl shadow-error_red/10">
          <LockKeyhole size={52} className="text-error_red" />
        </div>

        {/* Error Code */}
        <h1 className="text-8xl font-black text-error_red/20 select-none mb-4">403</h1>

        {/* Title */}
        <h2 className="text-3xl font-bold text-on_surface mb-4">Accès interdit</h2>
        <p className="text-on_surface_variant text-lg mb-2 max-w-md mx-auto">
          Cette ressource est protégée et vous n&apos;avez pas les droits nécessaires pour y accéder.
        </p>
        <p className="text-on_surface_variant/60 text-sm mb-10 max-w-sm mx-auto">
          Si vous pensez qu&apos;il s&apos;agit d&apos;une erreur, veuillez contacter votre administrateur.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/dashboard">
            <Button variant="primary" className="rounded-full px-8 py-3" leftIcon={<Home size={18} />}>
              Tableau de bord
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" className="rounded-full px-8 py-3" leftIcon={<ArrowLeft size={18} />}>
              Se connecter
            </Button>
          </Link>
        </div>

        {/* Additional info */}
        <div className="mt-12 p-5 glass-card rounded-2xl text-left border-primary/10">
          <div className="flex items-start gap-3">
            <ShieldAlert size={18} className="text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-on_surface mb-1">Protection des accès</p>
              <p className="text-xs text-on_surface_variant leading-relaxed">
                L&apos;OPEP Platform utilise un système de contrôle d&apos;accès basé sur les rôles (RBAC). 
                Chaque action est vérifiée par des gardes d&apos;autorisation côté serveur. 
                Si vous avez besoin d&apos;un accès supplémentaire, demandez une élévation de privilèges à votre administrateur.
              </p>
            </div>
          </div>
        </div>
      </AnimatedMount>
    </div>
  );
}
