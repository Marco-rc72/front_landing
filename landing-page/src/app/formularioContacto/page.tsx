"use client";

import { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";

type FormData = {
  nombre_completo: string;
  correo: string;
  telefono: string;
  mensaje: string;
  token: string;
  Terminos: boolean;
};

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!;

export default function Formulario() {
  const [formData, setFormData] = useState<FormData>({
    nombre_completo: "",
    correo: "",
    telefono: "",
    mensaje: "",
    token: "",
    Terminos: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, type, value, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRecaptchaChange = (token: string | null) => {
    setFormData((prev) => ({
      ...prev,
      token: token || "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.token) {
      setError("Por favor completa el reCAPTCHA.");
      return;
    }

    console.log("🛫 Enviando datos al backend:", formData);

    try {
      const response = await fetch("http://localhost:3001/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess("Mensaje enviado con éxito.");
        setFormData({
          nombre_completo: "",
          correo: "",
          telefono: "",
          mensaje: "",
          token: "",
          Terminos: false,
        });
        recaptchaRef.current?.reset();
      } else {
        setError(result.error || "Fallo en la verificación.");
      }
    } catch (error) {
      console.error("❌ Error al enviar:", error);
      setError("Hubo un error al enviar el formulario.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8 mt-14">
      <div className="max-w-md mx-auto border border-gray-700 rounded-lg overflow-hidden">
        <div className="p-8">
          <h2 className="text-3xl font-extrabold text-center font-serif mb-8">
            Únete a la familia
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="nombre_completo" className="block text-sm mb-1">
                Nombre completo
              </label>
              <input
                type="text"
                id="nombre_completo"
                name="nombre_completo"
                value={formData.nombre_completo}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-sm focus:outline-none focus:border-white"
              />
            </div>

            <div>
              <label htmlFor="correo" className="block text-sm mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                id="correo"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-sm focus:outline-none focus:border-white"
              />
            </div>

            <div>
              <label htmlFor="telefono" className="block text-sm mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-sm focus:outline-none focus:border-white"
              />
            </div>

            <div>
              <label htmlFor="mensaje" className="block text-sm mb-1">
                Mensaje
              </label>
              <textarea
                id="mensaje"
                name="mensaje"
                rows={4}
                value={formData.mensaje}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-sm focus:outline-none focus:border-white"
              />
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                id="Terminos"
                name="Terminos"
                checked={formData.Terminos}
                onChange={handleChange}
                required
                className="mr-2 mt-1 mb-4"
              />
              <label htmlFor="Terminos" className="text-sm">
                Acepto los{" "}
                <a
                  href="/Terminos"
                  className="underline text-blue-400"
                  target="_blank"
                >
                  términos y condiciones
                </a>
              </label>
            </div>

            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={RECAPTCHA_SITE_KEY}
              onChange={handleRecaptchaChange}
            />

            <button
              type="submit"
              className="w-full bg-white text-black py-3 px-4 rounded-sm font-bold hover:bg-gray-300 transition-colors"
            >
              Enviar
            </button>

            {success && <p className="text-green-400 text-sm mt-2">{success}</p>}
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
