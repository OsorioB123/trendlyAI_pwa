import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "../contexts/AuthContext";
import { BackgroundProvider } from "../contexts/BackgroundContext";
import { ToastProvider } from "../components/ui/Toast";
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
