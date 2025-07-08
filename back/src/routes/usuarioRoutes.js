const express = require('express');
const axios = require('axios');
const pool = require('../db');
const router = express.Router();

const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY || '6Lc67m4rAAAAAP33KIR7HGnMb51dRWZf2-shfV-U';

router.post('/', async (req, res) => {
  const { nombre_completo, correo, telefono, mensaje, token, Terminos } = req.body;

  // 🧾 Debug: Ver lo que llega al backend
  console.log('🛬 Datos recibidos en el backend:');
  console.log('nombre_completo:', nombre_completo);
  console.log('correo:', correo);
  console.log('telefono:', telefono);
  console.log('mensaje:', mensaje);
  console.log('token:', token);
  console.log('Terminos:', Terminos, '| Tipo:', typeof Terminos);

  // Validación básica
  if (!nombre_completo || !correo || !token) {
    return res.status(400).json({ success: false, error: 'Campos requeridos faltantes.' });
  }

  try {
    // Validar reCAPTCHA con el token recibido
    const recaptchaRes = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      {
        params: {
          secret: RECAPTCHA_SECRET,
          response: token,
        },
      }
    );

    console.log('🛡️ Resultado de reCAPTCHA:', recaptchaRes.data);

    const isHuman = recaptchaRes.data.success;

    if (!isHuman) {
      return res.status(400).json({ success: false, error: 'Fallo en la verificación de reCAPTCHA' });
    }

    // Convertir Terminos a 1 o 0 (acepta varias formas)
    const aceptaTerminos =
      Terminos === true || Terminos === 'true' || Terminos === 1 || Terminos === '1'
        ? 1
        : 0;

        console.log('🔁 Query params a insertar:', [
  nombre_completo,
  correo,
  telefono,
  mensaje,
  token,
  aceptaTerminos,
]);

    // Insertar en la base de datos
const [result] = await pool.execute(
  'INSERT INTO usuarios (nombre_completo, correo, telefono, mensaje, token, aceptaTerminos) VALUES (?, ?, ?, ?, ?, ?)',
  [nombre_completo, correo, telefono, mensaje, token, aceptaTerminos]
);


    res.status(201).json({
      message: 'Contacto registrado con éxito',
      id: result.insertId,
      success: true,
    });

  } catch (error) {
    console.error('❌ Error al procesar solicitud:', error.response?.data || error.message);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
});

module.exports = router;
