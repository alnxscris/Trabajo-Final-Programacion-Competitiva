"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function HistorialPage() {
  const router = useRouter();
  const [historial, setHistorial] = useState<any[]>([]);

  useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    router.push("/");
    return;
  }

  fetch(`${process.env.NEXT_PUBLIC_API_URL}/historial`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((data) => {
      // SI ES ARRAY → OK
      if (Array.isArray(data)) {
        setHistorial(data);
        return;
      }

      // SI VIENE ENVUELTO (por si acaso)
      if (Array.isArray(data.historial)) {
        setHistorial(data.historial);
        return;
      }

      // SI VIENE ERROR → EVITA QUE ROMPA EL MAP
      setHistorial([]);
    })
    .catch(() => setHistorial([]));
}, []);

  // Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* BARRA SUPERIOR */}
      <header className="border-b border-slate-200">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
          
          {/* Menú */}
          <nav className="flex items-center gap-8 text-sm font-medium">
            <a href="/cargar-archivo" className="text-slate-900 hover:text-indigo-500">
              Cargar Archivo
            </a>

            <a
              href="/historial"
              className="text-indigo-500 border-b-2 border-indigo-500 pb-1"
            >
              Historial
            </a>

            <button
              onClick={handleLogout}
              className="text-slate-900 hover:text-red-500 transition"
            >
              Salir
            </button>
          </nav>

          <Image
            src="/escudo.png"
            alt="Escudo institucional"
            width={70}
            height={70}
            className="object-contain"
            priority
          />
        </div>

        {/* Línea morada */}
        <div className="h-[2px] bg-indigo-400" />
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-8">
          Historial de Búsquedas
        </h1>

        {/* TABLA DE HISTORIAL */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-indigo-200 rounded-md overflow-hidden">
            <thead className="bg-indigo-50">
              <tr className="text-left">
                <th className="px-4 py-2 border-b border-indigo-200">Fecha</th>
                <th className="px-4 py-2 border-b border-indigo-200">Patrón buscado</th>
                <th className="px-4 py-2 border-b border-indigo-200">Archivo Procesado</th>
                <th className="px-4 py-2 border-b border-indigo-200 text-center">
                  Ver detalle
                </th>
              </tr>
            </thead>

            <tbody>
              {historial.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center py-6 text-slate-500 italic"
                  >
                    No hay registros disponibles
                  </td>
                </tr>
              ) : (
                historial.map((h: any) => (
                  <tr key={h.id}>
                    <td className="px-4 py-2 border-b">{h.fecha}</td>
                    <td className="px-4 py-2 border-b">{h.patron}</td>
                    <td className="px-4 py-2 border-b">{h.archivo}</td>

                    {/*  BOTÓN FUNCIONAL PARA VER DETALLE */}
                    <td className="px-4 py-2 border-b text-center">
                      <a
                        href={`/historial/${h.id}`}
                        className="text-indigo-600 hover:underline font-semibold cursor-pointer"
                      >
                        Ver detalle
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
