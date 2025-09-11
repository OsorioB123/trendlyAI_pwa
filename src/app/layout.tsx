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
        <link href="https://unpkg.com/@geist-ui/fonts/geist-sans.css" rel="stylesheet" />
      </head>
      <body className="font-sans">
        <AuthProvider>
          <BackgroundProvider>
            {children}
          </BackgroundProvider>
        </AuthProvider>
      </body>
    </html>
  );
}