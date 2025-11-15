"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import React from "react";

export default function LoginPage() {
  const router = useRouter();

  // ============================================================
  //  handleSubmit()
  //  Envía email y password al backend:
  //    POST /auth/login
  //  Si es correcto -> guarda token y redirige a /cargar-archivo
  // ============================================================
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    // Guardar token para futuras peticiones
    localStorage.setItem("token", data.token);

    router.push("/cargar-archivo");
  };

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center relative">
      {/* Escudo arriba a la derecha */}
      <div className="absolute top-6 right-10">
        <Image
          src="/escudo.png"
          alt="Escudo institucional"
          width={140}
          height={140}
          className="object-contain"
          priority
        />
      </div>

      {/* Contenedor principal */}
      <div className="w-full max-w-5xl mx-4 bg-white rounded-3xl shadow-xl p-10 md:p-16">
        {/* Título */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-center text-slate-900 leading-tight">
          SISTEMA DE IDENTIFICACION
          <br />
          DE SECUENCIAS DE ADN
        </h1>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="mt-12 space-y-5 max-w-2xl mx-auto"
        >
          <input
            name="email"
            type="text"
            placeholder="Usuario / Correo Electrónico"
            className="w-full rounded-md border border-indigo-300 px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />

          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            className="w-full rounded-md border border-indigo-300 px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />

          <button
            type="submit"
            className="w-full mt-6 rounded-md bg-indigo-500 hover:bg-indigo-600 transition-colors text-white font-semibold py-3 text-sm tracking-wide"
          >
            INICIAR SESIÓN
          </button>
        </form>

        {/* Registro */}
        <p className="mt-6 text-center text-sm text-slate-600">
          ¿No tienes cuenta?{" "}
          <a
            href="/registro"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Regístrate
          </a>
        </p>
      </div>
    </main>
  );
}
