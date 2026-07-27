import "./globals.css";
import { Providers } from "@/components/providers/Providers";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "OPEP Agence - Management Portal",
  description: "Plateforme nationale de gestion de transport interurbain au Cameroun. Digitalisez vos agences avec une infrastructure robuste et souveraine.",
  keywords: ["OPEP", "transport", "Cameroun", "bus", "billetterie", "agence", "voyage", "interurbain"],
  authors: [{ name: "OPEP Cameroun" }],
  creator: "OPEP Cameroun",
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }],
    apple: [{ url: "/favicon.png", type: "image/png" }],
  },
  openGraph: {
    title: "OPEP Agence - Plateforme de Transport Interurbain",
    description: "Gestion digitale des agences de transport au Cameroun — réservation, billetterie, suivi GPS et validation de tickets.",
    type: "website",
    locale: "fr_CM",
    siteName: "OPEP Agence",
  },
  twitter: {
    card: "summary_large_image",
    title: "OPEP Agence - Transport Interurbain",
    description: "Plateforme nationale de gestion de transport au Cameroun.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="antialiased selection:bg-primary/30 selection:text-primary">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
