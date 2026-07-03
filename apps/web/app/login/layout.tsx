import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Connexion - OPEP Agence',
  description: 'Connectez-vous au portail de gestion souverain OPEP. Accédez à votre espace agence de transport interurbain au Cameroun.',
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
