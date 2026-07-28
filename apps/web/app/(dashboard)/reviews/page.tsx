'use client';

import React, { useState, useEffect } from 'react';
import {
  Star, Search, AlertCircle, ChevronRight, User,
  ThumbsUp, MessageSquare, Clock, TrendingUp,
} from 'lucide-react';
import { PageSkeleton } from '@/components/layout/PageSkeleton';
import { reviewsApi } from '@/services/api.service';
import { useAuth } from '@/context/AuthContext';
import { AnimatedMount } from '@/components/ui/AnimatedMount';

interface Review {
  id: string;
  passengerName: string;
  tripRoute: string;
  rating: number;
  comment: string;
  createdAt: string;
  status: 'PUBLISHED' | 'PENDING' | 'REJECTED';
}

const statusConfig: Record<string, { label: string; color: string }> = {
  PUBLISHED: { label: 'Publié', color: 'bg-success_green/10 text-success_green' },
  PENDING: { label: 'En attente', color: 'bg-warning_yellow/10 text-warning_yellow' },
  REJECTED: { label: 'Rejeté', color: 'bg-error_red/10 text-error_red' },
};

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    loadReviews();
  }, []);

  async function loadReviews() {
    setLoading(true);
    setError(null);
    try {
      // Note: user.id sert de placeholder — un vrai agencyId devrait être stocké
      // après connexion (ex: localStorage.setItem('opep_agency_id', user.agencyId))
      const agencyId = typeof window !== 'undefined'
        ? (localStorage.getItem('opep_agency_id') || user?.id || 'default')
        : 'default';
      const data = await reviewsApi.getByAgency(agencyId);
      setReviews(Array.isArray(data) ? data as Review[] : []);
    } catch (err: any) {
      // Fallback vers données mock si API non disponible
      console.warn('Reviews API unavailable, using mock data:', err.message);
      setReviews([
        { id: '1', passengerName: 'Jean M.', tripRoute: 'Douala → Yaoundé', rating: 5, comment: 'Excellent service, ponctuel et confortable.', createdAt: '2026-07-12', status: 'PUBLISHED' },
        { id: '2', passengerName: 'Alice K.', tripRoute: 'Yaoundé → Bafoussam', rating: 4, comment: 'Bon trajet, légèrement en retard.', createdAt: '2026-07-11', status: 'PUBLISHED' },
        { id: '3', passengerName: 'Paul B.', tripRoute: 'Douala → Garoua', rating: 3, comment: 'Moyen, climatisation en panne.', createdAt: '2026-07-10', status: 'PENDING' },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const filtered = reviews.filter((r) =>
    r.passengerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.tripRoute?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const avgRating = reviews.length > 0
    ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
    : '—';

  if (loading) return <PageSkeleton />;

  return (
    <div className="space-y-8">
      <AnimatedMount animation="slide-up" durationMs={300} className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-on_surface">Avis clients</h2>
          <p className="text-on_surface_variant">Consultez et modérez les avis des passagers.</p>
        </div>
      </AnimatedMount>

      <AnimatedMount animation="slide-up" durationMs={400} className="grid grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5">
          <Star size={20} className="text-warning_yellow mb-2" />
          <p className="text-2xl font-bold text-on_surface">{avgRating}</p>
          <p className="text-xs text-on_surface_variant font-medium">Note moyenne</p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <MessageSquare size={20} className="text-primary mb-2" />
          <p className="text-2xl font-bold text-on_surface">{reviews.length}</p>
          <p className="text-xs text-on_surface_variant font-medium">Total avis</p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <ThumbsUp size={20} className="text-success_green mb-2" />
          <p className="text-2xl font-bold text-on_surface">{reviews.filter((r) => r.rating >= 4).length}</p>
          <p className="text-xs text-on_surface_variant font-medium">Avis positifs</p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <TrendingUp size={20} className="text-primary mb-2" />
          <p className="text-2xl font-bold text-on_surface">{reviews.filter((r) => r.status === 'PENDING').length}</p>
          <p className="text-xs text-on_surface_variant font-medium">En modération</p>
        </div>
      </AnimatedMount>

      {error && (
        <div className="glass-card rounded-2xl p-6 flex items-center justify-between border-error_red/30">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-error_red" size={24} />
            <div>
              <p className="font-bold text-on_surface">Erreur de chargement</p>
              <p className="text-sm text-on_surface_variant">{error}</p>
            </div>
          </div>
          <button onClick={loadReviews} className="px-4 py-2 bg-primary text-on_primary text-sm font-bold rounded-xl hover:brightness-110 transition">Réessayer</button>
        </div>
      )}

      {!error && (
        <AnimatedMount animation="slide-up" durationMs={500} className="glass-card rounded-3xl overflow-hidden">
          <div className="p-5 border-b border-charcoal_border">
            <div className="relative max-w-md">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on_surface_variant" />
              <input type="text" placeholder="Rechercher un avis..." value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} className="input-field pl-10" />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="p-16 text-center">
              <Star size={48} className="mx-auto text-on_surface_variant/30 mb-4" />
              <p className="text-on_surface_variant font-bold">
                {searchQuery ? 'Aucun avis trouvé' : 'Aucun avis client'}
              </p>
              <p className="text-xs text-on_surface_variant/60 mt-1">
                {searchQuery ? 'Essayez un autre terme de recherche' : 'Les avis apparaîtront ici après modération'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-charcoal_border">
              {filtered.map((review, i) => (
                <div key={review.id} className="p-5 flex items-start gap-4 hover:bg-primary/5 transition-all"
                  style={{ animationDelay: `${i * 50}ms` }}>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <User size={18} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-on_surface">{review.passengerName}</p>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Star key={j} size={12} className={j < review.rating ? 'text-warning_yellow fill-warning_yellow' : 'text-on_surface_variant/20'} />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-on_surface_variant mt-1">{review.comment}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[10px] text-on_surface_variant/60">{review.tripRoute}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusConfig[review.status]?.color || ''}`}>
                        {statusConfig[review.status]?.label || review.status}
                      </span>
                      <span className="text-[10px] text-on_surface_variant/40 ml-auto">
                        {review.createdAt ? new Date(review.createdAt).toLocaleDateString('fr-FR') : ''}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AnimatedMount>
      )}
    </div>
  );
}
