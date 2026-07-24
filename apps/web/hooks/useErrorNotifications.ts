'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

export interface ErrorEvent {
  id?: string;
  timestamp: string;
  method: string;
  url: string;
  statusCode: number;
  message: string;
  stack?: string;
}

interface UseErrorNotificationsOptions {
  wsUrl?: string;
  enabled?: boolean;
  onError?: (error: ErrorEvent) => void;
}

interface UseErrorNotificationsReturn {
  connected: boolean;
  lastError: ErrorEvent | null;
}

/**
 * Hook that connects to the /errors WebSocket namespace
 * and listens for real-time error events.
 */
export function useErrorNotifications({
  wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3000',
  enabled = true,
  onError,
}: UseErrorNotificationsOptions = {}): UseErrorNotificationsReturn {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [lastError, setLastError] = useState<ErrorEvent | null>(null);
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  useEffect(() => {
    if (!enabled) return;

    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('opep_token') || localStorage.getItem('token')
        : null;

    if (!token) {
      console.warn('[ErrorMonitor] No token found, skipping WebSocket connection');
      return;
    }

    const socket = io(`${wsUrl}/errors`, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('[ErrorMonitor] WebSocket connecté');
      setConnected(true);
    });

    socket.on('disconnect', (reason) => {
      console.log('[ErrorMonitor] WebSocket déconnecté:', reason);
      setConnected(false);
    });

    socket.on('connect_error', (err) => {
      console.warn('[ErrorMonitor] Erreur de connexion:', err.message);
      setConnected(false);
    });

    socket.on('error-event', (data: ErrorEvent) => {
      console.log('[ErrorMonitor] Erreur reçue:', data.statusCode, data.url);
      setLastError(data);
      onErrorRef.current?.(data);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [wsUrl, enabled]);

  return { connected, lastError };
}
