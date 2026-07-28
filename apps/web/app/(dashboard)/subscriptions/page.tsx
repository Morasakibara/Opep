'use client';

import React, { useState, useEffect } from 'react';
import {
  CreditCard, AlertCircle,
  Crown, Zap, Star,
} from 'lucide-react';
import { PageSkeleton } from '@/components/layout/PageSkeleton';
import { subscriptionsApi } from '@/services/api.service';

interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  isActive: boolean;
  period: 'MONTHLY' | 'YEARLY';
}

export default function SubscriptionsPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPackages();
  }, []);

  async function loadPackages() {
    setLoading(true);
    setError(null);
    try {
      const pkgs = await subscriptionsApi.getPackages();
      setPackages(pkgs as Package[]);
    } catch (err: any) {
      setError(err.message || 'Erreur de chargement des forfaits');
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <PageSkeleton />;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end animate-in slide-in-from-bottom duration-300">
        <div>
          <h2 className="text-2xl font-bold text-on_surface">Abonnements</h2>
          <p className="text-on_surface_variant">Choisissez le forfait adapté à votre agence.</p>
        </div>
      </div>

      {/* Info card */}
      <div className="glass-card rounded-3xl p-6 animate-in slide-in-from-bottom duration-400 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Crown size={20} className="text-primary" />
        </div>
        <div>
          <p className="font-bold text-on_surface">Abonnements et forfaits</p>
          <p className="text-xs text-on_surface_variant mt-1">
            Les abonnements sont liés à votre agence. Pour voir votre abonnement actif, 
            connectez-vous et rendez-vous dans les paramètres de votre compagnie.
          </p>
          <p className="text-xs text-on_surface_variant/60 mt-1">
            Les forfaits ci-dessous sont disponibles à la souscription.
          </p>
        </div>
      </div>

      {error && (
        <div className="glass-card rounded-2xl p-6 flex items-center justify-between border-error_red/30">
          <div className="flex items-center gap-3"><AlertCircle className="text-error_red" size={24} /><p className="font-bold text-on_surface">{error}</p></div>
          <button onClick={loadPackages} className="px-4 py-2 bg-primary text-on_primary text-sm font-bold rounded-xl hover:brightness-110 active:scale-[0.97] transition-all">Réessayer</button>
        </div>
      )}

      {!error && (
        <div className="glass-card rounded-3xl overflow-hidden animate-in slide-in-from-bottom duration-500">
          <div className="p-6 border-b border-charcoal_border">
            <h3 className="font-bold text-on_surface">Forfaits disponibles</h3>
          </div>

          {packages.length === 0 ? (
            <div className="p-12 text-center">
              <CreditCard size={48} className="mx-auto text-on_surface_variant/30 mb-4" />
              <p className="text-on_surface_variant font-bold">Aucun forfait disponible pour le moment</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
              {packages.map((pkg, i) => (
                <div key={pkg.id} className="glass-card-hover rounded-2xl p-6 text-center border border-charcoal_border group"
                  style={{ animationDelay: `${i * 100}ms` }}>
                  {pkg.isActive && <span className="text-[10px] bg-primary/10 text-primary font-bold px-3 py-1 rounded-full mb-4 inline-block">Populaire</span>}
                  <h4 className="text-lg font-bold text-on_surface mb-1">{pkg.name}</h4>
                  <p className="text-3xl font-black text-primary mb-1">
                    {pkg.price?.toLocaleString()} <span className="text-sm font-medium text-on_surface_variant">FCFA/{pkg.period === 'YEARLY' ? 'an' : 'mois'}</span>
                  </p>
                  <p className="text-xs text-on_surface_variant mb-6">{pkg.description}</p>
                  <button className="w-full py-3 rounded-xl bg-primary/10 text-primary font-bold text-sm hover:bg-primary hover:text-on_primary transition-all active:scale-[0.97]">
                    Souscrire
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
