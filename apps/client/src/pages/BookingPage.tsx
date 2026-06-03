import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, User, CheckCircle2, AlertCircle } from 'lucide-react';

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [step, setStep] = useState(1); // 1: Seats, 2: Passengers, 3: Payment

  const totalSeats = 70;
  const occupiedSeats = [1, 5, 12, 13, 22, 45, 46, 60];

  const toggleSeat = (seat: number) => {
    if (occupiedSeats.includes(seat)) return;
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seat));
    } else {
      if (selectedSeats.length < 5) {
        setSelectedSeats([...selectedSeats, seat]);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-opep-blue text-white p-4 sticky top-0 z-10 shadow-md">
        <div className="container mx-auto flex items-center">
          <button onClick={() => navigate(-1)} className="mr-4 hover:bg-white/20 p-2 rounded-full transition">
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1">
            <h2 className="text-lg font-bold">Sélection des places</h2>
            <p className="text-xs opacity-80">Bus VIP • Finexs Voyages</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-6 max-w-4xl">
        {/* Progress Stepper */}
        <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-xl shadow-sm">
          <div className={`flex items-center ${step >= 1 ? 'text-opep-blue' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mr-2 ${step >= 1 ? 'bg-blue-100' : 'bg-gray-100'}`}>1</div>
            <span className="text-xs font-bold uppercase tracking-wider">Places</span>
          </div>
          <div className="flex-1 h-px bg-gray-200 mx-4"></div>
          <div className={`flex items-center ${step >= 2 ? 'text-opep-blue' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mr-2 ${step >= 2 ? 'bg-blue-100' : 'bg-gray-100'}`}>2</div>
            <span className="text-xs font-bold uppercase tracking-wider">Passagers</span>
          </div>
          <div className="flex-1 h-px bg-gray-200 mx-4"></div>
          <div className={`flex items-center ${step >= 3 ? 'text-opep-blue' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mr-2 ${step >= 3 ? 'bg-blue-100' : 'bg-gray-100'}`}>3</div>
            <span className="text-xs font-bold uppercase tracking-wider">Paiement</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Seat Map */}
          <div className="lg:col-span-2">
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

              {/* Bus Layout */}
              <div className="relative border-4 border-gray-100 rounded-[3rem] p-6 pt-20">
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-2 bg-gray-100 rounded-full"></div>
                <div className="grid grid-cols-4 gap-3">
                  {Array.from({ length: totalSeats }, (_, i) => i + 1).map((seat) => (
                    <button
                      key={seat}
                      onClick={() => toggleSeat(seat)}
                      disabled={occupiedSeats.includes(seat)}
                      className={`
                        h-10 rounded-lg text-xs font-bold transition-all
                        ${occupiedSeats.includes(seat) ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 
                          selectedSeats.includes(seat) ? 'bg-opep-orange text-white shadow-md scale-110' : 
                          'bg-gray-100 text-gray-600 hover:border-opep-blue border-2 border-transparent'}
                      `}
                    >
                      {seat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Summary Card */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4 pb-4 border-b">Résumé de la commande</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Places sélectionnées</span>
                  <span className="font-bold text-opep-blue">
                    {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'Aucune'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tarif unitaire</span>
                  <span className="font-bold">3 000 FCFA</span>
                </div>
                <div className="pt-3 border-t flex justify-between">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-xl font-black text-opep-orange">
                    {selectedSeats.length * 3000} FCFA
                  </span>
                </div>
              </div>

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
                onClick={() => navigate('/payment')}
                className={`w-full py-4 rounded-xl font-bold transition shadow-lg ${
                  selectedSeats.length > 0 ? 'bg-opep-blue text-white hover:bg-blue-800' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Continuer
              </button>
              
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
