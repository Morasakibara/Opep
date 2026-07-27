'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  RefreshCcw,
  Trash2,
  XCircle,
  AlertCircle,
  Info,
  Activity,
  Wifi,
  WifiOff,

  ChevronDown,
  Search,
  Filter,
} from 'lucide-react';
import { useErrorNotifications, ErrorEvent } from '@/hooks/useErrorNotifications';

interface StoredError {
  id: string;
  createdAt: string;
  method: string;
  url: string;
  statusCode: number;
  message: string;
  stack?: string;
}

interface ErrorResponse {
  data: StoredError[];
  nextCursor?: string;
  total: number;
}

interface ErrorStats {
  total: number;
  byStatus: Record<string, number>;
}

const STATUS_COLORS: Record<string, string> = {
  '500': 'text-error_red bg-error_red/10 border-error_red/20',
  '502': 'text-error_red bg-error_red/10 border-error_red/20',
  '503': 'text-error_red bg-error_red/10 border-error_red/20',
  '401': 'text-warning_yellow bg-warning_yellow/10 border-warning_yellow/20',
  '403': 'text-warning_yellow bg-warning_yellow/10 border-warning_yellow/20',
  '404': 'text-on_surface_variant bg-surface_container_high border-charcoal_border',
  '429': 'text-error_red bg-error_red/10 border-error_red/20',
  '400': 'text-warning_yellow bg-warning_yellow/10 border-warning_yellow/20',
};

function StatusBadge({ code }: { code: number }) {
  const colorClass = STATUS_COLORS[String(code)] || 'text-on_surface_variant bg-surface_container_high border-charcoal_border';
  return (
    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${colorClass}`}>
      {code}
    </span>
  );
}

function MethodBadge({ method }: { method: string }) {
  const colors: Record<string, string> = {
    GET: 'text-success_green bg-success_green/10 border-success_green/20',
    POST: 'text-primary bg-primary/10 border-primary/20',
    PUT: 'text-warning_yellow bg-warning_yellow/10 border-warning_yellow/20',
    PATCH: 'text-warning_yellow bg-warning_yellow/10 border-warning_yellow/20',
    DELETE: 'text-error_red bg-error_red/10 border-error_red/20',
  };
  const colorClass = colors[method] || 'text-on_surface_variant bg-surface_container_high border-charcoal_border';
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${colorClass}`}>
      {method}
    </span>
  );
}

export default function MonitoringPage() {
  const [errors, setErrors] = useState<StoredError[]>([]);
  const [stats, setStats] = useState<ErrorStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedError, setSelectedError] = useState<StoredError | null>(null);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  // Filters
  const [filterMode, setFilterMode] = useState<'all' | '5xx' | '4xx'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [newErrorCount, setNewErrorCount] = useState(0);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // WebSocket real-time notifications
  const { connected: wsConnected } = useErrorNotifications({
    enabled: true,
    onError: () => {
      setNewErrorCount((n) => n + 1);
    },
  });

  const authHeaders = useCallback(() => {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  }, []);

  // Build query string from filters
  const buildQuery = useCallback((extra: string = '') => {
    const params = new URLSearchParams();
    if (filterMode === '5xx') { params.set('minStatus', '500'); params.set('maxStatus', '599'); }
    if (filterMode === '4xx') { params.set('minStatus', '400'); params.set('maxStatus', '499'); }
    if (debouncedSearch) params.set('search', debouncedSearch);
    const base = `/api/v1/monitoring/errors?limit=20${params.toString() ? '&' + params.toString() : ''}`;
    return base + extra;
  }, [filterMode, debouncedSearch]);

  const fetchData = useCallback(async () => {
    try {
      const headers = authHeaders();

      const errorsUrl = buildQuery();
      const statsUrl = `/api/v1/monitoring/errors/stats?${new URLSearchParams(
        filterMode === '5xx' ? { minStatus: '500', maxStatus: '599' }
        : filterMode === '4xx' ? { minStatus: '400', maxStatus: '499' }
        : {}
      ).toString()}${debouncedSearch ? '&search=' + encodeURIComponent(debouncedSearch) : ''}`;

      const [errorsRes, statsRes] = await Promise.all([
        fetch(errorsUrl, { headers }),
        fetch(statsUrl, { headers }),
      ]);

      if (errorsRes.ok) {
        const data: ErrorResponse = await errorsRes.json();
        setErrors(data.data);
        setCursor(data.nextCursor);
        setHasMore(!!data.nextCursor);
        setNewErrorCount(0);
      }
      if (statsRes.ok) setStats(await statsRes.json());
    } catch {
      // Silently fail — monitoring should never crash the page
    } finally {
      setIsLoading(false);
    }
  }, [authHeaders, buildQuery, filterMode, debouncedSearch]);

  // Load more (paginated)
  const loadMore = useCallback(async () => {
    if (!cursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const headers = authHeaders();
      const res = await fetch(`${buildQuery()}&cursor=${cursor}`, { headers });
      if (res.ok) {
        const data: ErrorResponse = await res.json();
        setErrors((prev) => [...prev, ...data.data]);
        setCursor(data.nextCursor);
        setHasMore(!!data.nextCursor);
      }
    } catch {} finally {
      setLoadingMore(false);
    }
  }, [cursor, loadingMore, authHeaders, buildQuery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchData]);

  async function handleClear() {
    const headers = authHeaders();
    try {
      const res = await fetch('/api/v1/monitoring/errors', { method: 'DELETE', headers });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setErrors([]);
      setStats(null);
      setCursor(undefined);
      setHasMore(false);
      setNewErrorCount(0);
    } catch (err) {
      console.warn('[Monitoring] Clear failed:', err);
    }
  }

  function getStatusIcon(code: number) {
    if (code >= 500) return <XCircle size={16} className="text-error_red" />;
    if (code === 429) return <AlertCircle size={16} className="text-error_red" />;
    if (code >= 400) return <AlertTriangle size={16} className="text-warning_yellow" />;
    return <Info size={16} className="text-primary" />;
  }    return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in slide-in-from-bottom duration-300">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-on_surface flex items-center gap-3">
              <Activity size={24} className="text-primary" />
              Monitoring des Erreurs
            </h2>
            {newErrorCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-error_red/20 text-error_red text-[11px] font-bold border border-error_red/30 animate-pulse-soft">
                +{newErrorCount}
              </span>
            )}
          </div>
          <p className="text-on_surface_variant text-sm mt-1">
            Visualisez les erreurs récentes de l&apos;API en temps réel
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* WebSocket status */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold border ${
            wsConnected ? 'text-success_green border-success_green/20 bg-success_green/5' : 'text-error_red border-error_red/20 bg-error_red/5'
          }`}>
            {wsConnected ? <Wifi size={12} /> : <WifiOff size={12} />}
            <span>{wsConnected ? 'Live' : 'Offline'}</span>
          </div>
          
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider border transition-all ${
              autoRefresh
                ? 'bg-primary/10 text-primary border-primary/20'
                : 'bg-surface_container_high text-on_surface_variant border-charcoal_border'
            }`}
          >
            {autoRefresh ? 'Auto' : 'Manuel'}
          </button>
          <button
            onClick={fetchData}
            disabled={isLoading}
            className="px-3 py-2 rounded-lg bg-primary/10 text-primary border border-primary/20 text-[11px] font-bold uppercase tracking-wider hover:brightness-110 transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <RefreshCcw size={12} className={isLoading ? 'animate-spin' : ''} />
            Rafraîchir
          </button>
          <button
            onClick={handleClear}
            className="px-3 py-2 rounded-lg bg-error_red/10 text-error_red border border-error_red/20 text-[11px] font-bold uppercase tracking-wider hover:brightness-110 transition-all flex items-center gap-1.5"
          >
            <Trash2 size={12} />
            Effacer
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 animate-in slide-in-from-bottom duration-350">
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-on_surface_variant" />
          {(['all', '5xx', '4xx'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setFilterMode(mode)}
              className={`px-3.5 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider border transition-all ${
                filterMode === mode
                  ? mode === '5xx'
                    ? 'bg-error_red/10 text-error_red border-error_red/20'
                    : mode === '4xx'
                    ? 'bg-warning_yellow/10 text-warning_yellow border-warning_yellow/20'
                    : 'bg-primary/10 text-primary border-primary/20'
                  : 'bg-surface_container_high text-on_surface_variant border-charcoal_border hover:text-on_surface'
              }`}
            >
              {mode === 'all' ? 'Tout' : mode.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="relative flex-1 sm:max-w-xs w-full">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-on_surface_variant" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par URL ou message..."
            className="w-full bg-surface_container_high border border-charcoal_border rounded-lg pl-9 pr-4 py-2 text-[12px] text-on_surface placeholder:text-on_surface_variant/50 focus:ring-1 focus:ring-primary focus:border-primary transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on_surface_variant hover:text-on_surface"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-in slide-in-from-bottom duration-400">
        <div className="glass-card rounded-2xl p-5">
          <p className="text-[11px] font-bold uppercase tracking-widest text-on_surface_variant mb-1">Total</p>
          <p className="text-3xl font-bold text-on_surface">{stats?.total || 0}</p>
        </div>
        {['500', '401', '404'].map((status) => (
          <div key={status} className="glass-card rounded-2xl p-5">
            <p className="text-[11px] font-bold uppercase tracking-widest text-on_surface_variant mb-1">
              {status === '500' ? 'Erreurs 5xx' : status === '401' ? 'Non auth' : 'Not Found'}
            </p>
            <p className={`text-3xl font-bold ${
              status === '500' ? 'text-error_red' : status === '401' ? 'text-warning_yellow' : 'text-on_surface_variant'
            }`}>
              {stats?.byStatus[status] || 0}
            </p>
          </div>
        ))}
      </div>

      {/* Error List */}
      <div className="glass-card rounded-3xl overflow-hidden animate-in slide-in-from-bottom duration-500">
        <div className="p-5 border-b border-charcoal_border">
          <h3 className="text-[15px] font-bold text-on_surface">Erreurs récentes</h3>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-on_surface_variant">
            <RefreshCcw size={24} className="animate-spin mx-auto mb-3 opacity-50" />
            <p className="font-medium">Chargement des erreurs...</p>
          </div>
        ) : errors.length === 0 ? (
          <div className="p-12 text-center">
            <CheckCircle2 size={48} className="text-success_green mx-auto mb-3 opacity-60" />
            <p className="text-on_surface_variant font-medium text-lg">Aucune erreur</p>
            <p className="text-on_surface_variant/60 text-sm mt-1">Toutes les requêtes API se déroulent sans problème</p>
          </div>
        ) : (
          <div className="divide-y divide-charcoal_border max-h-[600px] overflow-y-auto custom-scrollbar">
            {errors.map((err) => (
              <div
                key={err.id}
                onClick={() => setSelectedError(selectedError?.id === err.id ? null : err)}
                className={`p-4 hover:bg-surface_container_low transition-colors cursor-pointer ${
                  selectedError?.id === err.id ? 'bg-surface_container_low' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="mt-0.5 flex-shrink-0">{getStatusIcon(err.statusCode)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <StatusBadge code={err.statusCode} />
                      <MethodBadge method={err.method} />
                      <span className="text-[12px] text-on_surface_variant font-mono truncate">{err.url}</span>
                    </div>
                    <p className="text-sm text-on_surface font-medium truncate">{err.message}</p>
                    <p className="text-[11px] text-on_surface_variant mt-1">
                      {new Date(err.createdAt).toLocaleString('fr-FR')}
                    </p>
                    {selectedError?.id === err.id && err.stack && (
                      <pre className="mt-3 p-4 bg-surface_container_highest rounded-xl text-[11px] text-on_surface_variant font-mono overflow-x-auto max-h-48 custom-scrollbar whitespace-pre-wrap">
                        {err.stack}
                      </pre>
                    )}
                  </div>
                  <div className="flex-shrink-0 text-on_surface_variant/40">
                    {selectedError?.id === err.id ? '▲' : '▼'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination - Load More */}
        {hasMore && (
          <div className="p-4 text-center border-t border-charcoal_border">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="px-6 py-2.5 rounded-xl bg-surface_container_high text-on_surface_variant hover:text-on_surface border border-charcoal_border text-[12px] font-bold uppercase tracking-wider transition-all flex items-center gap-2 mx-auto disabled:opacity-50"
            >
              {loadingMore ? (
                <><RefreshCcw size={14} className="animate-spin" /> Chargement...</>
              ) : (
                <><ChevronDown size={14} /> Voir plus ({stats ? stats.total - errors.length : 0} restantes)</>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
