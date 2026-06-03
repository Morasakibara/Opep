import React from 'react';
import { 
  QrCode, 
  Camera, 
  X, 
  CheckCircle2, 
  AlertCircle,
  History,
  ShieldCheck
} from 'lucide-react';

export default function ScannerPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Scanner de Tickets</h2>
          <p className="text-gray-500">Validez les tickets QR des passagers à l'embarquement.</p>
        </div>
        <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-2 rounded-xl text-sm font-bold border border-green-100">
          <ShieldCheck size={18} />
          <span>Mode Validation Sécurisée</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Scanner Interface */}
        <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl relative aspect-square lg:aspect-auto">
          <div className="absolute inset-0 flex items-center justify-center">
             {/* Mock Camera View */}
             <div className="w-full h-full bg-slate-800 flex items-center justify-center relative">
                <Camera size={64} className="text-slate-700 animate-pulse" />
                
                {/* QR Guide Overlay */}
                <div className="absolute inset-0 border-[60px] border-slate-900/60 flex items-center justify-center">
                  <div className="w-64 h-64 border-2 border-blue-500 rounded-2xl relative shadow-[0_0_50px_rgba(59,130,246,0.3)]">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-400 rounded-tl-lg"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-400 rounded-tr-lg"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-400 rounded-bl-lg"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-400 rounded-br-lg"></div>
                    
                    {/* Scanning Line */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-blue-400/50 shadow-[0_0_15px_rgba(96,165,250,0.8)] animate-scan"></div>
                  </div>
                </div>
                
                <p className="absolute bottom-10 text-white/50 text-xs font-bold uppercase tracking-widest">Placez le QR code au centre</p>
             </div>
          </div>
        </div>

        {/* Validation Info & History */}
        <div className="space-y-6">
          {/* Last Scan Result (Active) */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border-2 border-green-500 animate-in zoom-in duration-300">
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-green-100 text-green-600 p-3 rounded-full">
                <CheckCircle2 size={32} />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 leading-none">Ticket Valide</h3>
                <p className="text-sm text-green-600 font-bold uppercase tracking-wider mt-1">Passager autorisé</p>
              </div>
            </div>

            <div className="space-y-4 py-6 border-t border-b border-gray-50 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Passager</span>
                <span className="font-bold text-gray-900 text-sm">Adrian Doe</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Réf. Ticket</span>
                <span className="font-bold text-blue-600 text-sm">#TK-8821</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Trajet</span>
                <span className="font-bold text-gray-900 text-sm text-right">Yaoundé ➔ Douala<br/><span className="text-[10px] font-normal text-gray-500">Finexs VIP (09:00)</span></span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Siège</span>
                <span className="font-black text-orange-600 text-sm">VIP - 24</span>
              </div>
            </div>

            <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition shadow-xl flex items-center justify-center">
              Prêt pour le suivant
            </button>
          </div>

          {/* History */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <History size={18} className="text-gray-400" />
                <h4 className="font-bold text-gray-900">Dernières validations</h4>
              </div>
              <button className="text-xs font-bold text-blue-600 hover:underline">Voir tout</button>
            </div>
            
            <div className="space-y-3">
              {[
                { name: 'Paul Biya', time: '18:42:01', id: 'TK-8820' },
                { name: 'Marie Ngo', time: '18:40:15', id: 'TK-8819' },
                { name: 'Jean Dupont', time: '18:38:55', id: 'TK-8818' },
              ].map((scan, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-[10px] font-black text-gray-400">
                      {scan.name[0]}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">{scan.name}</p>
                      <p className="text-[10px] text-gray-400">{scan.id}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-gray-500">{scan.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
