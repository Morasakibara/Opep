import React from 'react';
import { ExternalLink } from 'lucide-react';
import Image from 'next/image';

const AGENCIES = [
  {
    name: 'General Express',
    info: 'Yaoundé HQ • 12 Buses',
    status: 'Active',
    statusColor: 'text-on_surface',
    subStatus: 'Verified',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQD-3lKfC2N6nwS8vrvSqpGpgb8ozKoar6Zij2-BUssrENdF9KUf2P7l0h3qHDtmZ2gJi4rmGdtVlRCcLiGni9PG67K6Re8XwWFlNd2vjcsTJvd6LDKTfayEsTawBJDZ-ToSYoXDH9k45MFVlC_-nKE-cwOLBZKyl6iSGY-RNcNgjdCM0UchDuvtx7bHSeF34_66_tuD9q03DGgbGash8yOiez631WS2Xw_6rwpzDzYs6xA_BYxnqpM4mf4UCGyrEcdLiaQLad7Ec'
  },
  {
    name: 'Touristique Express',
    info: 'Douala Base • 24 Buses',
    status: 'Active',
    statusColor: 'text-on_surface',
    subStatus: 'Verified',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDy0dtoo8jO2idfBIRwp-XJZPgdBOuH7XboapefhLLtnZqcTfeQcK_apgTNAD6YxsA53wt0nUvb11jnYEK09eOJFpLbEMpshY1layGDk4vrFpnfcqvw0ma5Fw7meZRHR29lKwaetVyu9dvFjykqQAXeN1r6rpOYjY0XAWJxLMzD2-1mXWmGfHNikhdU9u6V-LKX6l-uQEUDqlCeCjMwttJ7-dyk3_7fkQmCkR9DWmW8w_lkoSMKEv7qRbQyg-brxyfPnfhOCXt5SFs'
  },
  {
    name: 'Buca Voyage',
    info: 'Kribi Route • 8 Buses',
    status: 'Pending',
    statusColor: 'text-warning_yellow',
    subStatus: 'Reviewing',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUAEw-zsFgN6S62ba_01Jenpujo9ZDMMb1g60MRdhfOwJmOS3BEsn1FNNIObJEotpUaphk7NNsD7p52NNXOoTZPojMwwzl4j4KV2ymAd-OlXhcUa9nUdgR_64kcKALZ4c5jHEvfFp0T-HH3FTZLg-qCDGPyFd_SGWqf2kcmoeTWICG6Bq7V-xZQ5MJ9fRw1IScMKquyC3vQAtysXAoFgRrGJdIi5DHzjcjeoSIP8toEn6R5H4bumgizUszwWXsrLuXj-HKyBStZbM'
  },
  {
    name: 'Global Travel',
    info: 'Bamenda • 15 Buses',
    status: 'Active',
    statusColor: 'text-on_surface',
    subStatus: 'Verified',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBeq5EnpAAh4uZkNXoJ3cqnsz8HjCXPf5EoN2BJIpNXbzRautSijycE2SXHUV2wWOrTtNNOXzf1vH3P_DxHZVj_Jnyo6cpAscL0yv0a0q7QNLHimAEcRCOMBF9JEjWcTco91e589zQuzopslcSnQ-Y3yW_AoPVD-6D6SNbbERvtTrKozOwTSq3sBU9UyVClCz80D2AjTNQoXIc6cWSmUICY11zM99LgC0K_EeRda0rSiXaiwKAl9AV4PRYNeubZRsXUqyMHhbB_bYw'
  }
];

export default function AgenciesList() {
  return (
    <div className="glass-card rounded-2xl p-6 flex flex-col border border-charcoal_border bg-surface_container/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[18px] font-bold text-on_surface">New Agencies</h3>
        <a className="text-primary text-[14px] font-medium hover:underline flex items-center gap-1" href="#">
          View All <ExternalLink size={14} />
        </a>
      </div>
      <div className="space-y-4 flex-1 overflow-y-auto max-h-[350px] pr-2 custom-scrollbar">
        {AGENCIES.map((agency, index) => (
          <div 
            key={index} 
            className="flex items-center gap-4 p-3 rounded-xl bg-surface_container_low border border-charcoal_border hover:bg-surface_container_high transition-all cursor-pointer group"
          >
            <div className="relative w-12 h-12 rounded-lg bg-white flex items-center justify-center p-1.5 shadow-inner">
              <Image fill className="object-contain" src={agency.logo} alt={agency.name} />
            </div>
            <div className="flex-1">
              <p className="text-[16px] font-bold text-on_surface group-hover:text-primary transition-colors">{agency.name}</p>
              <p className="text-[12px] text-on_surface_variant">{agency.info}</p>
            </div>
            <div className="text-right">
              <p className={`text-[14px] font-bold ${agency.statusColor}`}>{agency.status}</p>
              <p className="text-[10px] text-on_surface_variant uppercase tracking-wider">{agency.subStatus}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
