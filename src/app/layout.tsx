import type { Metadata } from "next";
import { AuthProvider } from "../contexts/AuthContext";
import { BackgroundProvider } from "../contexts/BackgroundContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "TrendlyAI - Plataforma de Criação de Conteúdo com IA",
  description: "Crie conteúdo viral com inteligência artificial",
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#8B5CF6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
        <link href="https://unpkg.com/@geist-ui/fonts/geist-sans.css" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: 'Inter, sans-serif', WebkitTapHighlightColor: 'transparent', color: 'white' }}>
        <AuthProvider>
          <BackgroundProvider>
            {children}
          </BackgroundProvider>
        </AuthProvider>
      </body>
    </html>
  );
}