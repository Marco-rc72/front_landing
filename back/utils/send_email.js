const nodemailer = require('nodemailer');

// 1. Configura el 'transportador'
// Aquí usaremos Gmail como ejemplo.
// ADVERTENCIA: Para producción, NO uses tus credenciales directamente en el código.
// Usa variables de entorno (.env) para guardar tu usuario y contraseña.
const transporter = nodemailer.createTransport({
    service: 'Gmail', // Puedes usar 'Outlook', 'SendGrid', 'SMTP', etc.
    auth: {
        user:process.env.USER_EMAIL, // ¡Usa process.env.EMAIL_USER en producción!
        pass:process.env.USER_PASS // ¡Usa process.env.EMAIL_PASS en producción!
        // Para Gmail, necesitas generar una 'contraseña de aplicación' si tienes 2FA activado.
        // Busca en la configuración de seguridad de tu cuenta de Google.
    }
});

// 2. Función para enviar el correo de autenticación
async function enviarCorreoAutenticacion(destinatario, token) {
    const urlDeActivacion = `http://tuapp.com/verificar-email?token=${token}`; // URL de tu frontend para verificar

    const mailOptions = {
        from: 'tu_correo@gmail.com',
        to: destinatario,
        subject: 'Verifica tu cuenta para [Nombre de tu aplicación]',
        html: `
            <p>Hola,</p>
            <p>Gracias por registrarte en nuestra aplicación. Por favor, haz clic en el siguiente enlace para verificar tu correo electrónico:</p>
            <p><a href="${urlDeActivacion}">Verificar mi Correo Electrónico</a></p>
            <p>Si no te registraste en nuestra aplicación, por favor ignora este correo.</p>
            <p>Saludos,</p>
            <p>El equipo de [Nombre de tu aplicación]</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Correo de autenticación enviado a:', destinatario);
        return true;
    } catch (error) {
        console.error('Error al enviar el correo de autenticación:', error);
        return false;
    }
}

// 3. Cómo lo usarías en una ruta de Express (ejemplo)
// app.post('/registrar', async (req, res) => {
//     const { email, password } = req.body;
//     // ... Lógica para guardar usuario en DB y generar token ...
//     const tokenDeVerificacion = 'generar_un_token_seguro'; // Esto debe ser un token JWT o similar

//     const enviado = await enviarCorreoAutenticacion(email, tokenDeVerificacion);

//     if (enviado) {
//         res.status(200).json({ message: 'Registro exitoso. Por favor, verifica tu correo.' });
//     } else {
//         res.status(500).json({ message: 'Error al enviar el correo de verificación.' });
//     }
// });

// Para usar en otro archivo:
module.exports = { enviarCorreoAutenticacion };