import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Sistema de Identificación de Secuencias de ADN",
  description:
    "Plataforma para la carga, análisis y búsqueda de secuencias genéticas con algoritmos KMP, RK y AC.",
  icons: {
    icon: "/escudo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <meta
          name="theme-color"
          content="#6366F1"
        />
      </head>
      <body
        className={`${inter.variable} antialiased bg-slate-50 text-slate-900`}
      >
        {children}
      </body>
    </html>
  );
}
