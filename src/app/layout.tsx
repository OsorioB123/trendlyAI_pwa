import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "../contexts/AuthContext";
import { BackgroundProvider } from "../contexts/BackgroundContext";
import { ToastProvider } from "../components/ui/Toast";
import ServiceWorkerRegister from "../components/common/ServiceWorkerRegister";
import NetworkStatusBanner from "../components/common/NetworkStatusBanner";
import CommandPalette from "../components/navigation/CommandPalette";
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

// Fonts from next/font must be initialized at module scope
const inter = Inter({ subsets: ["latin"], display: "swap" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={inter.className}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link href="https://unpkg.com/@geist-ui/fonts/geist-sans.css" rel="stylesheet" />
        <style>{`
          .skip-link { position: absolute; left: -9999px; top: auto; width: 1px; height: 1px; overflow: hidden; }
          .skip-link:focus { position: fixed; left: 16px; top: 16px; width: auto; height: auto; padding: 10px 14px; background: #fff; color: #000; border-radius: 8px; z-index: 1000; }
        `}</style>
      </head>
      <body style={{ WebkitTapHighlightColor: 'transparent', color: 'white' }}>
        <a href="#main-content" className="skip-link">Pular para conteúdo principal</a>
        <AuthProvider>
          <BackgroundProvider>
            <ToastProvider>
              <ServiceWorkerRegister />
              <NetworkStatusBanner />
              <CommandPalette />
              <div id="main-content" role="main" tabIndex={-1}>
                {children}
              </div>
            </ToastProvider>
          </BackgroundProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
