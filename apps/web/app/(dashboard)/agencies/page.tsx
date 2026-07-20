'use client';

import React, { useState, useEffect } from 'react';
import {
  Building2, Search, MapPin, Phone, Globe, ChevronRight,
  AlertCircle, Plus, X, Loader2, CheckCircle2, Trash2, Edit2,
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { PageSkeleton } from '@/components/layout/PageSkeleton';
import { agenciesApi } from '@/services/api.service';

interface Agency {
  id: string;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  city?: string;
  isActive: boolean;
  createdAt: string;
}

export default function AgenciesPage() {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAgency, setEditingAgency] = useState<Agency | null>(null);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formWebsite, setFormWebsite] = useState('');

  useEffect(() => { loadAgencies(); }, []);

  async function loadAgencies() {
    setLoading(true);
    setError(null);
    try {
      const data = await agenciesApi.getAll();
      setAgencies(data as unknown as Agency[]);
    } catch (err: any) {
      const msg = err.message || 'Erreur de chargement';
      setError(msg);
      toast.error('Agences', msg);
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    setEditingAgency(null);
    setFormName(''); setFormDesc(''); setFormAddress('');
    setFormPhone(''); setFormEmail(''); setFormWebsite('');
    setShowModal(true);
  }

  function openEditModal(agency: Agency) {
    setEditingAgency(agency);
    setFormName(agency.name);
    setFormDesc(agency.description || '');
    setFormAddress(agency.address || '');
    setFormPhone(agency.phone || '');
    setFormEmail(agency.email || '');
    setFormWebsite(agency.website || '');
    setShowModal(true);
  }

  async function handleSave() {
    if (!formName) { toast.warning('Validation', 'Le nom est requis'); return; }
    setSaving(true);
    try {
      if (editingAgency) {
        await agenciesApi.update(editingAgency.id, {
          name: formName, description: formDesc, address: formAddress,
          phone: formPhone, email: formEmail, website: formWebsite,
        });
        toast.success('Agence', 'Agence mise à jour');
      } else {
        await agenciesApi.create({
          name: formName, description: formDesc, address: formAddress,
          phone: formPhone, email: formEmail, website: formWebsite,
        });
        toast.success('Agence', 'Agence créée');
      }
      setShowModal(false);
      loadAgencies();
    } catch (err: any) {
      toast.error('Agences', err.message || 'Erreur');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Supprimer définitivement "${name}" ?`)) return;
    try {
      await agenciesApi.remove(id);
      toast.success('Agence', `"${name}" supprimée`);
      loadAgencies();
    } catch (err: any) {
      toast.error('Agences', err.message || 'Erreur');
    }
  }

  const filtered = agencies.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.city?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <PageSkeleton />;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end animate-in slide-in-from-bottom duration-300">
        <div>
          <h2 className="text-2xl font-bold text-on_surface">Agences</h2>
          <p className="text-on_surface_variant">Gérez les agences partenaires.</p>
        </div>
        <button onClick={openCreateModal}
          className="bg-primary text-on_primary px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20">
          <Plus size={20} /> Ajouter
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 animate-in slide-in-from-bottom duration-400">
        <div className="glass-card rounded-2xl p-5">
          <Building2 size={20} className="text-primary mb-2" />
          <p className="text-2xl font-bold text-on_surface">{agencies.length}</p>
          <p className="text-xs text-on_surface_variant font-medium">Total agences</p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <MapPin size={20} className="text-secondary mb-2" />
          <p className="text-2xl font-bold text-on_surface">{new Set(agencies.map(a => a.city)).size}</p>
          <p className="text-xs text-on_surface_variant font-medium">Villes couvertes</p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <CheckCircle2 size={20} className="text-success_green mb-2" />
          <p className="text-2xl font-bold text-on_surface">{agencies.filter(a => a.isActive).length}</p>
          <p className="text-xs text-on_surface_variant font-medium">Actives</p>
        </div>
      </div>

      {error && (
        <div className="glass-card rounded-2xl p-6 flex items-center justify-between border-error_red/30">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-error_red" size={24} />
            <p className="font-bold text-on_surface">{error}</p>
          </div>
          <button onClick={loadAgencies} className="px-4 py-2 bg-primary text-on_primary text-sm font-bold rounded-xl hover:brightness-110 transition">Réessayer</button>
        </div>
      )}

      {!error && (
        <div className="glass-card rounded-3xl overflow-hidden animate-in slide-in-from-bottom duration-500">
          <div className="p-5 border-b border-charcoal_border flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on_surface_variant" />
              <input type="text" placeholder="Rechercher..." value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} className="input-field pl-10" />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="p-16 text-center">
              <Building2 size={48} className="mx-auto text-on_surface_variant/30 mb-4" />
              <p className="text-on_surface_variant font-bold">Aucune agence</p>
            </div>
          ) : (
            <div className="divide-y divide-charcoal_border">
              {filtered.map((agency, i) => (
                <div key={agency.id} className="p-5 flex items-center gap-4 hover:bg-primary/5 transition-all group"
                  style={{ animationDelay: `${i * 50}ms` }}>
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Building2 size={22} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-on_surface">{agency.name}</p>
                      <span className={`w-2 h-2 rounded-full ${agency.isActive ? 'bg-success_green' : 'bg-on_surface_variant/30'}`} />
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-on_surface_variant">
                      {agency.city && <span className="flex items-center gap-1"><MapPin size={12} />{agency.city}</span>}
                      {agency.phone && <span className="flex items-center gap-1"><Phone size={12} />{agency.phone}</span>}
                      {agency.website && <span className="flex items-center gap-1"><Globe size={12} />{agency.website}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => openEditModal(agency)} className="p-2 hover:bg-primary/10 text-primary rounded-lg transition">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(agency.id, agency.name)} className="p-2 hover:bg-error_red/10 text-error_red rounded-lg transition">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <ChevronRight size={16} className="text-on_surface_variant/30" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
          onClick={() => setShowModal(false)}>
          <div className="glass-card rounded-3xl w-full max-w-lg overflow-hidden animate-in zoom-in"
            onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-charcoal_border flex justify-between items-center">
              <h3 className="text-xl font-bold text-on_surface">
                {editingAgency ? 'Modifier' : 'Ajouter'} une agence
              </h3>
              <button onClick={() => { setShowModal(false); }} className="text-on_surface_variant hover:text-primary">
                <X size={24} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="input-label">Nom *</label>
                <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Nom de l'agence" className="input-field" />
              </div>
              <div className="space-y-2">
                <label className="input-label">Description</label>
                <textarea rows={3} value={formDesc} onChange={(e) => setFormDesc(e.target.value)} placeholder="Description..." className="input-field" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="input-label">Adresse</label>
                  <input type="text" value={formAddress} onChange={(e) => setFormAddress(e.target.value)} placeholder="Adresse" className="input-field" />
                </div>
                <div className="space-y-2">
                  <label className="input-label">Téléphone</label>
                  <input type="text" value={formPhone} onChange={(e) => setFormPhone(e.target.value)} placeholder="+237..." className="input-field" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="input-label">Email</label>
                  <input type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} placeholder="contact@agence.cm" className="input-field" />
                </div>
                <div className="space-y-2">
                  <label className="input-label">Site Web</label>
                  <input type="text" value={formWebsite} onChange={(e) => setFormWebsite(e.target.value)} placeholder="https://..." className="input-field" />
                </div>
              </div>
              <button onClick={handleSave} disabled={saving || !formName}
                className="w-full bg-primary text-on_primary py-4 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:brightness-110 transition disabled:opacity-70 flex items-center justify-center gap-2">
                {saving && <Loader2 size={20} className="animate-spin" />}
                {editingAgency ? 'Enregistrer' : 'Créer l\'agence'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
