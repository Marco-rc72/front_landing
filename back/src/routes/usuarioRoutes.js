const express = require('express');
const pool = require('../db'); // Ruta relativa corregida

const router = express.Router();

router.post('/', async (req, res) => {
    try{
        const {nombre_completo, correo, telefono, mensaje} = req.body;
        const [result]=await pool.execute(
            'INSERT INTO usuarios (nombre_completo, correo, telefono, mensaje) VALUES (?,?,?,?)',[nombre_completo, correo, telefono, mensaje]
        );
        res.status(201).json({
            message: 'Contacto de usaurio registrado con éxito',
            id: result.insertId
        });
    }catch (error){
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
});



module.exports = router;