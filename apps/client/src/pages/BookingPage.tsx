import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, User, CheckCircle2, AlertCircle, Loader2, Info } from 'lucide-react';
import { apiClient } from '../lib/apiClient';

interface Trip {
  id: string;
  departureCity: string;
  arrivalCity: string;
  departureTime: string;
  basePrice: number;
  availableSeats: number;
  totalSeats?: number;
  bus?: { type?: string; plateNumber?: string; totalSeats?: number };
  agency?: { name: string };
  route?: { departureCity: string; arrivalCity: string; estimatedDurationMinutes?: number };
}

type Step = 1 | 2 | 3;

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [step, setStep] = useState<Step>(1);
  const [passengers, setPassengers] = useState<{ firstName: string; lastName: string; seatNumber: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);
  const [occupiedSeats, setOccupiedSeats] = useState<number[]>([]);

  const totalSeats = trip?.bus?.totalSeats || trip?.totalSeats || 70;

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    apiClient.getTrip(id)
      .then(data => {
        setTrip(data as any);
        // Simulate occupied seats based on availableSeats
        const total = (data as any).bus?.totalSeats || (data as any).totalSeats || 70;
        const occupiedCount = total - ((data as any).availableSeats || 0);
        const occupied = Array.from({ length: total }, (_, i) => i + 1)
          .sort(() => Math.random() - 0.5)
          .slice(0, occupiedCount);
        setOccupiedSeats(occupied);
      })
      .catch(err => setError(err.message || 'Erreur de chargement'))
      .finally(() => setLoading(false));
  }, [id]);

  const toggleSeat = (seat: number) => {
    if (occupiedSeats.includes(seat)) return;
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seat));
    } else if (selectedSeats.length < 5) {
      setSelectedSeats([...selectedSeats, seat].sort((a, b) => a - b));
    }
  };

  const handleContinueToPassengers = () => {
    if (selectedSeats.length === 0) return;
    setStep(2);
  };

  const handleContinueToPayment = () => {
    const allFilled = passengers.every(p => p.firstName && p.lastName);
    if (!allFilled) return;
    // Fill empty passenger forms
    const updatedPassengers = selectedSeats.map((seat, i) => 
      passengers[i] || { firstName: '', lastName: '', seatNumber: String(seat) }
    );
    setPassengers(updatedPassengers);
    if (updatedPassengers.some(p => !p.firstName || !p.lastName)) return;
    setStep(3);
  };

  const handleBook = async () => {
    if (!trip) return;
    setSubmitting(true);
    try {
      const reservation = await apiClient.createReservation({
        tripId: trip.id,
        passengers: selectedSeats.map((seat, i) => ({
          firstName: passengers[i]?.firstName || 'Passager',
          lastName: passengers[i]?.lastName || String(i + 1),
          seatNumber: String(seat),
        })),
      });
      setBookingSuccess(reservation.id || reservation.reservationCode);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la réservation');
      setStep(1);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={48} className="text-opep-blue animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-bold">Chargement du trajet...</p>
        </div>
      </div>
    );
  }

  if (error && !trip) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-sm">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-bold mb-4">{error}</p>
          <button onClick={() => navigate(-1)} className="bg-opep-blue text-white px-6 py-2 rounded-xl font-bold">Retour</button>
        </div>
      </div>
    );
  }

  if (bookingSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-10 rounded-3xl shadow-xl border border-gray-100 max-w-sm">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Réservation créée !</h2>
          <p className="text-gray-500 mb-8">Paiement en attente. Confirmez pour recevoir votre ticket.</p>
          <Link 
            to={`/payment?reservationId=${bookingSuccess}`}
            className="block w-full bg-opep-orange text-white py-4 rounded-xl font-bold shadow-lg hover:bg-orange-600 transition mb-3"
          >
            Payer maintenant
          </Link>
          <button onClick={() => navigate('/')} className="text-gray-500 text-sm font-medium hover:underline">Retour à l'accueil</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-opep-blue text-white p-4 sticky top-0 z-10 shadow-md">
        <div className="container mx-auto flex items-center">
          <button onClick={() => navigate(-1)} className="mr-4 hover:bg-white/20 p-2 rounded-full transition">
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1">
            <h2 className="text-lg font-bold">Sélection des places</h2>
            <p className="text-xs opacity-80">{trip?.bus?.type || 'Bus'} • {trip?.agency?.name || 'OPEP'}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-6 max-w-4xl">
        <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-xl shadow-sm">
          {[
            { num: 1, label: 'Places' },
            { num: 2, label: 'Passagers' },
            { num: 3, label: 'Paiement' },
          ].map((s, i) => (
            <React.Fragment key={s.num}>
              <div className={`flex items-center ${step >= s.num ? 'text-opep-blue' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mr-2 ${step >= s.num ? 'bg-blue-100' : 'bg-gray-100'}`}>{s.num}</div>
                <span className="text-xs font-bold uppercase tracking-wider">{s.label}</span>
              </div>
              {i < 2 && <div className="flex-1 h-px bg-gray-200 mx-4"></div>}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="mb-8 flex justify-center space-x-6">
                  <div className="flex items-center text-xs font-bold text-gray-500">
                    <div className="w-4 h-4 bg-gray-100 border border-gray-200 rounded mr-2"></div> Libre
                  </div>
                  <div className="flex items-center text-xs font-bold text-gray-500">
                    <div className="w-4 h-4 bg-gray-400 rounded mr-2"></div> Occupé
                  </div>
                  <div className="flex items-center text-xs font-bold text-gray-500">
                    <div className="w-4 h-4 bg-opep-orange rounded mr-2"></div> Sélectionné
                  </div>
                </div>
                <div className="relative border-4 border-gray-100 rounded-[3rem] p-6 pt-20">
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-2 bg-gray-100 rounded-full"></div>
                  <div className="grid grid-cols-4 gap-3">
                    {Array.from({ length: totalSeats }, (_, i) => i + 1).map((seat) => (
                      <button
                        key={seat}
                        onClick={() => toggleSeat(seat)}
                        disabled={occupiedSeats.includes(seat)}
                        className={`h-10 rounded-lg text-xs font-bold transition-all ${
                          occupiedSeats.includes(seat) ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 
                          selectedSeats.includes(seat) ? 'bg-opep-orange text-white shadow-md scale-110' : 
                          'bg-gray-100 text-gray-600 hover:border-opep-blue border-2 border-transparent'
                        }`}
                      >
                        {seat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                <h3 className="font-bold text-gray-900">Informations des passagers</h3>
                {selectedSeats.map((seat, i) => (
                  <div key={seat} className="flex items-center space-x-3 bg-gray-50 p-4 rounded-xl">
                    <div className="w-8 h-8 bg-opep-blue text-white rounded-lg flex items-center justify-center text-xs font-black">
                      {seat}
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Prénom"
                        className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-opep-blue focus:border-opep-blue"
                        value={passengers[i]?.firstName || ''}
                        onChange={(e) => {
                          const newPassengers = [...passengers];
                          newPassengers[i] = { ...newPassengers[i], firstName: e.target.value, seatNumber: String(seat) };
                          setPassengers(newPassengers);
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Nom"
                        className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-opep-blue focus:border-opep-blue"
                        value={passengers[i]?.lastName || ''}
                        onChange={(e) => {
                          const newPassengers = [...passengers];
                          newPassengers[i] = { ...newPassengers[i], lastName: e.target.value, seatNumber: String(seat) };
                          setPassengers(newPassengers);
                        }}
                      />
                    </div>
                  </div>
                ))}
                <div className="flex items-center space-x-2 text-xs text-gray-400 p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <Info size={14} className="flex-shrink-0 text-opep-blue" />
                  <span>Les noms doivent correspondre aux pièces d'identité.</span>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Confirmation</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Trajet</span>
                    <span className="font-bold">{trip?.departureCity || '?'} → {trip?.arrivalCity || '?'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Places</span>
                    <span className="font-bold text-opep-blue">{selectedSeats.join(', ')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Passagers</span>
                    <span className="font-bold">{selectedSeats.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Prix unitaire</span>
                    <span className="font-bold">{new Intl.NumberFormat('fr-FR').format(trip?.basePrice || 0)} FCFA</span>
                  </div>
                  <div className="pt-3 border-t flex justify-between">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="text-xl font-black text-opep-orange">
                      {new Intl.NumberFormat('fr-FR').format(selectedSeats.length * (trip?.basePrice || 0))} FCFA
                    </span>
                  </div>
                </div>
                {error && (
                  <div className="mt-4 bg-red-50 p-3 rounded-xl flex items-center text-red-600 text-xs font-bold border border-red-100">
                    <AlertCircle size={14} className="mr-2 flex-shrink-0" />{error}
                  </div>
                )}
                <button
                  onClick={handleBook}
                  disabled={submitting}
                  className="w-full mt-6 bg-opep-blue text-white py-4 rounded-xl font-bold shadow-lg hover:bg-blue-800 transition flex items-center justify-center disabled:opacity-70"
                >
                  {submitting ? <Loader2 size={20} className="animate-spin mr-2" /> : null}
                  {submitting ? 'Réservation...' : 'Confirmer la réservation'}
                </button>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4 pb-4 border-b">Résumé</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Places</span>
                  <span className="font-bold text-opep-blue">
                    {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'Aucune'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Prix unitaire</span>
                  <span className="font-bold">{new Intl.NumberFormat('fr-FR').format(trip?.basePrice || 0)} FCFA</span>
                </div>
                <div className="pt-3 border-t flex justify-between">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-xl font-black text-opep-orange">
                    {new Intl.NumberFormat('fr-FR').format(selectedSeats.length * (trip?.basePrice || 0))} FCFA
                  </span>
                </div>
              </div>

              {step === 1 && (
                <>
                  {selectedSeats.length === 0 ? (
                    <div className="bg-orange-50 p-3 rounded-lg flex items-center mb-6">
                      <AlertCircle size={18} className="text-opep-orange mr-2" />
                      <p className="text-[10px] text-orange-800 font-bold uppercase">Sélectionnez au moins une place</p>
                    </div>
                  ) : (
                    <div className="bg-green-50 p-3 rounded-lg flex items-center mb-6">
                      <CheckCircle2 size={18} className="text-green-600 mr-2" />
                      <p className="text-[10px] text-green-800 font-bold uppercase">Prêt à continuer</p>
                    </div>
                  )}
                  <button
                    disabled={selectedSeats.length === 0}
                    onClick={handleContinueToPassengers}
                    className={`w-full py-4 rounded-xl font-bold transition shadow-lg ${
                      selectedSeats.length > 0 ? 'bg-opep-blue text-white hover:bg-blue-800' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Continuer
                  </button>
                </>
              )}

              {step === 2 && (
                <button
                  onClick={handleContinueToPayment}
                  className="w-full py-4 bg-opep-blue text-white rounded-xl font-bold hover:bg-blue-800 transition shadow-lg"
                >
                  Valider les passagers
                </button>
              )}

              <p className="text-center mt-4 text-[10px] text-gray-400">
                En continuant, vous acceptez les <br />
                <a href="#" className="underline">Conditions Générales de Vente</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
