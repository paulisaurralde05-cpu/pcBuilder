import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'sandbox.smtp.mailtrap.io',
    port: process.env.EMAIL_PORT || 2525,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const mailRegistro = async (emailCliente, nombreUsuario) => {
    try {
        const info = await transporter.sendMail({
            from: '"pcBuilder" <soporte@pcbuilder.com>',
            to: emailCliente,
            subject: 'Bienvenido a pcBuilder',
            html: `
            <div>
               <h2>Hola ${nombreUsuario}</h2>
               <p>Tu cuenta en pcBuilder fue creada exitosamente.</p>
            </div>`,
        });
        console.log('Mail de bienvenida enviado: ', info.messageId);
        return info;
    } catch (error) {
        console.error('Error al enviar mail: ', error.message);
    }
};

export const mailRecuperacion = async (emailCliente, tokenRecuperacion) => {
    try {
        const info = await transporter.sendMail({
            from: '"pcBuilder" <soporte@pcbuilder.com>',
            to: emailCliente,
            subject: 'Recuperar contraseña - pcBuilder',
            html: `
            <div>
               <h2>Hola</h2>
               <p>Solicitaste restablecer tu contraseña.</p>
            </div>`,
        });
        console.log('Mail recuperación enviado: ', info.messageId);
        return info;
    } catch (error) {
        console.error('Error al enviar mail de recuperación: ', error.message);
    }
};