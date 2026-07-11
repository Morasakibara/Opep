'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface LocationUpdate {
  tripId: string;
  latitude: number;
  longitude: number;
  speed?: number;
  heading?: number;
  timestamp: string;
}

interface UseGpsWebSocketOptions {
  wsUrl: string;
  onLocationUpdate?: (data: LocationUpdate) => void;
  enabled?: boolean;
}

interface UseGpsWebSocketReturn {
  connected: boolean;
  wsError: string | null;
  socketRef: React.MutableRefObject<Socket | null>;
  subscribeToTrip: (tripId: string) => void;
  unsubscribeFromTrip: (tripId: string) => void;
  sendLocation: (data: LocationUpdate) => void;
}

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useGpsWebSocket({
  wsUrl,
  onLocationUpdate,
  enabled = true,
}: UseGpsWebSocketOptions): UseGpsWebSocketReturn {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [wsError, setWsError] = useState<string | null>(null);
  const onLocationUpdateRef = useRef(onLocationUpdate);

  // Keep callback ref up to date without re-creating the socket
  onLocationUpdateRef.current = onLocationUpdate;

  useEffect(() => {
    if (!enabled) return;

    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('opep_token') || localStorage.getItem('token')
        : null;

    if (!token) {
      setWsError('Authentification requise pour le suivi GPS');
      setConnected(false);
      return;
    }

    const socket = io(`${wsUrl}/gps`, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('[GPS] WebSocket connecté');
      setConnected(true);
      setWsError(null);
    });

    socket.on('disconnect', (reason) => {
      console.log('[GPS] WebSocket déconnecté:', reason);
      setConnected(false);
    });

    socket.on('connect_error', (err) => {
      console.error('[GPS] Erreur de connexion:', err.message);
      setWsError(err.message);
      setConnected(false);
    });

    socket.on('error', (err: any) => {
      console.error('[GPS] Erreur WebSocket:', err);
      setWsError(err?.message || 'Erreur de connexion');
    });

    socket.on('location-update', (data: LocationUpdate) => {
      onLocationUpdateRef.current?.(data);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [wsUrl, enabled]);

  const subscribeToTrip = useCallback((tripId: string) => {
    socketRef.current?.emit('subscribe-trip', { tripId });
  }, []);

  const unsubscribeFromTrip = useCallback((tripId: string) => {
    socketRef.current?.emit('unsubscribe-trip', { tripId });
  }, []);

  const sendLocation = useCallback((data: LocationUpdate) => {
    socketRef.current?.emit('update-location', data);
  }, []);

  return {
    connected,
    wsError,
    socketRef,
    subscribeToTrip,
    unsubscribeFromTrip,
    sendLocation,
  };
}
