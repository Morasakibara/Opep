'use client';

import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { busesApi } from '@/services/api.service';

interface AddBusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddBusModal({ isOpen, onClose, onSuccess }: AddBusModalProps) {
  const [newPlateNumber, setNewPlateNumber] = useState('');
  const [newModel, setNewModel] = useState('');
  const [newType, setNewType] = useState('Classique');
  const [newCapacity, setNewCapacity] = useState(48);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  function reset() {
    setNewPlateNumber(''); setNewModel(''); setNewType('Classique'); setNewCapacity(48);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4" onClick={onClose}>
      <div className="glass-card rounded-3xl w-full max-w-lg overflow-hidden animate-in zoom-in" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-charcoal_border flex justify-between items-center">
          <h3 className="text-xl font-bold text-on_surface">Ajouter un nouveau bus</h3>
          <button onClick={() => { onClose(); reset(); }} className="text-on_surface_variant hover:text-primary"><X size={24} /></button>
        </div>
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2"><label className="input-label">Immatriculation</label><input type="text" value={newPlateNumber} onChange={(e) => setNewPlateNumber(e.target.value)} placeholder="ex: LT-123-AA" className="input-field" /></div>
            <div className="space-y-2"><label className="input-label">Modèle</label><input type="text" value={newModel} onChange={(e) => setNewModel(e.target.value)} placeholder="ex: Mercedes Travego" className="input-field" /></div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="input-label">Type</label>
              <select value={newType} onChange={(e) => setNewType(e.target.value)} className="input-field">
                <option>VIP</option><option>Classique</option><option>Premium</option>
              </select>
            </div>
            <div className="space-y-2"><label className="input-label">Capacité</label><input type="number" value={newCapacity} onChange={(e) => setNewCapacity(Number(e.target.value))} className="input-field" /></div>
          </div>
          <button
            onClick={async () => {
              if (!newPlateNumber || !newModel) return;
              setSaving(true);
              try {
                await busesApi.create({ plateNumber: newPlateNumber, model: newModel, totalSeats: newCapacity });
                onClose(); reset(); onSuccess();
              } catch (err: any) {
                setToast({ type: 'error', message: err.message || 'Erreur' });
                setTimeout(() => setToast(null), 3000);
              } finally { setSaving(false); }
            }}
            disabled={saving || !newPlateNumber || !newModel}
            className="w-full bg-primary text-on_primary py-4 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:brightness-110 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? <><Loader2 size={20} className="animate-spin" /> Création...</> : "Confirmer l'ajout"}
          </button>
        </div>
      </div>
    </div>
  );
}
