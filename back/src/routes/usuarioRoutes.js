const express = require('express');
const axios = require('axios');
const pool = require('../db'); // Ruta a tu configuración de MySQL
const router = express.Router();

const RECAPTCHA_SECRET = 'TU_CLAVE_SECRETA'; // Sustituye con tu clave secreta

router.post('/', async (req, res) => {
  const { nombre_completo, correo, telefono, mensaje, recaptchaToken } = req.body;

  try {
    // Validar reCAPTCHA
    const recaptchaRes = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      {
        params: {
          secret: RECAPTCHA_SECRET,
          response: recaptchaToken,
        },
      }
    );

    const isHuman = recaptchaRes.data.success;

    if (!isHuman) {
      return res.status(400).json({ error: 'Fallo en la verificación de reCAPTCHA' });
    }

    // Si pasó el reCAPTCHA, guarda en MySQL
    const [result] = await pool.execute(
      'INSERT INTO usuarios (nombre_completo, correo, telefono, mensaje) VALUES (?,?,?,?)',
      [nombre_completo, correo, telefono, mensaje]
    );

    res.status(201).json({
      message: 'Contacto de usuario registrado con éxito',
      id: result.insertId,
      success: true
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
});

module.exports = router;
