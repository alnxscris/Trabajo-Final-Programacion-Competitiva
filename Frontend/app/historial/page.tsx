"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function HistorialPage() {
  const router = useRouter();
  const [historial, setHistorial] = useState<any[]>([]);
  const [filtroFecha, setFiltroFecha] = useState("");

  // Función para formatear fecha GMT → Perú
  function formatearFecha(fechaISO: string) {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleString("es-PE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/historial`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setHistorial(data);
        else setHistorial([]);
      })
      .catch(() => setHistorial([]));
  }, []);

  // Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  // Eliminar 1 registro
  const eliminarRegistro = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (!confirm("¿Seguro que quieres eliminar este registro?")) return;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/historial/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (res.ok) {
      setHistorial((prev) => prev.filter((h) => h.id !== id));
    }
  };

  // Filtrar por fecha seleccionada
  const historialFiltrado = filtroFecha
    ? historial.filter((h) => h.fecha.startsWith(filtroFecha))
    : historial;

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

        <div className="h-[2px] bg-indigo-400" />
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">
          Historial de Búsquedas
        </h1>

      {/* FILTRO POR FECHA */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">
          Filtrar por fecha:
        </label>

        <div className="relative inline-block">
          <input
            type="date"
            value={filtroFecha}
            onChange={(e) => setFiltroFecha(e.target.value)}
            className="px-4 py-2 w-52 border rounded-lg pl-10 border-slate-300 
                      focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                      text-slate-700 bg-white cursor-pointer shadow-sm"
          />

          {/* Ícono de calendario */}
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
            📅
          </span>
        </div>
      </div>


        {/* TABLA */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-indigo-200 rounded-md overflow-hidden">
            <thead className="bg-indigo-50">
              <tr className="text-left">
                <th className="px-4 py-2 border-b border-indigo-200">Fecha</th>
                <th className="px-4 py-2 border-b border-indigo-200">Patrón buscado</th>
                <th className="px-4 py-2 border-b border-indigo-200">Archivo</th>
                <th className="px-4 py-2 border-b border-indigo-200 text-center">
                  Detalle
                </th>
                <th className="px-4 py-2 border-b border-indigo-200 text-center">
                  Eliminar
                </th>
              </tr>
            </thead>

            <tbody>
              {historialFiltrado.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-slate-500 italic">
                    No hay registros disponibles
                  </td>
                </tr>
              ) : (
                historialFiltrado.map((h) => (
                  <tr key={h.id}>
                    <td className="px-4 py-2 border-b">
                      {formatearFecha(h.fecha)}
                    </td>
                    <td className="px-4 py-2 border-b">{h.patron}</td>
                    <td className="px-4 py-2 border-b">{h.archivo}</td>

                    {/* Ver Detalle */}
                    <td className="px-4 py-2 border-b text-center">
                      <a
                        href={`/historial/${h.id}`}
                        className="text-indigo-600 hover:underline font-semibold"
                      >
                        Ver detalle
                      </a>
                    </td>

                    {/* Eliminar */}
                    <td className="px-4 py-2 border-b text-center">
                      <button
                        onClick={() => eliminarRegistro(h.id)}
                        className="text-red-600 hover:underline font-semibold"
                      >
                        Eliminar
                      </button>
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
