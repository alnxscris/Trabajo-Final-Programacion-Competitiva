import Image from "next/image";

export default function ResultadosPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* BARRA SUPERIOR */}
      <header className="border-b border-slate-200">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
          <span className="text-base md:text-lg font-semibold text-slate-900">
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

        {/* Línea morada */}
        <div className="h-[2px] bg-indigo-400" />
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-8">
          Búsqueda completa con éxito
        </h1>

        {/* TABLA DE RESULTADOS (estructura vacía lista para llenar) */}
        <div className="overflow-x-auto mb-8">
          <table className="w-full text-sm border border-indigo-200 rounded-md overflow-hidden">
            <thead className="bg-indigo-50">
              <tr className="text-left">
                <th className="px-4 py-2 border-b border-indigo-200">
                  ID de muestra
                </th>
                <th className="px-4 py-2 border-b border-indigo-200">
                  Secuencia
                </th>
                <th className="px-4 py-2 border-b border-indigo-200">
                  Tipo de coincidencia
                </th>
                <th className="px-4 py-2 border-b border-indigo-200">
                  Algoritmo utilizado
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Aquí luego mapearás tus resultados reales */}
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-6 text-slate-500 italic"
                >
                  No hay resultados para mostrar.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* BOTÓN DESCARGAR CSV */}
        <button
          type="button"
          className="px-6 py-3 rounded-md bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-sm tracking-wide"
        >
          DESCARGAR RESULTADOS (CSV)
        </button>
      </main>
    </div>
  );
}
