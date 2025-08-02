"use client";

import { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";

type FormData = {
  nombre_completo: string;
  correo: string;
  telefono: string;
  mensaje: string;
  token: string;
  aceptaTerminos: boolean;
};

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_KEY!;

// Funciones de sanitización
const sanitizeNombre = (input: string): string => {
  // Permite letras, espacios y acentos
  return input.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/g, '');
};

const sanitizeEmail = (input: string): string => {
  // Validación básica de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(input) ? input : '';
};

const sanitizeTelefono = (input: string): string => {
  // Permite solo números
  return input.replace(/\D/g, '');
};

const sanitizeMensaje = (input: string): string => {
  // Elimina etiquetas HTML/scripts para prevenir XSS
  return input.replace(/<[^>]*>?/gm, '');
};

export default function Formulario() {
  const [formData, setFormData] = useState<FormData>({
    nombre_completo: "",
    correo: "",
    telefono: "",
    mensaje: "",
    token: "",
    aceptaTerminos: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const recaptchaRef = useRef<any>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, type, value, checked } = e.target as HTMLInputElement;
    
    let sanitizedValue = value;
    
    // Aplicar sanitización según el campo
    switch (name) {
      case 'nombre_completo':
        sanitizedValue = sanitizeNombre(value);
        break;
      case 'correo':
        sanitizedValue = value; // La validación se hará al enviar
        break;
      case 'telefono':
        sanitizedValue = sanitizeTelefono(value);
        break;
      case 'mensaje':
        sanitizedValue = sanitizeMensaje(value);
        break;
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : sanitizedValue,
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

    // Validación de campos antes de enviar
    if (!formData.token) {
      setError("Por favor completa el reCAPTCHA.");
      return;
    }

    if (!sanitizeEmail(formData.correo)) {
      setError("Por favor ingresa un correo electrónico válido.");
      return;
    }

    if (!formData.aceptaTerminos) {
      setError("Debes aceptar los términos y condiciones.");
      return;
    }

    console.log("🛫 Enviando datos al backend:", formData);

    try {
      const response = await fetch("http://167.172.150.250:10000/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          mensaje: sanitizeMensaje(formData.mensaje) // Sanitización adicional al enviar
        }),
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
          aceptaTerminos: false,
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
                id="aceptaTerminos"
                name="aceptaTerminos"
                checked={formData.aceptaTerminos}
                onChange={handleChange}
                required
                className="mr-2 mt-1 mb-4"
              />
              <label htmlFor="aceptaTerminos" className="text-sm">
                Acepto los{" "}
                <a
                  href="/aceptaTerminos"
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