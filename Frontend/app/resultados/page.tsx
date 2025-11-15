"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// Función que genera un CSV y fuerza descarga
function descargarCSV(datos: any[]) {
  if (!datos || datos.length === 0) {
    alert("No hay resultados para descargar.");
    return;
  }

  // Crear encabezado CSV
  let csv = "Secuencia,Coincidencias\n";

  // Agregar filas
  datos.forEach((item) => {
    csv += `"${item.cadena}","${item.coincidencias}"\n`;
  });

  // Crear archivo Blob
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

  // Crear enlace temporal
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "resultados_busqueda.csv";

  // Descargar
  link.click();

  // Limpiar
  URL.revokeObjectURL(url);
}

export default function ResultadosPage() {
  const [resultados, setResultados] = useState<any[]>([]);

   //  Cargar resultados guardados en localStorage
  useEffect(() => {
    const data = localStorage.getItem("resultados");

    if (data) {
      setResultados(JSON.parse(data));
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* BARRA SUPERIOR */}
      <header className="border-b border-slate-200">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
          <span className="text-lg font-semibold text-slate-900">
            Resultados
          </span>

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
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-8">
          Resultados de la búsqueda
        </h1>

        {/* TABLA DE RESULTADOS */}
        <div className="overflow-x-auto mb-8">
          <table className="w-full text-sm border border-indigo-200 rounded-md overflow-hidden">
            <thead className="bg-indigo-50">
              <tr className="text-left">
                <th className="px-4 py-2 border-b border-indigo-200">
                  Secuencia
                </th>
                <th className="px-4 py-2 border-b border-indigo-200">
                  Coincidencias
                </th>
              </tr>
            </thead>

            <tbody>
              {resultados.length === 0 ? (
                <tr>
                  <td
                    colSpan={2}
                    className="text-center py-6 text-slate-500 italic"
                  >
                    No hay resultados para mostrar.
                  </td>
                </tr>
              ) : (
                resultados.map((r, i) => (
                  <tr key={i}>
                    <td className="px-4 py-2 border-b">{r.cadena}</td>
                    <td className="px-4 py-2 border-b">{r.coincidencias}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* BOTÓN DESCARGAR CSV */}
        <button
          onClick={() => descargarCSV(resultados)}
          className="px-6 py-3 rounded-md bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-sm tracking-wide"
        >
          DESCARGAR RESULTADOS (CSV)
        </button>
      </main>
    </div>
  );
}
