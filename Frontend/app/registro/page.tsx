import Image from "next/image";

export default function RegisterPage() {
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

      {/* Main */}
      <div className="w-full max-w-4xl mx-4 bg-white rounded-3xl shadow-xl p-10 md:p-14">
        {/* Título */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-center text-slate-900">
          REGISTRARSE
        </h1>

        {/* Formulario */}
        <form className="mt-10 space-y-4 max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Nombre"
            className="w-full rounded-md border border-indigo-300 px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />

          <input
            type="email"
            placeholder="Correo Electronico"
            className="w-full rounded-md border border-indigo-300 px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />

          <input
            type="password"
            placeholder="Contraseña"
            className="w-full rounded-md border border-indigo-300 px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />

          <input
            type="password"
            placeholder="Confirmar Contraseña"
            className="w-full rounded-md border border-indigo-300 px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />

          <button
            type="submit"
            className="w-full mt-6 rounded-md bg-indigo-500 hover:bg-indigo-600 transition-colors text-white font-semibold py-3 text-sm tracking-wide"
          >
            REGISTRARSE
          </button>
        </form>

        {/* Enlace a iniciar sesión */}
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