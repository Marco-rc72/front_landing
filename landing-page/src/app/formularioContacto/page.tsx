"use client"
import { useState } from 'react';

export default function Formulario() {
  const [formData, setFormData] = useState({
    nombre_completo: '',
    correo: '',
    telefono: '',
    mensaje: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí implementarás la conexión a tu API
    console.log('Datos a enviar:', formData);
    // Ejemplo de fetch que implementarás luego:
    
    try {
      const response = await fetch('http://localhost:3001/api/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert('Mensaje enviado con éxito');
        setFormData({
          nombre_completo: '',
          correo: '',
          telefono: '',
          mensaje: ''
        });
      }
    } catch (error) {
      console.error('Error:', error);
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
              <label htmlFor="nombre_completo" className="block text-sm font-medium mb-1">
                Nombre completo
              </label>
              <input
                type="text"
                id="nombre_completo"
                name="nombre_completo"
                value={formData.nombre_completo}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-sm focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors duration-200"
              />
            </div>

            <div>
              <label htmlFor="correo" className="block text-sm font-medium mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                id="correo"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-sm focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors duration-200"
              />
            </div>

            <div>
              <label htmlFor="telefono" className="block text-sm font-medium mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-sm focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors duration-200"
              />
            </div>

            <div>
              <label htmlFor="mensaje" className="block text-sm font-medium mb-1">
                Mensaje
              </label>
              <textarea
                id="mensaje"
                name="mensaje"
                rows={4}
                value={formData.mensaje}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-sm focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors duration-200"
              ></textarea>
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-white text-black py-3 px-4 rounded-sm font-bold hover:bg-gray-300 transition-colors duration-200"
              >
                Enviar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}