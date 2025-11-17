"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";

/**
 * Archivo: app/historial/[id]/page.tsx
 * Componente: HistorialDetallePage
 *
 * Descripción general:
 *  Muestra el detalle completo de un registro específico del historial.
 *  Incluye datos generales del análisis y todas las coincidencias registradas.
 *
 * Lógica importante:
 *  - Obtiene el parámetro dinámico “id” mediante useParams.
 *  - Verifica el token y solicita GET /historial/{id}.
 *  - Maneja estados de carga, error y datos completos.
 *
 * Rol dentro del sistema:
 *  - Permite examinar detalladamente los resultados previos procesados por KMP.
 *  - Complementa el historial general ofreciendo acceso individual a cada búsqueda.
 */


export default function HistorialDetallePage() {
  const router = useRouter();

  //  ESTA ES LA FORMA CORRECTA EN NEXT 13+
  const params = useParams();
  const id = params.id as string;

  const [registro, setRegistro] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/historial/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          setError(err.error || "Error desconocido");
          setLoading(false);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (!data || !data.registro) {
          setError("Registro no encontrado");
          setLoading(false);
          return;
        }

        setRegistro(data.registro);
        setLoading(false);
      })
      .catch(() => {
        setError("Error cargando el detalle.");
        setLoading(false);
      });
  }, [id]);

  //  LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Cargando...
      </div>
    );
  }

  //  ERROR
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-red-600">Error</h1>
        <p className="mt-2 text-slate-600">{error}</p>

        <button
          onClick={() => router.push("/historial")}
          className="mt-6 px-6 py-3 bg-indigo-500 text-white rounded-md"
        >
          Volver al historial
        </button>
      </div>
    );
  }

  //  OK — MOSTRAR DETALLE
  return (
    <div className="min-h-screen bg-white">
      {/* BARRA SUPERIOR */}
      <header className="border-b border-slate-200">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
          <span className="text-lg font-semibold text-slate-900">
            Detalle del Historial #{registro.id}
          </span>

          <Image
            src="/escudo.png"
            alt="Escudo institucional"
            width={70}
            height={70}
            priority
          />
        </div>
        <div className="h-[2px] bg-indigo-400" />
      </header>

      {/* CONTENIDO */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-extrabold mb-6">Detalle de búsqueda</h1>

        {/* INFO GENERAL */}
        <div className="mb-8 p-5 border rounded-md bg-indigo-50">
          <p><strong>ID:</strong> {registro.id}</p>
          <p><strong>Fecha:</strong> {registro.fecha}</p>
          <p><strong>Patrón buscado:</strong> {registro.patron}</p>
          <p><strong>Archivo analizado:</strong> {registro.archivo}</p>
        </div>

        {/* RESULTADOS */}
        <h2 className="text-2xl font-bold mb-4">Resultados encontrados</h2>

        <div className="overflow-x-auto">
          <table className="w-full border rounded-md text-sm">
            <thead className="bg-indigo-100">
              <tr>
                <th className="px-4 py-2 border-b">Nombre</th>
                <th className="px-4 py-2 border-b">Secuencia</th>
                <th className="px-4 py-2 border-b">Coincidencias</th>
              </tr>
            </thead>

            <tbody>
              {registro.resultados.map((r: any, i: number) => (
                <tr key={i}>
                  <td className="px-4 py-2 border-b">{r.nombre}</td>
                  <td className="px-4 py-2 border-b">{r.cadena}</td>
                  <td className="px-4 py-2 border-b">{r.coincidencias}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          onClick={() => router.push("/historial")}
          className="mt-8 px-6 py-3 bg-indigo-500 text-white rounded-md"
        >
          Volver al historial
        </button>
      </main>
    </div>
  );
}
