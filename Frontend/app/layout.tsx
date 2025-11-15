import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sistema de Identificación de Secuencias de ADN",
  description:
    "Plataforma para la carga, análisis y búsqueda de secuencias genéticas con algoritmos KMP.",
  icons: {
    icon: "/escudo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <meta name="theme-color" content="#6366F1" />
      </head>

      {/* Quitamos Inter para evitar errores de fonts */}
      <body className="antialiased bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}

