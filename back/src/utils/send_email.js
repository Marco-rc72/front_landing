const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail', // Usa el servicio predefinido
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASS,
  },
});

const sendVerificationEmail = async (email, token) => {
  const verificationLink = `http://localhost:3001/api/verificacion/verify-email?token=${token}`;

  const mailOptions = {
    from: `"Proyecto Colosus " <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Verifica tu correo electrónico',
    html: `
      <h1>¡Gracias por registrarte!</h1>
      <p>Haz clic en el enlace para verificar tu correo:</p>
      <a href="${verificationLink}">${verificationLink}</a>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Correo enviado a:', email);
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    throw error;
  }
};

module.exports = { sendVerificationEmail };