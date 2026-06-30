import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Share2, MapPin, Calendar, Clock, Ticket as TicketIcon, Loader2, AlertCircle } from 'lucide-react';
import QRCode from 'qrcode';
import { apiClient } from '../lib/apiClient';

const TicketPage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [ticket, setTicket] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchTicket = async () => {
      if (!id) return;
      try {
        const data = await apiClient.getTicket(id);
        setTicket(data);
        setError(null);

        // Generate QR code from ticket data
        if (data.qrPayload && data.qrSignature) {
          const qrString = `${data.qrPayload}.${data.qrSignature}`;
          const qrUrl = await QRCode.toDataURL(qrString, {
            width: 300,
            margin: 2,
            color: { dark: '#1e293b', light: '#ffffff' },
          });
          setQrDataUrl(qrUrl);
        }
      } catch (err: any) {
        // Fallback: use demo data
        setError(err.message || 'Ticket introuvable');
        setTicket({
          id: 'demo',
          passenger: { firstName: 'Adrian', lastName: 'Doe' },
          reservation: {
            reservationCode: 'OP-99238',
            trip: {
              departureDateTime: new Date(),
              route: { departureCity: 'Yaounde', arrivalCity: 'Douala' },
            },
          },
          validUntil: new Date(Date.now() + 86400000).toISOString(),
        });
        
        // Generate demo QR
        const demoQr = await QRCode.toDataURL('opep-demo-ticket', {
          width: 300, margin: 2,
          color: { dark: '#1e293b', light: '#ffffff' },
        });
        setQrDataUrl(demoQr);
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [id]);

  const handleDownload = async () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.download = `ticket-${id || 'opep'}.png`;
    link.href = qrDataUrl;
    link.click();
  };

  const handleShare = async () => {
    if (!qrDataUrl) return;
    try {
      const blob = await (await fetch(qrDataUrl)).blob();
      const file = new File([blob], `ticket-${id || 'opep'}.png`, { type: 'image/png' });
      await navigator.share({ title: 'Mon ticket OPEP', files: [file] });
    } catch {
      // Fallback: copy ticket URL
      navigator.clipboard?.writeText(window.location.href);
      alert('Lien du ticket copie dans le presse-papier');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={48} className="text-opep-blue animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-bold">Chargement du ticket...</p>
        </div>
      </div>
    );
  }

  const passengerName = ticket?.passenger 
    ? `${ticket.passenger.firstName} ${ticket.passenger.lastName}`
    : 'Adrian Doe';
  const reservationCode = ticket?.reservation?.reservationCode || ticket?.reservationCode || '#OP-99238';
  const route = ticket?.reservation?.trip?.route || {};
  const departureCity = route.departureCity || 'Yaounde';
  const arrivalCity = route.arrivalCity || 'Douala';
  const departureTime = ticket?.reservation?.trip?.departureDateTime
    ? new Date(ticket.reservation.trip.departureDateTime)
    : new Date();

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="bg-opep-blue text-white p-4">
        <div className="container mx-auto flex items-center">
          <Link to="/" className="mr-4 hover:bg-white/20 p-2 rounded-full transition">
            <ArrowLeft size={24} />
          </Link>
          <h2 className="text-lg font-bold">Mon Ticket</h2>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8 max-w-md">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center space-x-3 mb-6 border border-red-100">
            <AlertCircle size={20} />
            <span className="text-sm font-bold">{error}</span>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          {/* Top Info */}
          <div className="bg-opep-blue/5 p-6 border-b border-dashed border-gray-200 relative">
            <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-gray-50 rounded-full"></div>
            <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-gray-50 rounded-full"></div>
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Passager</p>
                <h3 className="font-bold text-gray-900">{passengerName}</h3>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Ref. Voyage</p>
                <h3 className="font-bold text-opep-blue">{reservationCode}</h3>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-2xl font-black text-gray-900 leading-none">{departureCity}</h4>
                <p className="text-xs text-gray-400 font-medium">Depart</p>
              </div>
              <div className="flex-1 flex flex-col items-center px-4">
                <div className="w-full h-px bg-opep-blue/20 relative">
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 bg-white px-2">
                    <TicketIcon size={14} className="text-opep-blue" />
                  </div>
                </div>
              </div>
              <div className="text-right">
                <h4 className="text-2xl font-black text-gray-900 leading-none">{arrivalCity}</h4>
                <p className="text-xs text-gray-400 font-medium">Arrivee</p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-start">
                <Calendar size={18} className="text-opep-blue mr-3 mt-0.5" />
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">Date</p>
                  <p className="text-sm font-bold text-gray-900">
                    {departureTime.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Clock size={18} className="text-opep-blue mr-3 mt-0.5" />
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">Heure</p>
                  <p className="text-sm font-bold text-gray-900">
                    {departureTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin size={18} className="text-opep-blue mr-3 mt-0.5" />
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">Siege</p>
                  <p className="text-sm font-bold text-gray-900">
                    {ticket?.passenger?.seatNumber || 'VIP - 24'}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin size={18} className="text-opep-blue mr-3 mt-0.5" />
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">Agence</p>
                  <p className="text-sm font-bold text-gray-900">{ticket?.agency?.name || 'Finexs'}</p>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="bg-gray-50 rounded-3xl p-8 flex flex-col items-center border border-gray-100">
              {qrDataUrl ? (
                <div className="w-48 h-48 bg-white p-3 rounded-2xl shadow-sm border border-gray-200 mb-4">
                  <img src={qrDataUrl} alt="QR Code ticket" className="w-full h-full" />
                </div>
              ) : (
                <div className="w-48 h-48 bg-white p-4 rounded-2xl shadow-sm border border-gray-200 mb-4 flex items-center justify-center">
                  <Loader2 size={32} className="text-gray-300 animate-spin" />
                </div>
              )}
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Scannez pour valider</p>
            </div>
          </div>

          <div className="p-4 bg-gray-50 flex gap-2">
            <button 
              onClick={handleDownload}
              className="flex-1 bg-white text-gray-700 py-3 rounded-xl font-bold text-sm flex items-center justify-center border hover:bg-gray-100 transition"
            >
              <Download size={18} className="mr-2" /> PDF
            </button>
            <button 
              onClick={handleShare}
              className="flex-1 bg-white text-gray-700 py-3 rounded-xl font-bold text-sm flex items-center justify-center border hover:bg-gray-100 transition"
            >
              <Share2 size={18} className="mr-2" /> Partager
            </button>
          </div>
        </div>
        
        <p className="text-center mt-8 text-[10px] text-gray-400 leading-relaxed uppercase font-bold tracking-wider">
          Ce ticket est personnel. <br /> Presentez une piece d'identite a l'embarquement.
        </p>
      </div>
    </div>
  );
};

export default TicketPage;
