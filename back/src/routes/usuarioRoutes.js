const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const pool = require('../db');
const { sendVerificationEmail } = require('../utils/send_email'); // Importa la función
const router = express.Router();

const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY || '6Lc67m4rAAAAAP33KIR7HGnMb51dRWZf2-shfV-U';

router.post('/', async (req, res) => {
  const { nombre_completo, correo, telefono, mensaje, token, Terminos } = req.body;

  // Debug
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
    // Validar reCAPTCHA
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

    if (!recaptchaRes.data.success) {
      return res.status(400).json({ success: false, error: 'Fallo en la verificación de reCAPTCHA' });
    }

    // Convertir Terminos
    const aceptaTerminos = Terminos === true || Terminos === 'true' || Terminos === 1 || Terminos === '1' ? 1 : 0;

    // Generar token de verificación
    const tokenCorreo = crypto.randomBytes(8).toString('hex');
    // console.log('🔐 Token de correo generado:', tokenCorreo);

    // Insertar en la base de datos
    const [result] = await pool.execute(
      'INSERT INTO usuarios (nombre_completo, correo, telefono, mensaje, token, aceptaTerminos, tokenCorreo) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nombre_completo, correo, telefono, mensaje, token, aceptaTerminos, tokenCorreo]
    );

    // --- NUEVO: Enviar correo de verificación ---
    await sendVerificationEmail(correo, tokenCorreo); // Invoca la función aquí
    console.log('📧 Correo de verificación enviado');

    // Respuesta
    res.status(201).json({
      message: 'Contacto registrado con éxito. Se ha enviado un correo de verificación.',
      id: result.insertId,
      success: true,
    });

  } catch (error) {
    console.error('❌ Error al procesar solicitud:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Error interno del servidor' 
    });
  }
});

module.exports = router;