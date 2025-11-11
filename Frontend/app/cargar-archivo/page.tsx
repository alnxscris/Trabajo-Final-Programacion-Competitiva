"use client";

import { useState } from "react";
import type React from "react";
import Image from "next/image";

export default function CargarArchivoPage() {
  const [fileName, setFileName] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      setFileName("");
      setError("");
      return;
    }

    // Validar extensión .csv
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setFileName("");
      setError("Solo se permiten archivos con extensión .csv");
      // Limpia el input de archivo
      e.target.value = "";
      return;
    }

    setError("");
    setFileName(file.name);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validar que haya archivo .csv seleccionado
    if (!fileName) {
      setError("Por favor, seleccione un archivo .csv antes de ejecutar la búsqueda.");
      return;
    }

    setError("");
    setIsAnalyzing(true); // aquí empieza la animación

    // Cuando tengas la lógica real, aquí iría la llamada al backend
    // y luego podrías hacer setIsAnalyzing(false) cuando termine.
  };

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
              className="text-indigo-500 border-b-2 border-indigo-500 pb-1"
            >
              Cargar Archivo
            </a>
            <a
              href="/historial"
              className="text-slate-900 hover:text-indigo-500"
            >
              Historial
            </a>
            <button className="text-slate-900 hover:text-red-500">Salir</button>
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
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-snug mb-10">
          Cargue el archivo CSV con las
          <br />
          secuencias genéticas
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
          {/* Selector de archivo */}
          <div>
            <label className="inline-flex items-center justify-center rounded-md border border-indigo-300 px-6 py-2.5 text-sm font-medium text-slate-800 cursor-pointer hover:bg-indigo-50">
              {fileName || "Seleccionar archivo"}
              <input
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>

          {/* Mensaje de error si algo está mal */}
          {error && (
            <p className="text-red-500 text-sm font-medium">{error}</p>
          )}

          {/* Input de patrón */}
          <div>
            <input
              type="text"
              placeholder="Patrón a buscar"
              className="w-full rounded-md border border-indigo-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Botón ejecutar búsqueda */}
          <button
            type="submit"
            className="w-full mt-4 rounded-md bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 text-sm tracking-wide transition-colors"
          >
            EJECUTAR BÚSQUEDA
          </button>
        </form>

        {/* Animación SOLO después de darle al botón */}
        {isAnalyzing && (
          <div className="mt-8 flex items-center gap-3 text-sm text-slate-600">
            <span className="inline-flex h-5 w-5 items-center justify-center">
              <span className="h-4 w-4 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
            </span>
            <span>Analizando secuencias...</span>
          </div>
        )}
      </main>
    </div>
  );
}
