import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, Smartphone, CheckCircle } from 'lucide-react';

const PaymentPage = () => {
  const navigate = useNavigate();
  const [method, setMethod] = useState<'momo' | 'om' | 'stripe' | null>(null);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');

  const handlePay = () => {
    setStatus('processing');
    setTimeout(() => {
      setStatus('success');
    }, 2000);
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle size={48} />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-2">Paiement Réussi !</h2>
        <p className="text-gray-500 mb-8 max-w-xs">
          Votre réservation a été confirmée. Votre ticket QR est prêt.
        </p>
        <Link 
          to="/tickets/123"
          className="w-full max-w-xs bg-opep-blue text-white py-4 rounded-xl font-bold shadow-lg hover:bg-blue-800 transition"
        >
          Voir mon Ticket
        </Link>
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
            <h2 className="text-lg font-bold">Paiement</h2>
            <p className="text-xs opacity-80">Total à payer : 3 000 FCFA</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-6 max-w-xl">
        <h3 className="font-bold text-gray-900 mb-6">Choisissez votre mode de paiement</h3>
        
        <div className="space-y-4">
          {/* MTN MoMo */}
          <button 
            onClick={() => setMethod('momo')}
            className={`w-full p-4 rounded-2xl border-2 transition flex items-center justify-between ${method === 'momo' ? 'border-opep-blue bg-blue-50' : 'border-white bg-white'}`}
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center mr-4 font-black text-white">M</div>
              <div className="text-left">
                <p className="font-bold text-gray-900">MTN Mobile Money</p>
                <p className="text-xs text-gray-500">Paiement instantané</p>
              </div>
            </div>
            {method === 'momo' && <div className="w-5 h-5 rounded-full bg-opep-blue flex items-center justify-center text-white"><CheckCircle size={14} /></div>}
          </button>

          {/* Orange Money */}
          <button 
            onClick={() => setMethod('om')}
            className={`w-full p-4 rounded-2xl border-2 transition flex items-center justify-between ${method === 'om' ? 'border-opep-blue bg-blue-50' : 'border-white bg-white'}`}
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mr-4 font-black text-white">O</div>
              <div className="text-left">
                <p className="font-bold text-gray-900">Orange Money</p>
                <p className="text-xs text-gray-500">Sécurisé par Orange</p>
              </div>
            </div>
            {method === 'om' && <div className="w-5 h-5 rounded-full bg-opep-blue flex items-center justify-center text-white"><CheckCircle size={14} /></div>}
          </button>

          {/* Card */}
          <button 
            onClick={() => setMethod('stripe')}
            className={`w-full p-4 rounded-2xl border-2 transition flex items-center justify-between ${method === 'stripe' ? 'border-opep-blue bg-blue-50' : 'border-white bg-white'}`}
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center mr-4 font-black text-white">
                <CreditCard size={24} />
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-900">Carte Bancaire</p>
                <p className="text-xs text-gray-500">Visa, Mastercard</p>
              </div>
            </div>
            {method === 'stripe' && <div className="w-5 h-5 rounded-full bg-opep-blue flex items-center justify-center text-white"><CheckCircle size={14} /></div>}
          </button>
        </div>

        {method && (
          <div className="mt-8 p-6 bg-white rounded-2xl shadow-lg border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {method === 'momo' || method === 'om' ? (
              <div className="space-y-4">
                <label className="block text-sm font-bold text-gray-700">Numéro de téléphone {method === 'momo' ? 'MTN' : 'Orange'}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Smartphone size={18} />
                  </div>
                  <input 
                    type="tel" 
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-opep-blue focus:border-opep-blue outline-none" 
                    placeholder="6XX XX XX XX" 
                  />
                </div>
                <p className="text-[10px] text-gray-400">Une demande de confirmation sera envoyée sur votre téléphone.</p>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500 mb-4">Redirection vers la plateforme sécurisée...</p>
              </div>
            )}

            <button
              onClick={handlePay}
              disabled={status === 'processing'}
              className="w-full mt-6 bg-opep-orange text-white py-4 rounded-xl font-bold shadow-lg hover:bg-orange-600 transition flex items-center justify-center"
            >
              {status === 'processing' ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>Payer 3 000 FCFA</>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
