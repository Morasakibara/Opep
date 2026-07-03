'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { LogIn, Shield, Mail, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, isLoading: isAuthLoading } = useAuth();
  const [error, setError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    try {
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // DEV ONLY — Remplacer par un vrai appel API en production
      if (data.email === 'admin@opep.cm' && data.password === 'password') {
        login('mock-jwt-token', {
          id: '1',
          name: 'Super Admin',
          email: data.email,
          role: 'SUPER_ADMIN',
        });
      } else {
        setError('Identifiants invalides. Utilisez admin@opep.cm / password');
      }
    } catch (err) {
      setError('Une erreur est survenue lors de la connexion.');
    }
  };

  return (
    <div className="min-h-screen bg-[#111316] flex items-center justify-center p-6 font-jakarta relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md z-10">
        <div className="glass-card p-10 rounded-[32px] border border-charcoal_border bg-surface_container/40 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-on_primary mb-6 shadow-lg shadow-primary/20 rotate-3">
              <Shield size={32} />
            </div>
            <h1 className="text-3xl font-bold text-on_surface tracking-tight">OPEP Admin</h1>
            <p className="text-on_surface_variant mt-2">Connectez-vous au portail de gestion souverain</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Adresse Email"
              placeholder="admin@opep.cm"
              leftIcon={<Mail size={18} />}
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Mot de passe"
              type="password"
              placeholder="••••••••"
              leftIcon={<Lock size={18} />}
              error={errors.password?.message}
              {...register('password')}
            />

            {error && (
              <div className="p-4 bg-error_red/10 border border-error_red/20 rounded-xl text-error_red text-[13px] font-medium text-center animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full py-4 text-[16px] rounded-2xl"
              isLoading={isSubmitting}
              leftIcon={<LogIn size={20} />}
            >
              Se connecter
            </Button>
          </form>

          <div className="mt-10 text-center border-t border-charcoal_border pt-6">
            <p className="text-[12px] text-on_surface_variant uppercase tracking-widest font-bold">
              Sécurisé par le protocole OPEP
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
