const express = require('express');
const pool = require('../db'); // Ruta relativa corregida

const router = express.Router();

router.put('/usuarios/:id/accept-terms', async (req, res) => {
    const userId = req.params.id;

    try {
        // Actualiza solo el campo termsPrivacy
        const [result] = await pool.execute(
            'UPDATE usuarios SET termsPrivacy = TRUE WHERE id = ?',
            [userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json({ 
            success: true,
            message: 'Términos aceptados correctamente'
        });
    } catch (error) {
        console.error('Error al actualizar términos:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

module.exports = router;