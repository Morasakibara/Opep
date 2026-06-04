'use client';

import React, { useState } from 'react';
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
  Check
} from 'lucide-react';

export default function EmployeesPage() {
  const [showAddModal, setShowAddModal] = useState(false);

  const employees = [
    { 
      id: 'EMP-001', 
      name: 'Samuel Eto\'o', 
      email: 'samuel@opep-agency.com', 
      phone: '+237 670 000 001', 
      role: 'MANAGER', 
      status: 'ACTIVE' 
    },
    { 
      id: 'EMP-002', 
      name: 'Rigobert Song', 
      email: 'song@opep-agency.com', 
      phone: '+237 670 000 002', 
      role: 'CONTROLLER', 
      status: 'ACTIVE' 
    },
    { 
      id: 'EMP-003', 
      name: 'Roger Milla', 
      email: 'milla@opep-agency.com', 
      phone: '+237 670 000 003', 
      role: 'CONTROLLER', 
      status: 'INACTIVE' 
    },
  ];

  const getRoleBadge = (role: string) => {
    const colors: any = {
      'MANAGER': 'bg-purple-100 text-purple-700',
      'CONTROLLER': 'bg-blue-100 text-blue-700',
      'ADMIN': 'bg-red-100 text-red-700',
    };
    return <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${colors[role] || 'bg-gray-100 text-gray-700'}`}>{role}</span>;
  };

  return (
    <div className="space-y-8">
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
          <p className="text-2xl font-black text-gray-900">12</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-sm font-medium text-gray-400 mb-1">Contrôleurs Actifs</p>
          <p className="text-2xl font-black text-blue-600">8</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-sm font-medium text-gray-400 mb-1">En service aujourd'hui</p>
          <p className="text-2xl font-black text-green-600">5</p>
        </div>
      </div>

      {/* Search and Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center">
          <div className="relative flex-1">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher un employé..." 
              className="w-full pl-8 pr-4 py-2 bg-transparent border-none focus:ring-0 text-sm"
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
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50 transition group">
                  <td className="px-6 py-5">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black text-sm">
                        {emp.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{emp.name}</p>
                        <p className="text-[10px] text-gray-400 font-medium">{emp.id}</p>
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
                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${emp.status === 'ACTIVE' ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                    <span className="text-xs font-bold text-gray-700">{emp.status === 'ACTIVE' ? 'Actif' : 'Inactif'}</span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end space-x-1 opacity-0 group-hover:opacity-100 transition">
                      <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition">
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

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <h3 className="text-xl font-black text-gray-900">Ajouter un employé</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Nom complet</label>
                <input type="text" placeholder="ex: Jean Dupont" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Email</label>
                <input type="email" placeholder="ex: jean@opep.cm" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Téléphone</label>
                  <input type="text" placeholder="+237 ..." className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Rôle</label>
                  <select className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition font-bold text-gray-700">
                    <option>CONTROLLER</option>
                    <option>MANAGER</option>
                    <option>ADMIN</option>
                  </select>
                </div>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-blue-100 hover:bg-blue-700 transition"
              >
                Créer le compte
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
