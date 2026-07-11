'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import {
  Signal, Zap, Bus as BusIcon,
  Route as TrajectoryIcon, Layers as ClusterIcon,
  MapPin, Clock, Search, X,
} from 'lucide-react';
import { useGpsWebSocket, type LocationUpdate } from '@/hooks/useGpsWebSocket';
import type { Socket } from 'socket.io-client';

// ─── Types ──────────────────────────────────────────────────────────────────

interface BusMarker {
  id: string;
  tripId: string;
  plateNumber: string;
  route: string;
  latitude: number;
  longitude: number;
  speed?: number;
  heading?: number;
  status: 'moving' | 'stopped' | 'incident';
  lastUpdated: Date;
  /** Trail of recent positions for trajectory display */
  trail: [number, number][];
}

interface BusRecord extends BusMarker {
  trailPolyline?: any;
}

interface Departure {
  destination: string;
  time: string;
  company: string;
}

interface CityInfo {
  name: string;
  coords: [number, number];
  color: string;
  departures: Departure[];
}

// ─── Constants ──────────────────────────────────────────────────────────────

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const WS_URL = API_BASE.replace('/api/v1', '');
const CAMEROON_CENTER: [number, number] = [5.5, 12.5];
const DEFAULT_ZOOM = 7;
const MAX_TRAIL_LENGTH = 20; // Max points in trajectory trail

const STATUS_STYLES = {
  moving: { color: '#79d8b7', pulse: true },
  stopped: { color: '#FFD54F', pulse: false },
  incident: { color: '#E53935', pulse: true },
} as const;

// ─── Component ──────────────────────────────────────────────────────────────

export default function LiveMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const leafletRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());
  const trailPolylinesRef = useRef<Map<string, any>>(new Map());
  const clusterGroupRef = useRef<any>(null);
  const [buses, setBuses] = useState<BusRecord[]>([]);
  const [activeTrips, setActiveTrips] = useState(0);
  const [selectedBus, setSelectedBus] = useState<BusRecord | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [showTrails, setShowTrails] = useState(true);
  const [useClustering, setUseClustering] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedCity, setSelectedCity] = useState<CityInfo | null>(null);
  const heatLayerRef = useRef<any>(null);

  // ── Fetch cities from API with fallback ──────────────────────────────────

  useEffect(() => {
    if (!mapReady) return;

    const fetchCities = async () => {
      try {
        const token =
          typeof window !== 'undefined'
            ? localStorage.getItem('opep_token') || localStorage.getItem('token')
            : null;

        const res = await fetch(`${API_BASE}/routes/cities`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Failed to fetch cities');

        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          // API data reçue — les données statiques restent la source de vérité
          // L'endpoint GET /routes/cities est disponible pour usage futur
        }
      } catch (err) {
        console.warn('[LiveMap] Impossible de charger les villes depuis API:', err);
      }
    };

    fetchCities();
  }, [mapReady]);

  // ── WebSocket hook ───────────────────────────────────────────────────────

  const handleLocationUpdate = useCallback((data: LocationUpdate) => {
    setBuses((prev) => {
      const existing = prev.find((b) => b.tripId === data.tripId);
      if (!existing) return prev;

      const updated: BusRecord = {
        ...existing,
        latitude: data.latitude,
        longitude: data.longitude,
        speed: data.speed ?? existing.speed,
        heading: data.heading ?? existing.heading,
        status: (data.speed ?? 0) > 0 ? 'moving' : 'stopped',
        lastUpdated: new Date(),
        trail: [
          ...existing.trail,
          [data.latitude, data.longitude] as [number, number],
        ].slice(-MAX_TRAIL_LENGTH),
      };

      updateBusMarker(updated);
      updateTrailPolyline(updated);

      return prev.map((b) => (b.tripId === data.tripId ? updated : b));
    });
  }, []);

  const { connected, wsError, socketRef, subscribeToTrip } = useGpsWebSocket({
    wsUrl: WS_URL,
    onLocationUpdate: handleLocationUpdate,
    enabled: mapReady,
  });

  // ── Initialize Leaflet Map ───────────────────────────────────────────────

  useEffect(() => {
    if (typeof window === 'undefined' || mapRef.current) return;

    const initMap = async () => {
      try {
        const L = (await import('leaflet')).default;
        // leaflet.css est déjà chargé globalement (app/globals.css ou bundler)

        leafletRef.current = L;

        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });

        if (!mapContainerRef.current) return;

        const map = L.map(mapContainerRef.current, {
          center: CAMEROON_CENTER,
          zoom: DEFAULT_ZOOM,
          zoomControl: false,
          attributionControl: false,
        });

        // Dark theme tile layer
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
        }).addTo(map);

        // Zoom controls
        L.control.zoom({ position: 'bottomright' }).addTo(map);

        // Cameroon outline
        const cameroonCoords: any = [
          [2.1, 9.6], [2.2, 10.0], [2.5, 10.5], [3.0, 11.0],
          [3.5, 11.5], [4.0, 11.7], [4.5, 11.5], [5.0, 11.3],
          [5.5, 11.0], [6.0, 10.8], [6.5, 10.5], [7.0, 10.3],
          [7.5, 10.5], [8.0, 10.8], [8.5, 11.0], [9.0, 11.5],
          [9.5, 12.0], [10.0, 12.5], [10.5, 13.0], [11.0, 13.5],
          [11.5, 14.0], [12.0, 14.5], [12.5, 14.8], [13.0, 15.0],
          [13.5, 15.0], [13.0, 14.5], [12.5, 14.0], [12.0, 13.5],
          [11.5, 13.0], [11.0, 12.5], [10.5, 12.0], [10.0, 11.5],
          [9.5, 11.0], [9.0, 10.5], [8.5, 10.0], [8.0, 9.8],
          [7.5, 9.5], [7.0, 9.3], [6.5, 9.0], [6.0, 8.8],
          [5.5, 8.5], [5.0, 8.8], [4.5, 9.0], [4.0, 9.2],
          [3.5, 9.3], [3.0, 9.4], [2.5, 9.5], [2.1, 9.6],
        ];

        L.polyline(cameroonCoords, {
          color: '#79d8b7', weight: 1.5, opacity: 0.3, dashArray: '5, 10',
        }).addTo(map);

        // City markers with departure info (hardcoded default, API data used if available)
        const cities: CityInfo[] = [
          {
            name: 'Douala', coords: [4.051, 9.767] as [number, number],
            color: '#79d8b7',
            departures: [
              { destination: 'Yaoundé', time: '06:30', company: 'OPEP Express' },
              { destination: 'Bafoussam', time: '07:15', company: 'GT Tours' },
              { destination: 'Garoua', time: '08:00', company: 'OPEP Express' },
            ],
          },
          {
            name: 'Yaoundé', coords: [3.848, 11.502] as [number, number],
            color: '#FFD54F',
            departures: [
              { destination: 'Douala', time: '06:00', company: 'OPEP Express' },
              { destination: 'Bafoussam', time: '08:30', company: 'CamRail' },
              { destination: 'Bertoua', time: '09:45', company: 'GT Tours' },
            ],
          },
          {
            name: 'Bafoussam', coords: [5.477, 10.417] as [number, number],
            color: '#E53935',
            departures: [
              { destination: 'Douala', time: '05:45', company: 'GT Tours' },
              { destination: 'Yaoundé', time: '10:00', company: 'CamRail' },
            ],
          },
          {
            name: 'Garoua', coords: [9.301, 13.398] as [number, number],
            color: '#00A37D',
            departures: [
              { destination: 'Maroua', time: '07:00', company: 'OPEP Express' },
              { destination: 'Ngaoundéré', time: '11:30', company: 'GT Tours' },
            ],
          },
          {
            name: 'Maroua', coords: [10.588, 14.324] as [number, number],
            color: '#FFB3AE',
            departures: [
              { destination: 'Garoua', time: '06:15', company: 'CamRail' },
            ],
          },
          {
            name: 'Bamenda', coords: [5.959, 10.145] as [number, number],
            color: '#E5C07B',
            departures: [
              { destination: 'Douala', time: '06:00', company: 'OPEP Express' },
              { destination: 'Bafoussam', time: '09:30', company: 'GT Tours' },
            ],
          },
          {
            name: 'Bertoua', coords: [4.577, 13.683] as [number, number],
            color: '#7B9FEF',
            departures: [
              { destination: 'Yaoundé', time: '07:30', company: 'CamRail' },
            ],
          },
          {
            name: 'Ngaoundéré', coords: [7.317, 13.584] as [number, number],
            color: '#C678DD',
            departures: [
              { destination: 'Garoua', time: '08:00', company: 'GT Tours' },
            ],
          },
        ];

        cities.forEach((city) => {
          const icon = L.divIcon({
            className: 'city-marker',
            html: `<div style="width:14px;height:14px;border-radius:50%;background:#1e2023;border:2.5px solid ${city.color};box-shadow:0 0 16px ${city.color}40;display:flex;align-items:center;justify-content:center">
              <div style="width:6px;height:6px;border-radius:50%;background:${city.color}"></div>
            </div>
            <div style="position:absolute;top:18px;left:50%;transform:translateX(-50%);font-size:10px;color:#e2e2e6;font-weight:700;text-shadow:0 1px 6px rgba(0,0,0,0.9);white-space:nowrap;letter-spacing:0.03em">${city.name}</div>`,
            iconSize: [14, 14],
            iconAnchor: [7, 7],
          });
          const marker = L.marker(city.coords, { icon })
            .bindTooltip(
              `<div style="font-family:system-ui;padding:4px 0;text-align:center">
                <div style="font-weight:700;font-size:14px;color:#e2e2e6">${city.name}</div>
                <div style="font-size:10px;color:#bdc9c2;margin-top:2px">${city.departures.length} départs prévus</div>
              </div>`,
              { className: 'city-tooltip', offset: [0, -18], direction: 'top' },
            )
            .on('click', () => setSelectedCity(city));
          marker.addTo(map);
        });

        // Initialize marker cluster group
        const MCG = (await import('leaflet.markercluster')).default;
        const clusterGroup = L.markerClusterGroup({
          chunkedLoading: true,
          maxClusterRadius: 60,
          spiderfyOnMaxZoom: true,
          showCoverageOnHover: false,
          zoomToBoundsOnClick: true,
          disableClusteringAtZoom: 10,
          iconCreateFunction: (cluster: any) => {
            const count = cluster.getChildCount();
            const size = count < 10 ? 'small' : count < 50 ? 'medium' : 'large';
            const colors: Record<string, string> = {
              small: 'rgba(121,216,183,0.85)',
              medium: 'rgba(121,216,183,0.7)',
              large: 'rgba(121,216,183,0.5)',
            };
            const sizes: Record<string, string> = {
              small: '40px',
              medium: '48px',
              large: '56px',
            };
            return L.divIcon({
              html: `<div style="width:${sizes[size]};height:${sizes[size]};border-radius:50%;background:${colors[size]};backdrop-filter:blur(4px);border:2px solid #79d8b7;display:flex;align-items:center;justify-content:center;box-shadow:0 0 20px rgba(121,216,183,0.3)">
                <span style="color:#00382a;font-weight:800;font-size:${size === 'small' ? '13px' : '15px'}">${count}</span>
              </div>`,
              className: 'cluster-icon',
              iconSize: [parseInt(sizes[size]), parseInt(sizes[size])],
            });
          },
        });
        map.addLayer(clusterGroup);
        clusterGroupRef.current = clusterGroup;

        // Initialize heatmap layer (leaflet.heat augments L with heatLayer)
        await import('leaflet.heat');
        const heat = (L as any).heatLayer([], {
          radius: 30,
          blur: 20,
          maxZoom: 12,
          max: 1.0,
          gradient: { 0.0: '#00382a', 0.3: '#79d8b7', 0.6: '#FFD54F', 0.9: '#E53935' },
        });
        heatLayerRef.current = heat;

        mapRef.current = map;
        setMapReady(true);
      } catch (err) {
        console.error('[LiveMap] Failed to initialize map:', err);
      }
    };

    initMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // ── Create / Update Bus Marker ───────────────────────────────────────────

  const createBusMarker = useCallback(
    (bus: BusRecord) => {
      if (!leafletRef.current || !mapRef.current) return;
      const L = leafletRef.current;
      const statusStyle = STATUS_STYLES[bus.status] || STATUS_STYLES.moving;

      const icon = L.divIcon({
        className: 'bus-marker-container',
        html: `
          <div class="bus-marker ${bus.status}" style="
            width:44px;height:44px;border-radius:50%;
            background:rgba(17,19,22,0.9);
            border:2.5px solid ${statusStyle.color};
            display:flex;align-items:center;justify-content:center;
            box-shadow:0 0 16px rgba(0,0,0,0.6),0 0 ${statusStyle.pulse ? '20px' : '8px'} ${statusStyle.color}40;
            transition:all 0.3s ease;cursor:pointer;
            transform:rotate(${bus.heading || 0}deg);
          ">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="${statusStyle.color}">
              <path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11V6h14v5H5z"/>
            </svg>
          </div>
          ${statusStyle.pulse ? '<div class="bus-pulse" style="position:absolute;top:50%;left:50%;width:60px;height:60px;border-radius:50%;border:2px solid ' + statusStyle.color + ';opacity:0.3;animation:pulse 2s infinite;transform:translate(-50%,-50%);pointer-events:none"></div>' : ''}
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 22],
      });

      const marker = L.marker([bus.latitude, bus.longitude], { icon })
        .bindTooltip(
          `<div style="font-family:system-ui;padding:4px 0">
            <div style="font-weight:700;font-size:13px;color:#e2e2e6">${bus.plateNumber}</div>
            <div style="font-size:11px;color:#bdc9c2;margin-top:2px">${bus.route}</div>
            <div style="font-size:10px;color:${statusStyle.color};margin-top:4px;font-weight:600">
              ● ${bus.status === 'moving' ? `${bus.speed || '—'} km/h` : bus.status === 'stopped' ? "À l'arrêt" : 'Incident'}
            </div>
          </div>`,
          { className: 'bus-tooltip', offset: [0, -24], direction: 'top' },
        )
        .on('click', () => setSelectedBus(bus));

      // Add to cluster group if clustering is enabled, otherwise add directly to map
      if (useClustering && clusterGroupRef.current) {
        clusterGroupRef.current.addLayer(marker);
      } else if (mapRef.current) {
        marker.addTo(mapRef.current);
      }

      markersRef.current.set(bus.tripId, marker);
    },
    [useClustering],
  );

  const updateBusMarker = useCallback(
    (bus: BusRecord) => {
      if (!leafletRef.current) return;
      const existing = markersRef.current.get(bus.tripId);
      if (existing) {
        existing.setLatLng([bus.latitude, bus.longitude]);
        const statusStyle = STATUS_STYLES[bus.status] || STATUS_STYLES.moving;
        existing.setTooltipContent(
          `<div style="font-family:system-ui;padding:4px 0">
            <div style="font-weight:700;font-size:13px;color:#e2e2e6">${bus.plateNumber}</div>
            <div style="font-size:11px;color:#bdc9c2;margin-top:2px">${bus.route}</div>
            <div style="font-size:10px;color:${statusStyle.color};margin-top:4px;font-weight:600">
              ● ${bus.status === 'moving' ? `${bus.speed || '—'} km/h` : bus.status === 'stopped' ? "À l'arrêt" : 'Incident'}
            </div>
          </div>`,
        );

        const newIcon = leafletRef.current.divIcon({
          className: 'bus-marker-container',
          html: `
            <div class="bus-marker ${bus.status}" style="
              width:44px;height:44px;border-radius:50%;
              background:rgba(17,19,22,0.9);
              border:2.5px solid ${statusStyle.color};
              display:flex;align-items:center;justify-content:center;
              box-shadow:0 0 16px rgba(0,0,0,0.6),0 0 ${statusStyle.pulse ? '20px' : '8px'} ${statusStyle.color}40;
              transition:all 0.3s ease;cursor:pointer;
              transform:rotate(${bus.heading || 0}deg);
            ">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="${statusStyle.color}">
                <path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11V6h14v5H5z"/>
              </svg>
            </div>
          `,
          iconSize: [44, 44],
          iconAnchor: [22, 22],
        });
        existing.setIcon(newIcon);
      } else {
        createBusMarker(bus);
      }
    },
    [createBusMarker],
  );

  // ── Trajectory Trail (Polyline) ─────────────────────────────────────────

  const updateTrailPolyline = useCallback(
    (bus: BusRecord) => {
      if (!leafletRef.current || !mapRef.current) return;
      const L = leafletRef.current;
      const map = mapRef.current;
      const existingPoly = trailPolylinesRef.current.get(bus.tripId);
      const statusStyle = STATUS_STYLES[bus.status] || STATUS_STYLES.moving;

      if (bus.trail.length < 2) return;

      if (existingPoly) {
        existingPoly.setLatLngs(bus.trail);
      } else {
        const polyline = L.polyline(bus.trail, {
          color: statusStyle.color,
          weight: 2,
          opacity: 0.5,
          dashArray: '6, 4',
          smoothFactor: 1,
        }).addTo(map);
        trailPolylinesRef.current.set(bus.tripId, polyline);

        // Animate dash offset for moving effect
        let offset = 0;
        const animate = () => {
          offset = (offset + 1) % 10;
          polyline.setStyle({ dashOffset: String(-offset) });
        };
        const timer = setInterval(animate, 150);
        (polyline as any)._trailTimer = timer;
      }
    },
    [],
  );

  // ── Clean up trail polylines when trails are toggled off ───────────────

  useEffect(() => {
    if (!leafletRef.current || !mapRef.current) return;

    if (!showTrails) {
      trailPolylinesRef.current.forEach((polyline, _tripId) => {
        if ((polyline as any)._trailTimer) {
          clearInterval((polyline as any)._trailTimer);
        }
        polyline.remove();
      });
      trailPolylinesRef.current.clear();
    }
  }, [showTrails]);

  // ── Subscribe to trips & create initial markers ──────────────────────────

  useEffect(() => {
    if (!socketRef.current?.connected || !mapReady) return;

    const fetchTrips = async () => {
      try {
        const token =
          typeof window !== 'undefined'
            ? localStorage.getItem('opep_token') || localStorage.getItem('token')
            : null;

        const res = await fetch(`${API_BASE}/trips/available`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Failed to fetch trips');

        const trips: any[] = await res.json();
        const tripList = (trips as any).data || trips;

        setActiveTrips(tripList.length);

        tripList.forEach((trip: any) => {
          subscribeToTrip(trip.id);
          const route = trip.route || {};
          setBuses((prev) => {
            if (prev.find((b) => b.tripId === trip.id)) return prev;
            const newBus: BusRecord = {
              id: trip.bus?.id || trip.id,
              tripId: trip.id,
              plateNumber: trip.bus?.plateNumber || `Bus ${trip.id.slice(0, 4)}`,
              route: `${route.departureCity || '?'} → ${route.arrivalCity || '?'}`,
              latitude: 4.051 + Math.random() * 2 - 1,
              longitude: 9.767 + Math.random() * 3 - 1.5,
              status: 'stopped',
              lastUpdated: new Date(),
              trail: [],
            };
            // Create marker for initial position
            setTimeout(() => createBusMarker(newBus), 50);
            return [...prev, newBus];
          });
        });
      } catch (err) {
        console.warn('[LiveMap] Could not fetch trips, using fallback:', err);
        const mockTrips = [
          { id: 'mock-1', plate: 'LT 492 CA', route: 'Douala → Yaoundé' },
          { id: 'mock-2', plate: 'CE 881 AB', route: 'Yaoundé → Bafoussam' },
          { id: 'mock-3', plate: 'LT 503 EF', route: 'Douala → Garoua' },
          { id: 'mock-4', plate: 'NW 234 XZ', route: 'Bamenda → Douala' },
        ];
        setActiveTrips(mockTrips.length);
        mockTrips.forEach((trip) => {
          subscribeToTrip(trip.id);
          setBuses((prev) => {
            if (prev.find((b) => b.tripId === trip.id)) return prev;
            const newBus: BusRecord = {
              id: trip.id,
              tripId: trip.id,
              plateNumber: trip.plate,
              route: trip.route,
              latitude: 4.5 + Math.random() * 3,
              longitude: 10.0 + Math.random() * 2,
              status: 'stopped',
              lastUpdated: new Date(),
              trail: [],
            };
            setTimeout(() => createBusMarker(newBus), 50);
            return [...prev, newBus];
          });
        });
      }
    };

    fetchTrips();
  }, [mapReady, connected, subscribeToTrip, createBusMarker]);

  // ── Simulate bus movement ───────────────────────────────────────────────

  useEffect(() => {
    if (buses.length === 0) return;

    const interval = setInterval(() => {
      setBuses((prev) =>
        prev.map((bus) => {
          if (Math.random() > 0.3) return bus;

          const newLat = bus.latitude + (Math.random() - 0.5) * 0.02;
          const newLng = bus.longitude + (Math.random() - 0.5) * 0.02;
          const speed = Math.floor(Math.random() * 80) + 20;
          const heading = Math.floor(Math.random() * 360);

          const updated: BusRecord = {
            ...bus,
            latitude: newLat,
            longitude: newLng,
            speed,
            heading,
            status: speed > 0 ? 'moving' : 'stopped',
            lastUpdated: new Date(),
            trail: [...bus.trail, [newLat, newLng] as [number, number]].slice(-MAX_TRAIL_LENGTH),
          };

          updateBusMarker(updated);
          updateTrailPolyline(updated);
          return updated;
        }),
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [buses.length, updateBusMarker, updateTrailPolyline]);

  // ── Update heatmap when buses change ──────────────────────────────────

  useEffect(() => {
    if (!leafletRef.current || !mapRef.current || !heatLayerRef.current) return;

    const heatData = buses.map((bus) => [
      bus.latitude,
      bus.longitude,
      bus.status === 'moving' ? 0.8 : bus.status === 'stopped' ? 0.5 : 1.0,
    ] as [number, number, number]);

    heatLayerRef.current.setLatLngs(heatData);

    if (showHeatmap && !mapRef.current.hasLayer(heatLayerRef.current)) {
      mapRef.current.addLayer(heatLayerRef.current);
    } else if (!showHeatmap && mapRef.current.hasLayer(heatLayerRef.current)) {
      mapRef.current.removeLayer(heatLayerRef.current);
    }
  }, [buses, showHeatmap]);

  // ── Toggle clustering (re-add all markers to new group) ────────────────

  useEffect(() => {
    if (!leafletRef.current || !mapRef.current || !clusterGroupRef.current) return;
    const L = leafletRef.current;
    const map = mapRef.current;

    // Move all markers to/from cluster group
    markersRef.current.forEach((marker, tripId) => {
      if (!marker) return;

      if (useClustering) {
        if (map.hasLayer(marker)) map.removeLayer(marker);
        if (!clusterGroupRef.current.hasLayer(marker)) {
          clusterGroupRef.current.addLayer(marker);
        }
      } else {
        if (clusterGroupRef.current.hasLayer(marker)) {
          clusterGroupRef.current.removeLayer(marker);
        }
        if (!map.hasLayer(marker)) map.addLayer(marker);
      }
    });
  }, [useClustering]);

  // ── Filtered buses ─────────────────────────────────────────────────────

  const filteredBuses = useMemo(() => {
    if (!searchFilter.trim()) return buses;
    const q = searchFilter.toLowerCase();
    return buses.filter(
      (b) =>
        b.plateNumber.toLowerCase().includes(q) ||
        b.route.toLowerCase().includes(q) ||
        b.tripId.toLowerCase().includes(q),
    );
  }, [buses, searchFilter]);

  // ── Apply search filter to markers ─────────────────────────────────────

  useEffect(() => {
    if (!leafletRef.current) return;

    // Show/hide markers based on filter
    buses.forEach((bus) => {
      const marker = markersRef.current.get(bus.tripId);
      if (!marker) return;

      const isVisible =
        !searchFilter.trim() ||
        bus.plateNumber.toLowerCase().includes(searchFilter.toLowerCase()) ||
        bus.route.toLowerCase().includes(searchFilter.toLowerCase()) ||
        bus.tripId.toLowerCase().includes(searchFilter.toLowerCase());
      if (isVisible) {
        if (useClustering && clusterGroupRef.current) {
          if (!clusterGroupRef.current.hasLayer(marker)) {
            clusterGroupRef.current.addLayer(marker);
          }
        } else if (mapRef.current) {
          if (!mapRef.current.hasLayer(marker)) {
            mapRef.current.addLayer(marker);
          }
        }
      } else {
        if (clusterGroupRef.current && clusterGroupRef.current.hasLayer(marker)) {
          clusterGroupRef.current.removeLayer(marker);
        }
        if (mapRef.current && mapRef.current.hasLayer(marker)) {
          mapRef.current.removeLayer(marker);
        }
      }
    });
  }, [searchFilter, useClustering, buses]);

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="relative w-full h-[600px] bg-surface_dim rounded-[32px] border-2 border-charcoal_border overflow-hidden shadow-2xl group">
      {/* Leaflet Map Container */}
      <div ref={mapContainerRef} className="absolute inset-0 z-0" />

      {/* Top Overlay: Stats + Controls */}
      <div className="absolute top-6 left-6 right-6 z-10 flex justify-between items-start pointer-events-none">
        <div className="flex flex-col gap-2 pointer-events-auto">
          {/* Connection Status */}
          <div className="bg-surface_container/90 backdrop-blur-md border border-charcoal_border p-3 px-4 rounded-2xl shadow-xl flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
              connected ? 'bg-success_green/20 text-success_green' : 'bg-error_red/20 text-error_red'
            }`}>
              <Signal size={18} className={connected ? 'animate-pulse' : ''} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-on_surface_variant uppercase tracking-widest">
                {connected ? 'GPS Connecté' : 'Déconnecté'}
              </p>
              <p className="text-[13px] font-bold text-on_surface">{activeTrips} TRAJETS ACTIFS</p>
            </div>
          </div>

          {/* Online Count */}
          <div className="bg-surface_container/90 backdrop-blur-md border border-charcoal_border p-3 px-4 rounded-2xl shadow-xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <BusIcon size={18} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-on_surface_variant uppercase tracking-widest">Bus en ligne</p>
              <p className="text-[13px] font-bold text-on_surface">{buses.length} CONNECTÉS</p>
            </div>
          </div>

          {/* Search Filter */}
          <div className="relative">
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filtrer par plaque ou trajet..."
              className="w-full bg-surface_container/90 backdrop-blur-md border border-charcoal_border rounded-xl px-3 py-2.5 pl-9 text-[11px] font-medium text-on_surface placeholder:text-on_surface_variant/50 focus:outline-none focus:border-primary/50 transition-all"
            />
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-on_surface_variant/60"
            />
            {searchFilter && (
              <button
                onClick={() => setSearchFilter('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on_surface_variant/50 hover:text-on_surface transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Results count */}
          {searchFilter && (
            <div className="px-1 text-[10px] font-bold text-on_surface_variant">
              {filteredBuses.length} / {buses.length} bus correspondent
            </div>
          )}

          {/* Toggle Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowTrails((v) => !v)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all ${
                showTrails
                  ? 'bg-primary/20 border-primary/40 text-primary'
                  : 'bg-surface_container/60 border-charcoal_border text-on_surface_variant hover:border-primary/30'
              }`}
              title="Afficher la trajectoire"
            >
              <TrajectoryIcon size={14} />
              Trajectoire
            </button>
            <button
              onClick={() => setUseClustering((v) => !v)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all ${
                useClustering
                  ? 'bg-primary/20 border-primary/40 text-primary'
                  : 'bg-surface_container/60 border-charcoal_border text-on_surface_variant hover:border-primary/30'
              }`}
              title="Grouper les bus proches"
            >
              <ClusterIcon size={14} />
              Cluster
            </button>
            <button
              onClick={() => setShowHeatmap((v) => !v)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all ${
                showHeatmap
                  ? 'bg-primary/20 border-primary/40 text-primary'
                  : 'bg-surface_container/60 border-charcoal_border text-on_surface_variant hover:border-primary/30'
              }`}
              title="Afficher la carte de chaleur"
            >
              <ClusterIcon size={14} />
              Heatmap
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2 pointer-events-auto">
          {wsError && (
            <div className="bg-error_red/90 backdrop-blur-md border border-error_red p-2.5 px-3 rounded-xl shadow-xl text-[10px] font-bold text-white max-w-[180px]">
              ⚠ {wsError}
            </div>
          )}
          <button
            onClick={() => {
              if (mapRef.current) {
                mapRef.current.flyTo(CAMEROON_CENTER, DEFAULT_ZOOM, { duration: 1.5 });
              }
            }}
            className="bg-primary text-on_primary p-2.5 rounded-xl shadow-lg shadow-primary/20 hover:scale-110 transition-all active:scale-95"
            title="Recentrer la carte"
          >
            <Zap size={20} />
          </button>
        </div>
      </div>

      {/* Bottom: Legend */}
      <div className="absolute bottom-6 left-6 z-10 pointer-events-auto">
        <div className="bg-surface_container_lowest/90 backdrop-blur-md border border-charcoal_border px-4 py-3 rounded-2xl shadow-2xl flex gap-5 items-center">
          <LegendItem color="bg-[#79d8b7]" label="En mouvement" />
          <LegendItem color="bg-[#FFD54F]" label="À l'arrêt" />
          <LegendItem color="bg-[#E53935]" label="Incident" />
        </div>
      </div>

      {/* Selected City Info Panel */}
      {selectedCity && (
        <div className="absolute bottom-6 right-6 z-10 pointer-events-auto w-72">
          <div className="bg-surface_container/95 backdrop-blur-md border border-charcoal_border p-5 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-primary" />
                <h4 className="font-bold text-on_surface">{selectedCity.name}</h4>
              </div>
              <button
                onClick={() => setSelectedCity(null)}
                className="text-on_surface_variant hover:text-on_surface transition-colors text-lg"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3">
              <p className="text-[11px] font-bold text-on_surface_variant uppercase tracking-widest">
                Prochains départs
              </p>
              {selectedCity.departures.length === 0 ? (
                <p className="text-[12px] text-on_surface_variant italic">Aucun départ prévu</p>
              ) : (
                selectedCity.departures.map((dep, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-surface_container/50 border border-charcoal_border/50"
                  >
                    <div>
                      <p className="text-[12px] font-bold text-on_surface">{dep.destination}</p>
                      <p className="text-[10px] text-on_surface_variant">{dep.company}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-primary">
                      <Clock size={12} />
                      <span className="text-[11px] font-bold">{dep.time}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Selected Bus Info Panel */}
      {selectedBus && (
        <div className="absolute bottom-6 right-6 z-10 pointer-events-auto w-72">
          <div className="bg-surface_container/95 backdrop-blur-md border border-charcoal_border p-5 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-on_surface">{selectedBus.plateNumber}</h4>
              <button
                onClick={() => setSelectedBus(null)}
                className="text-on_surface_variant hover:text-on_surface transition-colors text-lg"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2 text-[12px]">
              <InfoRow label="Trajet" value={selectedBus.route} />
              <InfoRow label="Vitesse" value={`${selectedBus.speed || '—'} km/h`} highlight="text-primary" />
              <InfoRow label="Cap" value={`${selectedBus.heading ?? '—'}°`} />
              <div className="flex justify-between">
                <span className="text-on_surface_variant">Statut</span>
                <span className={`font-bold ${
                  selectedBus.status === 'moving' ? 'text-primary' :
                  selectedBus.status === 'stopped' ? 'text-warning_yellow' : 'text-error_red'
                }`}>
                  {selectedBus.status === 'moving' ? 'En mouvement' :
                   selectedBus.status === 'stopped' ? "À l'arrêt" : 'Incident'}
                </span>
              </div>
              <InfoRow label="Mise à jour" value={selectedBus.lastUpdated.toLocaleTimeString()} />
              <InfoRow
                label="Trajectoire"
                value={`${selectedBus.trail.length} points`}
                highlight="text-on_surface_variant"
              />
            </div>
          </div>
        </div>
      )}

      {/* Styles */}
      <style jsx>{`
        @keyframes pulse {
          0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.3; }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0; }
          100% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.3; }
        }
        :global(.bus-tooltip) {
          background: rgba(17,19,22,0.95) !important;
          border: 1px solid #2D343F !important;
          border-radius: 12px !important;
          padding: 8px 12px !important;
          box-shadow: 0 4px 20px rgba(0,0,0,0.5) !important;
        }
        :global(.bus-tooltip .leaflet-tooltip-tip) {
          border-top-color: #2D343F !important;
        }
        :global(.leaflet-control-zoom a) {
          background: rgba(30,32,35,0.95) !important;
          color: #e2e2e6 !important;
          border-color: #2D343F !important;
        }
        :global(.leaflet-control-zoom a:hover) {
          background: rgba(40,42,45,0.95) !important;
        }
        :global(.cluster-icon) {
          background: none !important;
          border: none !important;
        }
        :global(.city-tooltip) {
          background: rgba(17,19,22,0.95) !important;
          border: 1px solid #2D343F !important;
          border-radius: 12px !important;
          padding: 8px 16px !important;
          box-shadow: 0 4px 20px rgba(0,0,0,0.5) !important;
          text-align: center !important;
        }
        :global(.city-tooltip .leaflet-tooltip-tip) {
          border-top-color: #2D343F !important;
        }
      `}</style>
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${color}`}></div>
      <span className="text-[10px] font-bold text-on_surface_variant uppercase tracking-widest">{label}</span>
    </div>
  );
}

function InfoRow({ label, value, highlight }: { label: string; value: string; highlight?: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-on_surface_variant">{label}</span>
      <span className={`font-bold text-on_surface ${highlight || ''}`}>{value}</span>
    </div>
  );
}
