"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

export default function RegisterPage() {
  const router = useRouter();

  /**
 * Archivo: app/registro/page.tsx
 * Componente: RegisterPage
 *
 * Descripción general:
 *  Esta pantalla permite registrar nuevos usuarios dentro del sistema.
 *  Envía al backend los datos necesarios para crear la cuenta y valida
 *  que las contraseñas coincidan antes de enviarlas.
 *
 * Funcionalidades principales:
 *  - Captura de nombre, correo, contraseña y confirmación.
 *  - Validación de contraseñas coincidentes.
 *  - Envío de datos al backend mediante POST /auth/register.
 *  - Manejo de respuestas de error del servidor.
 *  - Redirección al login cuando el registro finaliza correctamente.
 *
 * Rol dentro del sistema:
 *  - Permite la creación de cuentas para acceder al módulo de análisis de ADN.
 *  - Garantiza un flujo de autenticación seguro para nuevos usuarios.
 */

  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const nombre = formData.get("nombre");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmar = formData.get("confirmar");

    // Validación básica
    if (password !== confirmar) {
      alert("Las contraseñas no coinciden");
      return;
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, password }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    alert("Registro exitoso. Ahora inicia sesión.");
    router.push("/");
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

      {/* Contenedor */}
      <div className="w-full max-w-4xl mx-4 bg-white rounded-3xl shadow-xl p-10 md:p-14">
        {/* Título */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-center text-slate-900">
          REGISTRARSE
        </h1>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="mt-10 space-y-4 max-w-xl mx-auto">
          <input
            name="nombre"
            type="text"
            placeholder="Nombre"
            className="w-full rounded-md border border-indigo-300 px-5 py-3 text-sm 
                       outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Correo Electrónico"
            className="w-full rounded-md border border-indigo-300 px-5 py-3 text-sm 
                       outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            className="w-full rounded-md border border-indigo-300 px-5 py-3 text-sm 
                       outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />

          <input
            name="confirmar"
            type="password"
            placeholder="Confirmar Contraseña"
            className="w-full rounded-md border border-indigo-300 px-5 py-3 text-sm 
                       outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />

          <button
            type="submit"
            className="w-full mt-6 rounded-md bg-indigo-500 hover:bg-indigo-600 
                       transition-colors text-white font-semibold py-3 text-sm tracking-wide"
          >
            REGISTRARSE
          </button>
        </form>

        {/* Enlace al login */}
        <p className="mt-6 text-center text-sm text-slate-600">
          ¿Ya tienes una cuenta?
        </p>
        <p className="text-center text-sm">
          <a
            href="/"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Iniciar Sesión
          </a>
        </p>
      </div>
    </main>
  );
}
