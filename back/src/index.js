const express = require('express');
require('dotenv').config();
const usuarioRoutes = require('./routes/usuarioRoutes');
const termsRoutes = require('./routes/termsRoutes');
const verificationsRoutes = require('./routes/verifcationRoutes');
const app = express();

// Configuración CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(express.json());

// Ruta de prueba para verificar que el servidor funciona
app.get('/', (req, res) => {
  res.json({ mensaje: 'API funcionando correctamente' });
});

// Rutas principales
app.use('/api/usuarios', usuarioRoutes);
app.use('/api', termsRoutes);
app.use('/api/verificacion/', verificationsRoutes);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
