const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const pool = require('../db');
const { sendVerificationEmail } = require('../utils/send_email');
const router = express.Router();

const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY || '6Lc67m4rAAAAAP33KIR7HGnMb51dRWZf2-shfV-U';

router.post('/', async (req, res) => {
  const { nombre_completo, correo, telefono, mensaje, token, aceptaTerminos } = req.body;

  // Debug
  console.log('🛬 Datos recibidos en el backend:');
  console.log('nombre_completo:', nombre_completo);
  console.log('correo:', correo);
  console.log('telefono:', telefono);
  console.log('mensaje:', mensaje);
  console.log('token:', token);
  console.log('aceptaTerminos:', aceptaTerminos, '| Tipo:', typeof aceptaTerminos);

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

    // Convertir checkbox a 1/0
    const acepta = aceptaTerminos === true || aceptaTerminos === 'true' || aceptaTerminos === 1 || aceptaTerminos === '1' ? 1 : 0;

    const tokenCorreo = crypto.randomBytes(8).toString('hex');

    const [result] = await pool.execute(
      'INSERT INTO usuarios (nombre_completo, correo, telefono, mensaje, token, acepta_terminos, tokenCorreo) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nombre_completo, correo, telefono, mensaje, token, acepta, tokenCorreo]
    );

    await sendVerificationEmail(correo, tokenCorreo);
    console.log('📧 Correo de verificación enviado');

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
