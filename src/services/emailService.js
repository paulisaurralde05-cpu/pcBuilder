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

export const mailCambioPedido = async (emailCliente, pedido, nuevoEstado) => {
    try {
        const info = await transporter.sendMail({
            from: '"pcBuilder" <soporte@pcbuilder.com>',
            to: emailCliente,
            subject: 'Actualización de su pedido ${pedido.id} - pcBuilder',
            html: `
            <div>
               <h2>Hola</h2>
               <p>El estado de su pedido ${pedido.id} ha cambiado.</p>
            </div>`,
        });
        console.log('Mail de cambio de estado enviado: ', info.messageId);
        return info;
    } catch (error) {
        console.error('Error al enviar mail: ', error.message);
    }
};

export const mailNuevoPedido = async (emailAdmin, usuario, pedido, detalle) => {
    try {
        const listaItems = Array.isArray(detalle) ? detalle : [detalle];
        const info = await transporter.sendMail({
            from: '"pcBuilder" <soporte@pcbuilder.com>',
            to: emailAdmin,
            subject: 'Nuevo pedido recibido',
            html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #1e293b;">
               <h2>¡Nuevo pedido registrado en pcBuilder!</h2>
               <p><strong>Cliente:</strong> ${usuario.nombre} (${usuario.email})</p>
               <p><strong>Monto total:</strong> $${pedido.total}</p>
               <p><strong>Fecha:</strong> ${new Date(pedido.fechaPedido).toLocaleString()}</p>
               
               <h3>Detalle de la compra:</h3>
               <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 15px 0;">
                   <ul style="list-style: none; padding: 0; margin: 0;">
                       ${listaItems.map((det) => `
                           <li style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                               <strong>Producto ID:</strong> ${det.idProducto || det.productoId} 
                               | <strong>Cantidad:</strong> ${det.cantidad}
                           </li>
                       `).join('')}
                   </ul>
               </div>

               <p>Ingresá al panel de administración para gestionar este envío.</p>
            </div>`,
        });
        console.log('Mail de nuevo pedido enviado: ', info.messageId);
        return info;
    } catch (error) {
        console.error('Error al enviar mail: ', error.message);
    }
};

export const mailNuevoPedidoCliente = async (emailCliente, detalle) => {
    try {
        const listaItems = Array.isArray(detalle) ? detalle : [detalle];

        const info = await transporter.sendMail({
            from: '"pcBuilder" <soporte@pcbuilder.com>',
            to: emailCliente,
            subject: 'Compra confirmada - pcBuilder',
            html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #1e293b;">
               <h2>¡Gracias por tu compra!</h2>
               <p>Hemos recibido tu pedido correctamente. Este es el detalle de tus productos:</p>
               
               <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 15px 0;">
                   <ul style="list-style: none; padding: 0; margin: 0;">
                       ${listaItems.map((det) => {
                           const idProd = det.idProducto || det.id_producto || det.productoId || 'N/A';
                           const cant = det.cantidad || 1;
                           const precio = det.precioUnitario || det.precio || '';

                           return `
                               <li style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                                   <strong>Producto ID:</strong> ${idProd} 
                                   | <strong>Cantidad:</strong> ${cant}
                                   ${precio ? `| <strong>Precio:</strong> $${precio}` : ''}
                               </li>
                           `;
                       }).join('')}
                   </ul>
               </div>

               <p>Te avisaremos cuando tu paquete esté en camino.</p>
            </div>`,
        });

        console.log('Mail de nuevo pedido enviado a Mailtrap:', info.messageId);
        return info;
    } catch (error) {
        console.error('Error al enviar mail de nuevo pedido:', error.message);
    }
};