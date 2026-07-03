'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Shield, Zap, Globe, ArrowRight, Bus, Users, MapPin, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#111316] text-[#e2e2e6] font-jakarta overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#111316]/80 backdrop-blur-md border-b border-charcoal_border">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on_primary font-bold text-xl shadow-lg shadow-primary/20 rotate-3">
              O
            </div>
            <span className="text-2xl font-bold tracking-tight">OPEP</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-[14px] font-bold uppercase tracking-widest text-on_surface_variant">
            <a href="#features" className="hover:text-primary transition-colors">Solutions</a>
            <a href="#network" className="hover:text-primary transition-colors">Réseau</a>
            <a href="#about" className="hover:text-primary transition-colors">Souveraineté</a>
          </div>
          <Link href="/login">
            <Button className="rounded-full px-8 py-2.5" leftIcon={<Users size={18} />}>
              Portail Admin
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-24 px-6 overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-full opacity-20 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-[40%] h-[60%] bg-primary rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-20 right-1/4 w-[40%] h-[60%] bg-secondary rounded-full blur-[120px] animate-pulse delay-700" />
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[12px] font-bold uppercase tracking-[0.2em] mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Zap size={14} /> La Révolution du Transport Interurbain
          </div>
          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-8 leading-[0.9] animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Souveraineté. <br /> <span className="text-primary">Sécurité.</span> Mobilité.
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-on_surface_variant mb-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
            OPEP est la plateforme nationale de gestion de transport interurbain au Cameroun. 
            Digitalisez vos agences avec une infrastructure robuste et souveraine.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-16 duration-1000">
            <Link href="/reproduction/rejoindre-opep-inscription-agence">
              <Button className="rounded-full px-10 py-5 text-lg" rightIcon={<ArrowRight size={20} />}>
                Rejoindre le Réseau
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="rounded-full px-10 py-5 text-lg border-charcoal_border">
                Se Connecter
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="mt-24 max-w-6xl mx-auto relative group">
          <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full scale-75 group-hover:scale-100 transition-transform duration-1000"></div>
          <div className="glass-card rounded-[40px] border border-charcoal_border overflow-hidden shadow-2xl relative z-10">
            <Image 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA642ETJenAC14xUztknNM5fqRssExwnPi-24B2Def_gUUEXSMIexszon5qFyQcijxARQTjQV7x4wROkqiRHBhLYVtFX0hrp-EQiROVRCH27ik4qAh6ibnnClkHE63S_V1xMKyFfjdbwZumuMRjtl9Rcltc3QsAdz4JnmT-0ElW8D07PN0hOSFtMvaStqIXq3kl9TrHffWL7npxjhs35I0eq-uJBY1kHrU7JKh227rtnmsfkpdzauolFTnpepfo7DaWj46XbU8ghPs" 
              alt="OPEP Dashboard" 
              width={1200}
              height={675}
              className="w-full h-auto object-cover opacity-80"
              priority
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-surface_dim">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Une Infrastructure Intégrale</h2>
            <p className="text-on_surface_variant">Tout ce dont vous avez besoin pour piloter votre agence de transport.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Shield className="text-primary" size={32} />}
              title="Sécurité Totale"
              desc="Contrôle biométrique des passagers et géolocalisation en temps réel de tous vos bus."
            />
            <FeatureCard 
              icon={<Globe className="text-secondary" size={32} />}
              title="Gestion Souveraine"
              desc="Toutes les données sont hébergées sur le territoire national, sous votre contrôle exclusif."
            />
            <FeatureCard 
              icon={<Zap className="text-tertiary" size={32} />}
              title="Billetterie Digitale"
              desc="Vente en ligne, via mobile money ou en guichet avec impression de reçus sécurisés."
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatItem label="Passagers / mois" value="1.2M+" />
          <div className="h-full w-[1px] bg-charcoal_border hidden md:block"></div>
          <StatItem label="Agences Affiliées" value="450+" />
          <div className="h-full w-[1px] bg-charcoal_border hidden md:block"></div>
          <StatItem label="Trajets / jour" value="2,400+" />
          <div className="h-full w-[1px] bg-charcoal_border hidden md:block"></div>
          <StatItem label="Sécurité Routière" value="100%" />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto glass-card rounded-[48px] p-12 md:p-20 text-center border border-primary/20 bg-primary/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000"></div>
          <h2 className="text-4xl md:text-6xl font-bold mb-8">Prêt à transformer votre mobilité ?</h2>
          <p className="text-xl text-on_surface_variant mb-12 max-w-2xl mx-auto">
            Rejoignez l'écosystème OPEP aujourd'hui et bénéficiez d'une visibilité nationale accrue.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button className="rounded-full px-12 py-6 text-xl shadow-2xl shadow-primary/20">
              Demander une Démo
            </Button>
            <p className="text-on_surface_variant font-medium">Ou <Link href="/login" className="text-primary hover:underline">accédez à votre espace</Link></p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-charcoal_border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on_primary font-bold shadow-lg shadow-primary/20">
              O
            </div>
            <span className="text-xl font-bold tracking-tight">OPEP</span>
          </div>
          <p className="text-on_surface_variant text-sm">© 2026 OPEP Cameroun. Tous droits réservés. Projet Souverain.</p>
          <div className="flex gap-6 text-on_surface_variant">
            <a href="#" className="hover:text-primary transition-colors text-sm font-bold uppercase tracking-widest">Confidentialité</a>
            <a href="#" className="hover:text-primary transition-colors text-sm font-bold uppercase tracking-widest">Conditions</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="glass-card p-10 rounded-[32px] border border-charcoal_border hover:border-primary transition-all group hover:-translate-y-2 duration-300">
      <div className="w-16 h-16 rounded-2xl bg-surface_container_high flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-on_surface_variant leading-relaxed">{desc}</p>
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center group">
      <p className="text-[12px] font-bold text-on_surface_variant uppercase tracking-widest mb-2 group-hover:text-primary transition-colors">{label}</p>
      <p className="text-4xl md:text-5xl font-bold tracking-tighter group-hover:scale-110 transition-transform duration-500">{value}</p>
    </div>
  );
}
