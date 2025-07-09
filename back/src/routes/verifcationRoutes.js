const express = require('express');
const router = express.Router();
const pool = require('../db');


router.get('/verify-email', async (req, res) => {
  const { token } = req.query;

  // Validación básica del token
  if (!token || typeof token !== 'string') {
    return res.status(400).json({ 
      success: false, 
      error: 'Token no proporcionado o formato inválido.' 
    });
  }

  try {
    // 1. Verificar si el token existe en la BD
    const [users] = await pool.execute(
      'SELECT id FROM usuarios WHERE tokenCorreo = ? LIMIT 1',
      [token]
    );

    // 2. Si no existe, retornar error
    if (users.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Token inválido, expirado o ya fue usado.' 
      });
    }

    // // 3. Opcional: Eliminar el token después de usarlo (evita reutilización)
    // await pool.execute(
    //   'UPDATE usuarios SET tokenCorreo = NULL WHERE tokenCorreo = ?',
    //   [token]
    // );

    // 4. Respuesta exitosa
    return res.send(`
      <h1>¡Verificación exitosa!</h1>
      <p>El token fue validado correctamente.</p>
    `);

  } catch (error) {
    console.error('Error en verify-email:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Error interno durante la verificación.' 
    });
  }
});

module.exports = router;