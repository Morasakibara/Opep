import "./globals.css";

export const metadata = {
  title: "OPEP Agence",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
