const express = require('express');
const usuarioRoutes = require('./routes/usuarioRoutes');
const termsRoutes = require('./routes/termsRoutes');
const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Permite todos los orígenes (*)
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(express.json()); // Para parsear JSON en las requests

app.use('/api/usuarios', usuarioRoutes);
<<<<<<< HEAD
=======
app.use('/api', termsRoutes);


>>>>>>> 28c24e7ecc5b737dbdf58685d4934ac5db4e9bad
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
})