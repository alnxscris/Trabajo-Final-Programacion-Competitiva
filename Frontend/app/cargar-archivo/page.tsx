"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

/**
 * Archivo: app/cargar-archivo/page.tsx
 * Componente: CargarArchivoPage
 *
 * Descripción general:
 *  Esta pantalla permite al usuario cargar el archivo CSV que contiene las secuencias de ADN
 *  junto con el patrón que desea buscar. Es el núcleo operativo del sistema, ya que desde aquí
 *  se inicia el análisis con el algoritmo KMP ejecutado en el backend.
 *
 * Funciones principales:
 *  - handleFileChange:
 *      Valida que el archivo seleccionado sea un .csv y actualiza el nombre del archivo mostrado.
 *
 *  - handleSubmit:
 *      Construye un FormData con el archivo y el patrón, envía la solicitud al backend mediante
 *      POST /search/ejecutar, maneja errores de validación y muestra un spinner durante el análisis.
 *
 * Flujo general:
 *  1. Usuario selecciona el archivo CSV.
 *  2. Usuario ingresa el patrón a buscar.
 *  3. El componente envía la solicitud al backend con JWT.
 *  4. El backend ejecuta el algoritmo KMP en C++.
 *  5. La respuesta se guarda en localStorage como “resultados”.
 *  6. Se redirige a /resultados.
 *
 * Rol dentro del sistema:
 *  - Es la pantalla principal del proyecto.
 *  - Orquesta el análisis, validaciones y comunicación directa con el backend.
 */


export default function CargarArchivoPage() {
  const router = useRouter();

  const fileRef = useRef<HTMLInputElement>(null);
  const patternRef = useRef<HTMLInputElement>(null);

  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      setFileName("");
      return;
    }

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("Solo se permiten archivos CSV.");
      e.target.value = "";
      return;
    }

    setError("");
    setFileName(file.name);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const file = fileRef.current?.files?.[0];
    const patron = patternRef.current?.value;

    if (!file) return setError("Debe seleccionar un archivo CSV.");
    if (!patron) return setError("Debe ingresar un patrón.");

    setIsAnalyzing(true);

    const token = localStorage.getItem("token");
    if (!token) return router.push("/");

    // FormData para enviar archivo y patrón
    const formData = new FormData();
    formData.append("archivo", file);
    formData.append("patron", patron);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/search/ejecutar`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();

    setIsAnalyzing(false);

    if (!res.ok) {
      setError(data.error || "Error en el servidor.");
      return;
    }

    // Guardar resultados
    localStorage.setItem("resultados", JSON.stringify(data.resultados));

    router.push("/resultados");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* BARRA SUPERIOR */}
      <header className="border-b border-slate-200">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
          <nav className="flex items-center gap-8 text-sm font-medium">
            <a href="/cargar-archivo" className="text-indigo-500 border-b-2 border-indigo-500 pb-1">
              Cargar Archivo
            </a>
            <a href="/historial" className="text-slate-900 hover:text-indigo-500">
              Historial
            </a>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                router.push("/");
              }}
              className="text-slate-900 hover:text-red-500"
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
          />
        </div>
        <div className="h-[2px] bg-indigo-400"></div>
      </header>

      {/* CONTENIDO */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-10 text-slate-900">
          Cargue el archivo CSV con las secuencias genéticas
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
          <label className="inline-flex items-center rounded-md border border-indigo-300 px-6 py-2.5 text-sm cursor-pointer hover:bg-indigo-50">
            {fileName || "Seleccionar archivo"}
            <input
              ref={fileRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          <input
            ref={patternRef}
            type="text"
            placeholder="Patrón a buscar"
            className="w-full rounded-md border border-indigo-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full mt-4 rounded-md bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 text-sm tracking-wide"
          >
            EJECUTAR BÚSQUEDA
          </button>
        </form>

        {/* Animación */}
        {isAnalyzing && (
          <div className="mt-8 flex items-center gap-3 text-sm text-slate-600">
            <span className="inline-flex h-5 w-5 items-center justify-center">
              <span className="h-4 w-4 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></span>
            </span>
            Analizando secuencias...
          </div>
        )}
      </main>
    </div>
  );
}
