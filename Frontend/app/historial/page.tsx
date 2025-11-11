import Image from "next/image";

export default function HistorialPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* BARRA SUPERIOR */}
      <header className="border-b border-slate-200">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
          <nav className="flex items-center gap-8 text-sm font-medium">
            <a href="/" className="text-slate-900 hover:text-indigo-500">
              Inicio
            </a>
            <a
              href="/cargar-archivo"
              className="text-slate-900 hover:text-indigo-500"
            >
              Cargar Archivo
            </a>
            <a
              href="/historial"
              className="text-indigo-500 border-b-2 border-indigo-500 pb-1"
            >
              Historial
            </a>
            <button className="text-slate-900 hover:text-red-500">
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

        {/* Línea morada debajo del menú */}
        <div className="h-[2px] bg-indigo-400" />
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-8">
          Historial de Búsquedas
        </h1>

        {/* Filtro por fecha */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Filtrar por fecha"
              className="w-full rounded-md border border-indigo-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-10"
              readOnly
            />
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <span className="text-indigo-500 text-lg">▾</span>
            </div>
          </div>
        </div>

        {/* TABLA VACÍA */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-indigo-200 rounded-md overflow-hidden">
            <thead className="bg-indigo-50">
              <tr className="text-left">
                <th className="px-4 py-2 border-b border-indigo-200">Fecha</th>
                <th className="px-4 py-2 border-b border-indigo-200">
                  Patrón buscado
                </th>
                <th className="px-4 py-2 border-b border-indigo-200">
                  Archivo Procesado
                </th>
                <th className="px-4 py-2 border-b border-indigo-200 text-center">
                  Ver detalle
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-6 text-slate-500 italic"
                >
                  No hay registros disponibles
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
