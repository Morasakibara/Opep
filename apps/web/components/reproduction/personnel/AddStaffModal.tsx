'use client';

import React from 'react';
import { X, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Define validation schema
const staffSchema = z.object({
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  role: z.enum(['Caissier', 'Contrôleur', 'Chauffeur', 'Admin Agence']),
  phone: z.string().regex(/^[0-9]{9}$/, 'Le numéro de téléphone doit contenir 9 chiffres'),
});

type StaffFormData = z.infer<typeof staffSchema>;

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
}

import { useCreateStaff } from '@/hooks/useUsers';

import { toast } from 'sonner';

export default function AddStaffModal({ isOpen, onClose }: AddStaffModalProps) {
  const createStaff = useCreateStaff();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StaffFormData>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      role: 'Caissier',
    }
  });

  if (!isOpen) return null;

  const onSubmit = async (data: StaffFormData) => {
    const toastId = toast.loading('Ajout de l\'employé...');
    createStaff.mutate(data, {
      onSuccess: () => {
        reset();
        onClose();
        toast.success('Employé ajouté avec succès !', { id: toastId });
      },
      onError: (error: any) => {
        console.error('Error adding staff:', error);
        toast.error(`Erreur : ${error.message || 'Impossible d\'ajouter l\'employé.'}`, { id: toastId });
      }
    });
  };

  const isSubmitting = createStaff.isPending;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity p-4">
      <div className="bg-surface_container_lowest border border-charcoal_border w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="p-6 border-b border-charcoal_border flex justify-between items-center bg-surface_container/50">
          <h3 className="text-[20px] font-bold text-on_surface">Ajouter un nouveau membre</h3>
          <button 
            className="text-on_surface_variant hover:text-secondary p-1 hover:bg-surface_container rounded-full transition-all" 
            onClick={onClose}
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-8 flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-bold uppercase tracking-widest text-on_surface_variant">Prénom</label>
                <input 
                  {...register('firstName')}
                  className={`bg-surface_container_low border ${errors.firstName ? 'border-error_red' : 'border-charcoal_border'} rounded-lg p-3 text-on_surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all`} 
                  placeholder="Ex: Marie-Louise"
                  type="text"
                />
                {errors.firstName && <span className="text-error_red text-[11px]">{errors.firstName.message}</span>}
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-bold uppercase tracking-widest text-on_surface_variant">Nom</label>
                <input 
                  {...register('lastName')}
                  className={`bg-surface_container_low border ${errors.lastName ? 'border-error_red' : 'border-charcoal_border'} rounded-lg p-3 text-on_surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all`} 
                  placeholder="Ex: Abena"
                  type="text"
                />
                {errors.lastName && <span className="text-error_red text-[11px]">{errors.lastName.message}</span>}
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-bold uppercase tracking-widest text-on_surface_variant">Rôle / Position</label>
              <select 
                {...register('role')}
                className="bg-surface_container_low border border-charcoal_border rounded-lg p-3 text-on_surface focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none cursor-pointer transition-all"
              >
                <option value="Caissier">Caissier</option>
                <option value="Contrôleur">Contrôleur</option>
                <option value="Chauffeur">Chauffeur</option>
                <option value="Admin Agence">Admin Agence</option>
              </select>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-bold uppercase tracking-widest text-on_surface_variant">Téléphone / Contact</label>
              <div className="flex flex-col gap-1">
                <div className="flex">
                  <span className="bg-surface_container_high h-full px-4 py-3 rounded-l-lg border border-r-0 border-charcoal_border text-on_surface_variant font-medium">+237</span>
                  <input 
                    {...register('phone')}
                    className={`bg-surface_container_low border ${errors.phone ? 'border-error_red' : 'border-charcoal_border'} rounded-r-lg p-3 text-on_surface focus:border-primary focus:ring-1 focus:ring-primary outline-none flex-1 transition-all`} 
                    type="tel"
                    placeholder="670112233"
                  />
                </div>
                {errors.phone && <span className="text-error_red text-[11px]">{errors.phone.message}</span>}
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-surface_container/30 border-t border-charcoal_border flex justify-end gap-3">
            <button 
              type="button"
              className="px-6 py-3 text-on_surface_variant font-semibold hover:text-on_surface hover:bg-surface_container_high rounded-lg transition-all" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Annuler
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-on_primary px-8 py-3 rounded-lg font-bold hover:brightness-110 shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting && <Loader2 size={18} className="animate-spin" />}
              {isSubmitting ? 'Création...' : 'Créer le Profil'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
