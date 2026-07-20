'use client';

import React, { useState, useEffect } from 'react';
import {
  Users, Search, AlertCircle, ChevronRight, Building2,
  Phone, Mail, Shield, Star, Clock, Plus, X, Loader2,
  CheckCircle2, Trash2, Edit2, Filter, UserPlus, BadgeCheck,
  MoreVertical, Briefcase, CalendarDays,
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { PageSkeleton } from '@/components/layout/PageSkeleton';
import { usersApi } from '@/services/api.service';
import { isStaffRole, isAdminRole } from '@/lib/role.utils';

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  agencyName?: string;
}

const ROLE_LABELS: Record<string, string> = {
  ADMIN_PLATFORM: 'Super Admin',
  COMPANY_DIRECTOR: 'Directeur',
  CENTRE_MANAGER: 'Gestionnaire',
  AGENCY_MANAGER: "Manager d'agence",
  CASHIER: 'Caissier',
  CONTROLLER: 'Contrôleur',
  DRIVER: 'Chauffeur',
  CLIENT: 'Client',
};

const ROLE_COLORS: Record<string, string> = {
  ADMIN_PLATFORM: 'bg-error_red/10 text-error_red',
  COMPANY_DIRECTOR: 'bg-primary/10 text-primary',
  CENTRE_MANAGER: 'bg-warning_yellow/10 text-warning_yellow',
  AGENCY_MANAGER: 'bg-success_green/10 text-success_green',
  CASHIER: 'bg-primary/10 text-primary',
  CONTROLLER: 'bg-tertiary/10 text-tertiary',
  DRIVER: 'bg-on_surface_variant/10 text-on_surface_variant',
  CLIENT: 'bg-on_surface_variant/10 text-on_surface_variant',
};

const MOCK_EMPLOYEES: Employee[] = [
  { id: '1', firstName: 'Jean', lastName: 'Ngom', email: 'jean@finexs.cm', phone: '+237 670 000 001', role: 'AGENCY_MANAGER', isActive: true, createdAt: '2026-01-15', agencyName: 'Finexs Voyages' },
  { id: '2', firstName: 'Marie', lastName: 'Bella', email: 'marie@finexs.cm', phone: '+237 670 000 002', role: 'CASHIER', isActive: true, createdAt: '2026-02-20', agencyName: 'Finexs Voyages' },
  { id: '3', firstName: 'Paul', lastName: 'Emana', email: 'paul@express.cm', phone: '+237 670 000 003', role: 'CONTROLLER', isActive: true, createdAt: '2026-03-10', agencyName: 'General Express' },
  { id: '4', firstName: 'David', lastName: 'Mbarga', email: 'david@buca.cm', phone: '+237 670 000 004', role: 'DRIVER', isActive: false, createdAt: '2026-01-05', agencyName: 'Buca Voyages' },
  { id: '5', firstName: 'Sarah', lastName: 'Kenne', email: 'sarah@buca.cm', phone: '+237 670 000 005', role: 'CASHIER', isActive: true, createdAt: '2026-04-01', agencyName: 'Buca Voyages' },
];

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const [formFirstName, setFormFirstName] = useState('');
  const [formLastName, setFormLastName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formRole, setFormRole] = useState('CASHIER');

  useEffect(() => { loadEmployees(); }, []);

  async function loadEmployees() {
    setLoading(true);
    setError(null);
    try {
      const data = await usersApi.getAll();
      const staff = (Array.isArray(data) ? data : []).filter((u: any) => isStaffRole(u.role));
      setEmployees(staff.length > 0 ? staff as unknown as Employee[] : MOCK_EMPLOYEES);
    } catch (err: any) {
      console.warn('Employees API unavailable, using mock data');
      setEmployees(MOCK_EMPLOYEES);
      toast.info('Employés', 'Données de démonstration affichées');
    } finally {
      setLoading(false);
    }
  }

  const filtered = employees.filter((e) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = `${e.firstName} ${e.lastName}`.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) || e.phone.includes(q);
    const matchesRole = roleFilter === 'all' || e.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  function openCreateModal() {
    setEditingEmployee(null);
    setFormFirstName(''); setFormLastName(''); setFormEmail('');
    setFormPhone(''); setFormRole('CASHIER');
    setShowModal(true);
  }

  function openEditModal(emp: Employee) {
    setEditingEmployee(emp);
    setFormFirstName(emp.firstName); setFormLastName(emp.lastName);
    setFormEmail(emp.email); setFormPhone(emp.phone); setFormRole(emp.role);
    setShowModal(true);
  }

  async function handleSave() {
    if (!formFirstName || !formLastName || !formEmail) {
      toast.warning('Validation', 'Les champs marqués * sont requis');
      return;
    }
    setSaving(true);
    try {
      if (editingEmployee) {
        await usersApi.update(editingEmployee.id, {
          firstName: formFirstName, lastName: formLastName,
          email: formEmail, phone: formPhone, role: formRole,
        });
        toast.success('Employé', `${formFirstName} ${formLastName} mis à jour`);
      } else {
        await usersApi.create({
          firstName: formFirstName, lastName: formLastName,
          email: formEmail, phone: formPhone, role: formRole,
          password: '123456',
        });
        toast.success('Employé', `${formFirstName} ${formLastName} créé`);
      }
      setShowModal(false);
      loadEmployees();
    } catch (err: any) {
      toast.error('Employés', err.message || 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Désactiver le compte de "${name}" ?`)) return;
    try {
      await usersApi.remove(id);
      toast.success('Employé', `"${name}" désactivé`);
      loadEmployees();
    } catch (err: any) {
      toast.error('Employés', err.message || 'Erreur');
    }
  }

  const totalActive = employees.filter((e) => e.isActive).length;
  const totalManagers = employees.filter((e) => isAdminRole(e.role)).length;
  const totalCashiers = employees.filter((e) => e.role === 'CASHIER').length;

  if (loading) return <PageSkeleton />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end animate-in slide-in-from-bottom duration-300">
        <div>
          <h2 className="text-2xl font-bold text-on_surface">Personnel</h2>
          <p className="text-on_surface_variant">Gérez les employés et leurs accès à la plateforme.</p>
        </div>
        <button onClick={openCreateModal}
          className="bg-primary text-on_primary px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20">
          <UserPlus size={20} /> Ajouter
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in slide-in-from-bottom duration-400">
        <div className="glass-card rounded-2xl p-5 hover-lift cursor-default">
          <Users size={20} className="text-primary mb-2" />
          <p className="text-2xl font-bold text-on_surface">{employees.length}</p>
          <p className="text-xs text-on_surface_variant font-medium">Total employés</p>
        </div>
        <div className="glass-card rounded-2xl p-5 hover-lift cursor-default">
          <BadgeCheck size={20} className="text-success_green mb-2" />
          <p className="text-2xl font-bold text-on_surface">{totalActive}</p>
          <p className="text-xs text-on_surface_variant font-medium">Actifs</p>
        </div>
        <div className="glass-card rounded-2xl p-5 hover-lift cursor-default">
          <Briefcase size={20} className="text-warning_yellow mb-2" />
          <p className="text-2xl font-bold text-on_surface">{totalManagers}</p>
          <p className="text-xs text-on_surface_variant font-medium">Managers</p>
        </div>
        <div className="glass-card rounded-2xl p-5 hover-lift cursor-default">
          <Users size={20} className="text-primary mb-2" />
          <p className="text-2xl font-bold text-on_surface">{totalCashiers}</p>
          <p className="text-xs text-on_surface_variant font-medium">Caissiers</p>
        </div>
      </div>

      {error && (
        <div className="glass-card rounded-2xl p-6 flex items-center justify-between border-error_red/30 animate-in fade-in">
          <div className="flex items-center gap-3"><AlertCircle className="text-error_red" size={24} /><p className="font-bold text-on_surface">{error}</p></div>
          <button onClick={loadEmployees} className="px-4 py-2 bg-primary text-on_primary text-sm font-bold rounded-xl hover:brightness-110 transition">Réessayer</button>
        </div>
      )}

      {!error && (
        <div className="glass-card rounded-3xl overflow-hidden animate-in slide-in-from-bottom duration-500">
          {/* Search + Role Filter */}
          <div className="p-5 border-b border-charcoal_border flex flex-wrap items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on_surface_variant" />
              <input type="text" placeholder="Rechercher un employé..." value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} className="input-field pl-10" />
            </div>
            <div className="flex gap-1.5 overflow-x-auto">
              {['all', 'AGENCY_MANAGER', 'CASHIER', 'CONTROLLER', 'DRIVER'].map((r) => (
                <button key={r} onClick={() => setRoleFilter(r)}
                  className={`px-3 py-2 rounded-xl text-[10px] font-bold uppercase transition-all flex-shrink-0 ${
                    roleFilter === r ? 'bg-primary text-on_primary' : 'bg-surface_container_high text-on_surface_variant hover:text-on_surface'
                  }`}
                >
                  {r === 'all' ? 'Tous' : ROLE_LABELS[r] || r}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="p-16 text-center">
              <Users size={48} className="mx-auto text-on_surface_variant/30 mb-4" />
              <p className="text-on_surface_variant font-bold">
                {searchQuery ? 'Aucun employé trouvé' : 'Aucun employé enregistré'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="table-header">
                  <tr>
                    <th className="px-6 py-4">Employé</th>
                    <th className="px-6 py-4">Contact</th>
                    <th className="px-6 py-4">Rôle</th>
                    <th className="px-6 py-4">Statut</th>
                    <th className="px-6 py-4">Agence</th>
                    <th className="px-6 py-4">Arrivée</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-charcoal_border">
                  {filtered.map((emp, i) => (
                    <tr key={emp.id} className="table-row animate-in fade-in" style={{ animationDelay: `${i * 30}ms` }}>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-bold text-sm border border-primary/10">
                            {emp.firstName[0]}{emp.lastName[0]}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-on_surface">{emp.firstName} {emp.lastName}</p>
                            <p className="text-[10px] text-on_surface_variant font-mono">{emp.id?.slice(0, 8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-on_surface_variant flex items-center gap-1.5">
                            <Mail size={11} className="flex-shrink-0" /> {emp.email}
                          </span>
                          <span className="text-[10px] text-on_surface_variant/60 flex items-center gap-1.5">
                            <Phone size={10} className="flex-shrink-0" /> {emp.phone}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg ${ROLE_COLORS[emp.role] || 'bg-surface_container_high text-on_surface_variant'}`}>
                          {ROLE_LABELS[emp.role] || emp.role}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold ${
                          emp.isActive ? 'text-success_green' : 'text-on_surface_variant/50'
                        }`}>
                          <span className={`w-2 h-2 rounded-full ${emp.isActive ? 'bg-success_green' : 'bg-on_surface_variant/30'}`} />
                          {emp.isActive ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-xs text-on_surface_variant">{emp.agencyName || '—'}</span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-xs text-on_surface_variant/60 flex items-center gap-1">
                          <CalendarDays size={11} />
                          {emp.createdAt ? new Date(emp.createdAt).toLocaleDateString('fr-FR') : '—'}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                          <button onClick={() => openEditModal(emp)} className="p-2 hover:bg-primary/10 text-primary rounded-lg transition">
                            <Edit2 size={15} />
                          </button>
                          <button onClick={() => handleDelete(emp.id, `${emp.firstName} ${emp.lastName}`)} className="p-2 hover:bg-error_red/10 text-error_red rounded-lg transition">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                {editingEmployee ? 'Modifier' : 'Ajouter'} un employé
              </h3>
              <button onClick={() => setShowModal(false)} className="text-on_surface_variant hover:text-primary">
                <X size={24} />
              </button>
            </div>
            <div className="p-8 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="input-label">Prénom *</label>
                  <input type="text" value={formFirstName} onChange={(e) => setFormFirstName(e.target.value)} placeholder="Jean" className="input-field" />
                </div>
                <div className="space-y-2">
                  <label className="input-label">Nom *</label>
                  <input type="text" value={formLastName} onChange={(e) => setFormLastName(e.target.value)} placeholder="Ngom" className="input-field" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="input-label">Email *</label>
                <input type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} placeholder="jean@exemple.com" className="input-field" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="input-label">Téléphone</label>
                  <input type="tel" value={formPhone} onChange={(e) => setFormPhone(e.target.value)} placeholder="+237 XXXXXXXXX" className="input-field" />
                </div>
                <div className="space-y-2">
                  <label className="input-label">Rôle *</label>
                  <select value={formRole} onChange={(e) => setFormRole(e.target.value)} className="input-field">
                    {Object.entries(ROLE_LABELS).filter(([key]) => key !== 'CLIENT' && key !== 'ADMIN_PLATFORM').map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>
              {!editingEmployee && (
                <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                  <p className="text-[11px] text-on_surface_variant flex items-center gap-2">
                    <Shield size={14} className="text-primary" />
                    Mot de passe par défaut : <span className="font-mono font-bold text-primary">123456</span>
                  </p>
                </div>
              )}
              <button onClick={handleSave} disabled={saving}
                className="w-full bg-primary text-on_primary py-4 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:brightness-110 active:scale-[0.97] transition-all disabled:opacity-70 flex items-center justify-center gap-2">
                {saving && <Loader2 size={20} className="animate-spin" />}
                {editingEmployee ? 'Enregistrer' : 'Créer le compte'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
