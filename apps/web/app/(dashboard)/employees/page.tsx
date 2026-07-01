'use client';

import React, { useState, useEffect } from 'react';
import { 
  UserPlus, 
  Search, 
  Mail, 
  Phone, 
  Shield, 
  MoreVertical,
  Edit2,
  Trash2,
  X,
  Loader2,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
}

export default function EmployeesPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  // Add employee form state
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState('CONTROLLER');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    loadEmployees();
  }, []);

  function showToast(type: 'success' | 'error', message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  }

  async function loadEmployees() {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.getUsers();
      setEmployees(data);
    } catch (err: any) {
      setError(err.message || 'Erreur de chargement du personnel');
    } finally {
      setLoading(false);
    }
  }

  const filteredEmployees = employees.filter(emp => {
    const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
    const email = emp.email.toLowerCase();
    const q = searchQuery.toLowerCase();
    return fullName.includes(q) || email.includes(q) || emp.id.toLowerCase().includes(q);
  });

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      'ADMIN_PLATFORM': 'bg-red-100 text-red-700',
      'AGENCY_MANAGER': 'bg-purple-100 text-purple-700',
      'CONTROLLER': 'bg-blue-100 text-blue-700',
      'CLIENT': 'bg-gray-100 text-gray-700',
    };
    const labels: Record<string, string> = {
      'ADMIN_PLATFORM': 'Admin',
      'AGENCY_MANAGER': 'Manager',
      'CONTROLLER': 'Contrôleur',
      'CLIENT': 'Client',
    };
    return (
      <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${colors[role] || 'bg-gray-100 text-gray-700'}`}>
        {labels[role] || role}
      </span>
    );
  };

  async function handleAddEmployee() {
    if (!newFirstName || !newLastName || !newEmail || !newPhone || !newPassword) {
      showToast('error', 'Veuillez remplir tous les champs');
      return;
    }
    setSaving(true);
    try {
      await apiClient.createUser({
        firstName: newFirstName,
        lastName: newLastName,
        email: newEmail,
        phone: newPhone,
        password: newPassword,
        role: newRole,
      });
      showToast('success', 'Employé créé avec succès');
      setShowAddModal(false);
      resetForm();
      loadEmployees();
    } catch (err: any) {
      showToast('error', err.message || 'Erreur lors de la création');
    } finally {
      setSaving(false);
    }
  }

  function resetForm() {
    setNewFirstName('');
    setNewLastName('');
    setNewEmail('');
    setNewPhone('');
    setNewRole('CONTROLLER');
    setNewPassword('');
  }

  function confirmDelete(id: string, name: string) {
    setDeleteTarget({ id, name });
    setShowDeleteModal(true);
  }

  async function handleDeleteConfirmed() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await apiClient.deleteUser(deleteTarget.id);
      showToast('success', `${deleteTarget.name} supprimé avec succès`);
      setShowDeleteModal(false);
      setDeleteTarget(null);
      loadEmployees();
    } catch (err: any) {
      showToast('error', err.message || 'Erreur lors de la suppression');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-8 right-8 z-[100] px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 animate-in slide-in-from-right duration-300 ${
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <p className="text-sm font-bold">{toast.message}</p>
        </div>
      )}

      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Gestion du Personnel</h2>
          <p className="text-gray-500">Gérez les comptes de vos employés et leurs permissions.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
        >
          <UserPlus size={20} className="mr-2" />
          Ajouter un employé
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-sm font-medium text-gray-400 mb-1">Total Employés</p>
          <p className="text-2xl font-black text-gray-900">{employees.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-sm font-medium text-gray-400 mb-1">Contrôleurs</p>
          <p className="text-2xl font-black text-blue-600">{employees.filter(e => e.role === 'CONTROLLER').length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-sm font-medium text-gray-400 mb-1">Comptes actifs</p>
          <p className="text-2xl font-black text-green-600">{employees.filter(e => e.isActive).length}</p>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertCircle className="text-red-500" size={24} />
            <div>
              <p className="font-bold text-red-700">Erreur de chargement</p>
              <p className="text-sm text-red-500">{error}</p>
            </div>
          </div>
          <button onClick={loadEmployees} className="px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-700 transition">
            Réessayer
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
          <Loader2 size={32} className="animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-500 font-medium">Chargement des employés...</p>
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center">
            <div className="relative flex-1">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Rechercher un employé..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-4 py-2 bg-transparent border-none focus:ring-0 text-sm outline-none text-gray-900"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-[10px] uppercase tracking-widest text-gray-400 font-black">
                  <th className="px-6 py-4">Employé</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Rôle</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredEmployees.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400 font-medium">
                      Aucun employé trouvé
                    </td>
                  </tr>
                )}
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50 transition group">
                    <td className="px-6 py-5">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black text-sm">
                          {emp.firstName?.[0] || ''}{emp.lastName?.[0] || ''}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{emp.firstName} {emp.lastName}</p>
                          <p className="text-[10px] text-gray-400 font-medium">ID: {emp.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-1">
                        <div className="flex items-center text-xs text-gray-600">
                          <Mail size={12} className="mr-2 text-gray-400" />
                          {emp.email}
                        </div>
                        <div className="flex items-center text-xs text-gray-600">
                          <Phone size={12} className="mr-2 text-gray-400" />
                          {emp.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      {getRoleBadge(emp.role)}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-block w-2 h-2 rounded-full mr-2 ${emp.isActive ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      <span className="text-xs font-bold text-gray-700">{emp.isActive ? 'Actif' : 'Inactif'}</span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end space-x-1 opacity-0 group-hover:opacity-100 transition">
                        <button 
                          onClick={() => confirmDelete(emp.id, `${emp.firstName} ${emp.lastName}`)}
                          className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition"
                          title="Supprimer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deleteTarget && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4" onClick={() => { setShowDeleteModal(false); setDeleteTarget(null); }}>
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-50">
              <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="text-red-600" size={28} />
              </div>
              <h3 className="text-xl font-black text-gray-900 text-center">Confirmer la suppression</h3>
              <p className="text-sm text-gray-500 text-center mt-2">
                Êtes-vous sûr de vouloir supprimer <strong>{deleteTarget.name}</strong> ?
                <br />
                Cette action est irréversible et toutes les données associées seront perdues.
              </p>
            </div>
            <div className="p-4 flex space-x-3 justify-end">
              <button
                onClick={() => { setShowDeleteModal(false); setDeleteTarget(null); }}
                disabled={deleting}
                className="flex-1 px-6 py-3 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 transition disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteConfirmed}
                disabled={deleting}
                className="flex-1 px-6 py-3 rounded-xl text-sm font-bold bg-red-600 text-white hover:bg-red-700 transition shadow-lg shadow-red-100 disabled:opacity-50 flex items-center justify-center"
              >
                {deleting ? <Loader2 size={18} className="animate-spin mr-2" /> : <Trash2 size={18} className="mr-2" />}
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <h3 className="text-xl font-black text-gray-900">Ajouter un employé</h3>
              <button onClick={() => { setShowAddModal(false); resetForm(); }} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Prénom</label>
                  <input type="text" value={newFirstName} onChange={(e) => setNewFirstName(e.target.value)} placeholder="ex: Jean" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-900" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Nom</label>
                  <input type="text" value={newLastName} onChange={(e) => setNewLastName(e.target.value)} placeholder="ex: Dupont" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-900" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Email</label>
                <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="ex: jean@opep.cm" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-900" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Téléphone</label>
                  <input type="text" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="+237 ..." className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-900" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Rôle</label>
                  <select value={newRole} onChange={(e) => setNewRole(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition font-bold text-gray-700">
                    <option value="CONTROLLER">Contrôleur</option>
                    <option value="AGENCY_MANAGER">Manager</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Mot de passe temporaire</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Mot de passe initial" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-900" />
              </div>
              <button 
                onClick={handleAddEmployee}
                disabled={saving}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-blue-100 hover:bg-blue-700 transition disabled:opacity-70 flex items-center justify-center"
              >
                {saving ? <Loader2 size={20} className="animate-spin mr-2" /> : null}
                Créer le compte
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
