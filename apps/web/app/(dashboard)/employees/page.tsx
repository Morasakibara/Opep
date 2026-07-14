'use client';

import React, { useState, useEffect } from 'react';
import { UserPlus, Search, Mail, Phone, MoreVertical, Trash2, X, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { usersApi } from '@/services/api.service';
import { PageSkeleton } from '@/components/layout/PageSkeleton';

export default function EmployeesPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [newFirstName, setNewFirstName] = useState(''); const [newLastName, setNewLastName] = useState('');
  const [newEmail, setNewEmail] = useState(''); const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState('CONTROLLER'); const [newPassword, setNewPassword] = useState('');

  function showToast(type: 'success' | 'error', message: string) {
    setToast({ type, message }); setTimeout(() => setToast(null), 3000);
  }

  useEffect(() => { loadEmployees(); }, []);

  async function loadEmployees() {
    setLoading(true); setError(null);
    try { const data: any[] = await usersApi.getAll(); setEmployees(data); }
    catch (err: any) { setError(err.message || 'Erreur de chargement'); }
    finally { setLoading(false); }
  }

  const filtered = employees.filter(e => {
    const q = searchQuery.toLowerCase();
    return `${e.firstName} ${e.lastName}`.toLowerCase().includes(q) || e.email.toLowerCase().includes(q);
  });

  async function handleAddEmployee() {
    if (!newFirstName || !newLastName || !newEmail || !newPhone || !newPassword) {
      showToast('error', 'Veuillez remplir tous les champs'); return;
    }
    setSaving(true);
    try {
      await usersApi.create({ firstName: newFirstName, lastName: newLastName, email: newEmail, phone: newPhone, password: newPassword, role: newRole });
      showToast('success', 'Employé créé');
      setShowAddModal(false); resetForm(); loadEmployees();
    } catch (err: any) { showToast('error', err.message || 'Erreur'); }
    finally { setSaving(false); }
  }

  function resetForm() {
    setNewFirstName(''); setNewLastName(''); setNewEmail(''); setNewPhone(''); setNewRole('CONTROLLER'); setNewPassword('');
  }

  async function handleDeleteConfirmed() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await usersApi.remove(deleteTarget.id);
      showToast('success', `${deleteTarget.name} supprimé`);
      setShowDeleteModal(false); setDeleteTarget(null); loadEmployees();
    } catch (err: any) { showToast('error', err.message || 'Erreur'); }
    finally { setDeleting(false); }
  }

  const roleColors: Record<string, string> = {
    'ADMIN_PLATFORM': 'status-badge-danger',
    'AGENCY_MANAGER': 'status-badge-success',
    'CONTROLLER': 'status-badge-info',
    'CLIENT': 'status-badge-default',
  };
  const roleLabels: Record<string, string> = {
    'ADMIN_PLATFORM': 'Admin', 'AGENCY_MANAGER': 'Manager', 'CONTROLLER': 'Contrôleur', 'CLIENT': 'Client',
  };

  return (
    <div className="space-y-8">
      {toast && (
        <div className={`fixed top-8 right-8 z-[100] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right ${
          toast.type === 'success' ? 'bg-success_green text-white' : 'bg-error_red text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <p className="text-sm font-bold">{toast.message}</p>
        </div>
      )}

      <div className="flex justify-between items-end animate-in slide-in-from-bottom duration-300">
        <div>
          <h2 className="text-2xl font-bold text-on_surface">Personnel</h2>
          <p className="text-on_surface_variant">Gérez les comptes de vos employés.</p>
        </div>
        <button onClick={() => setShowAddModal(true)}
          className="bg-primary text-on_primary px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20">
          <UserPlus size={20} /> Ajouter
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total', value: employees.length, color: 'text-on_surface' },
          { label: 'Contrôleurs', value: employees.filter(e => e.role === 'CONTROLLER').length, color: 'text-primary' },
          { label: 'Actifs', value: employees.filter(e => e.isActive).length, color: 'text-success_green' },
        ].map((stat, i) => (
          <div key={i} className="glass-card rounded-2xl p-6">
            <p className="text-sm font-medium text-on_surface_variant mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {error && (
        <div className="glass-card rounded-2xl p-6 flex items-center justify-between border-error_red/30">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-error_red" size={24} />
            <div><p className="font-bold text-on_surface">Erreur</p><p className="text-sm text-on_surface_variant">{error}</p></div>
          </div>
          <button onClick={loadEmployees} className="px-4 py-2 bg-primary text-on_primary text-sm font-bold rounded-xl">Réessayer</button>
        </div>
      )}

      {loading && <PageSkeleton />}

      {!loading && !error && (
        <div className="glass-card rounded-3xl overflow-hidden animate-in slide-in-from-bottom duration-500">
          <div className="p-6 border-b border-charcoal_border flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-on_surface_variant" size={18} />
              <input type="text" placeholder="Rechercher..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input-field pl-8" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="table-header">
                <tr><th className="px-6 py-4">Employé</th><th className="px-6 py-4">Contact</th><th className="px-6 py-4">Rôle</th><th className="px-6 py-4">Statut</th><th className="px-6 py-4 text-right">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-charcoal_border">
                {filtered.length === 0 && <tr><td colSpan={5} className="px-6 py-12 text-center text-on_surface_variant">Aucun employé</td></tr>}
                {filtered.map((emp: any) => (
                  <tr key={emp.id} className="table-row group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold text-sm">
                          {emp.firstName?.[0] || ''}{emp.lastName?.[0] || ''}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-on_surface">{emp.firstName} {emp.lastName}</p>
                          <p className="text-[10px] text-on_surface_variant">ID: {emp.id?.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center text-xs text-on_surface_variant"><Mail size={12} className="mr-2" />{emp.email}</div>
                      <div className="flex items-center text-xs text-on_surface_variant mt-1"><Phone size={12} className="mr-2" />{emp.phone}</div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`status-badge ${roleColors[emp.role] || 'status-badge-default'}`}>{roleLabels[emp.role] || emp.role}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${emp.isActive ? 'bg-success_green' : 'bg-on_surface_variant/30'}`}></span>
                        <span className="text-xs font-bold text-on_surface_variant">{emp.isActive ? 'Actif' : 'Inactif'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button onClick={() => { setDeleteTarget({ id: emp.id, name: `${emp.firstName} ${emp.lastName}` }); setShowDeleteModal(true); }}
                        className="p-2 hover:bg-error_red/10 text-error_red rounded-lg transition opacity-0 group-hover:opacity-100">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4" onClick={() => setShowAddModal(false)}>
          <div className="glass-card rounded-3xl w-full max-w-lg overflow-hidden animate-in zoom-in" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-charcoal_border flex justify-between items-center">
              <h3 className="text-xl font-bold text-on_surface">Ajouter un employé</h3>
              <button onClick={() => { setShowAddModal(false); resetForm(); }} className="text-on_surface_variant hover:text-primary"><X size={24} /></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><label className="input-label">Prénom</label><input type="text" value={newFirstName} onChange={(e) => setNewFirstName(e.target.value)} placeholder="Jean" className="input-field" /></div>
                <div className="space-y-2"><label className="input-label">Nom</label><input type="text" value={newLastName} onChange={(e) => setNewLastName(e.target.value)} placeholder="Dupont" className="input-field" /></div>
              </div>
              <div className="space-y-2"><label className="input-label">Email</label><input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="jean@opep.cm" className="input-field" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><label className="input-label">Téléphone</label><input type="text" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="+237..." className="input-field" /></div>
                <div className="space-y-2"><label className="input-label">Rôle</label><select value={newRole} onChange={(e) => setNewRole(e.target.value)} className="input-field"><option value="CONTROLLER">Contrôleur</option><option value="AGENCY_MANAGER">Manager</option></select></div>
              </div>
              <div className="space-y-2"><label className="input-label">Mot de passe</label><input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Mot de passe initial" className="input-field" /></div>
              <button onClick={handleAddEmployee} disabled={saving}
                className="w-full bg-primary text-on_primary py-4 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:brightness-110 transition disabled:opacity-70 flex items-center justify-center gap-2">
                {saving && <Loader2 size={20} className="animate-spin" />}
                Créer le compte
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && deleteTarget && (
        <div className="fixed inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4" onClick={() => { setShowDeleteModal(false); setDeleteTarget(null); }}>
          <div className="glass-card rounded-3xl w-full max-w-md overflow-hidden animate-in zoom-in" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="w-12 h-12 bg-error_red/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="text-error_red" size={28} />
              </div>
              <h3 className="text-xl font-bold text-on_surface text-center">Confirmer la suppression</h3>
              <p className="text-sm text-on_surface_variant text-center mt-2">
                Supprimer <strong>{deleteTarget.name}</strong> ?<br />Action irréversible.
              </p>
            </div>
            <div className="p-4 flex gap-3 justify-end">
              <button onClick={() => { setShowDeleteModal(false); setDeleteTarget(null); }} disabled={deleting}
                className="flex-1 px-6 py-3 rounded-xl text-sm font-bold text-on_surface_variant hover:bg-surface_container_high transition">
                Annuler
              </button>
              <button onClick={handleDeleteConfirmed} disabled={deleting}
                className="flex-1 px-6 py-3 rounded-xl text-sm font-bold bg-error_red text-white hover:brightness-110 transition disabled:opacity-50 flex items-center justify-center gap-2">
                {deleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
