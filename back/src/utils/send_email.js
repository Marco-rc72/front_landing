// mailer.js
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  host: "smtp.office365.com", // Servidor SMTP de Outlook
  port: 587, // Puerto seguro para TLS
  secure: false, // True para 465, false para otros puertos
  auth: {
    user: process.env.USER_EMAIL, // Tu correo Outlook (ej: usuario@outlook.com)
    pass: process.env.USER_PASS, // Tu contraseña o "App Password"
  },
  tls: {
    ciphers: 'SSLv3', // Necesario para evitar errores
    rejectUnauthorized: false, // Solo para desarrollo (en producción usa true)
  }
});

console.log("User correo", process.env.USER_EMAIL);

// 2. Función para enviar el correo de verificación
const sendVerificationEmail = async (email, token) => {
  const verificationLink = `http://localhost:3001/api/verificacion/verify-email?token=${token}`;

  console.log("User correo", process.env.USER_EMAIL);
  const mailOptions = {
    from: '"Tu App" <no-reply@tudominio.com>',
    to: email,
    subject: 'Verifica tu correo electrónico',
    html: `
      <h1>¡Gracias por registrarte!</h1>
      <p>Haz clic en el siguiente enlace para verificar tu correo:</p>
      <a href="${verificationLink}">${verificationLink}</a>
      <p>Si no solicitaste esto, ignora este correo.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Correo enviado a:', email);
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    throw error; // Para manejar el error en la ruta
  }
};

module.exports = { sendVerificationEmail };