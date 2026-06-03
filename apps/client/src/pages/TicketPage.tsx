import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Share2, MapPin, Calendar, Clock, Ticket as TicketIcon } from 'lucide-react';

const TicketPage = () => {
  const { id } = useParams();

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
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          {/* Top Info */}
          <div className="bg-opep-blue/5 p-6 border-b border-dashed border-gray-200 relative">
            <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-gray-50 rounded-full"></div>
            <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-gray-50 rounded-full"></div>
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Passager</p>
                <h3 className="font-bold text-gray-900">Adrian Doe</h3>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Réf. Voyage</p>
                <h3 className="font-bold text-opep-blue">#OP-99238</h3>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-2xl font-black text-gray-900 leading-none">Yaoundé</h4>
                <p className="text-xs text-gray-400 font-medium">Mvan</p>
              </div>
              <div className="flex-1 flex flex-col items-center px-4">
                <div className="w-full h-px bg-opep-blue/20 relative">
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 bg-white px-2">
                    <TicketIcon size={14} className="text-opep-blue" />
                  </div>
                </div>
              </div>
              <div className="text-right">
                <h4 className="text-2xl font-black text-gray-900 leading-none">Douala</h4>
                <p className="text-xs text-gray-400 font-medium">Bonabéri</p>
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
                  <p className="text-sm font-bold text-gray-900">03 Juin 2026</p>
                </div>
              </div>
              <div className="flex items-start">
                <Clock size={18} className="text-opep-blue mr-3 mt-0.5" />
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">Heure</p>
                  <p className="text-sm font-bold text-gray-900">09:00</p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin size={18} className="text-opep-blue mr-3 mt-0.5" />
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">Siège</p>
                  <p className="text-sm font-bold text-gray-900">VIP - 24</p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin size={18} className="text-opep-blue mr-3 mt-0.5" />
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">Agence</p>
                  <p className="text-sm font-bold text-gray-900">Finexs</p>
                </div>
              </div>
            </div>

            {/* QR Code Placeholder */}
            <div className="bg-gray-50 rounded-3xl p-8 flex flex-col items-center border border-gray-100">
              <div className="w-48 h-48 bg-white p-4 rounded-2xl shadow-sm border border-gray-200 mb-4">
                <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-900 via-gray-700 to-gray-900 rounded-lg flex items-center justify-center">
                  <span className="text-white font-black text-4xl">QR</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Scannez pour valider</p>
            </div>
          </div>

          <div className="p-4 bg-gray-50 flex gap-2">
            <button className="flex-1 bg-white text-gray-700 py-3 rounded-xl font-bold text-sm flex items-center justify-center border hover:bg-gray-100 transition">
              <Download size={18} className="mr-2" /> PDF
            </button>
            <button className="flex-1 bg-white text-gray-700 py-3 rounded-xl font-bold text-sm flex items-center justify-center border hover:bg-gray-100 transition">
              <Share2 size={18} className="mr-2" /> Partager
            </button>
          </div>
        </div>
        
        <p className="text-center mt-8 text-[10px] text-gray-400 leading-relaxed uppercase font-bold tracking-wider">
          Ce ticket est personnel. <br /> Présentez une pièce d'identité à l'embarquement.
        </p>
      </div>
    </div>
  );
};

export default TicketPage;
