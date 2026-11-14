import { Op } from 'sequelize';
import { compararPassword, generarToken, JWT_SECRET_CLIENT, JWT_SECRET_ADMIN, encriptarPassword } from '../utils/auth.js';
import { mailRegistro, mailRecuperarPassword } from '../services/emailService.js';
import Usuario from '../models/usuario.js';
import Administrador from '../models/administrador.js';
import bcrypt from 'bcryptjs';

export const loginCliente = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                estado: false,
                mensaje: 'Debe proporcionar email y contraseña',
            });
        }

        const cliente = await Usuario.findOne({ where: { email } });

        if (!cliente) {
            return res.status(401).json({
                estado: false,
                mensaje: 'Credenciales inválidas',
            });
        }

        const passwordValido = await compararPassword(password, cliente.password);

        if (!passwordValido) {
            return res.status(401).json({
                estado: false,
                mensaje: 'Credenciales inválidas',
            });
        }

        const token = generarToken({
            id: cliente.id,
            email: cliente.email,
            tipo: 'cliente',
        }, JWT_SECRET_CLIENT);

        res.json({
            estado: true,
            mensaje: 'Login de cliente exitoso',
            token,
            cliente: {
                id: cliente.id,
                nombre: cliente.nombre,
                email: cliente.email,
            },
        });
        
    } catch (error) {
        console.error('Error en loginCliente:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al iniciar sesión',
            error: error.message,
        });
    }
};

export const registrarCliente = async (req, res) => {
    try {
        const { nombre, apellido, email, password } = req.body;

        if (!nombre || !email || !password) {
            return res.status(400).json({
                estado: false,
                mensaje: 'Debe proporcionar nombre, email y contraseña',
            });
        }

        const existe = await Usuario.findOne({ where: { email } });

        if (existe) {
            return res.status(400).json({
                estado: false,
                mensaje: 'El email ya está registrado',
            });
        }

        const passwordHash = await encriptarPassword(password);

        const cliente = await Usuario.create({ 
            nombre, 
            apellido, 
            email, 
            password: passwordHash 
        });

        const token = generarToken({
            id: cliente.id,
            email: cliente.email,
            tipo: 'cliente',
        }, JWT_SECRET_CLIENT);

        mailRegistro(cliente.email, cliente.nombre);

        res.status(201).json({
            estado: true,
            mensaje: 'Registro de cliente exitoso',
            token,
            cliente: {
                id: cliente.id,
                nombre: cliente.nombre,
                apellido: cliente.apellido,
                email: cliente.email,
            },
        });
    } catch (error) {
        console.error('Error en registrarCliente:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al registrar cliente',
            error: error.message,
        });
    }
};

export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                estado: false,
                mensaje: 'Debe proporcionar email y contraseña',
            });
        }

        const usuario = await Administrador.findOne({ where: { email } });

        if (!usuario) {
            return res.status(401).json({
                estado: false,
                mensaje: 'Credenciales inválidas o no es administrador',
            });
        }

        if (usuario.nivelPermiso && usuario.nivelPermiso.toLowerCase() !== 'administrador' && usuario.nivelPermiso.toLowerCase() !== 'superadmin') {
            return res.status(403).json({
                estado: false,
                mensaje: 'Acceso solo para administradores',
            });
        }

        const passwordValido = await compararPassword(password, usuario.password);

        if (!passwordValido) {
            return res.status(401).json({
                estado: false,
                mensaje: 'Credenciales inválidas',
            });
        }

        const token = generarToken({
            id: usuario.id,
            email: usuario.email,
            tipo: 'admin',
            nivelPermiso: usuario.nivelPermiso,
        }, JWT_SECRET_ADMIN);

        res.json({
            estado: true,
            mensaje: 'Login de administrador exitoso',
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.nivelPermiso,
            },
        });
    } catch (error) {
        console.error('Error en loginAdmin:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al iniciar sesión',
            error: error.message,
        });
    }
};

export const registrarAdmin = async (req, res) => {
    try {
        const { nombre, apellido, email, password, legajoEmpleado, nivelPermiso } = req.body;

        if (!nombre || !apellido || !email || !password || !legajoEmpleado || !nivelPermiso) {
            return res.status(400).json({
                estado: false,
                mensaje: 'Todos los campos son obligatorios',
            });
        }

        const existe = await Administrador.findOne({ where: { email } });
        if (existe) {
            return res.status(400).json({
                estado: false,
                mensaje: 'El email ya está registrado para un administrador',
            });
        }

        const passwordHash = await encriptarPassword(password);

        const nuevoAdmin = await Administrador.create({
            nombre,
            apellido,
            email,
            password: passwordHash,
            legajoEmpleado,
            nivelPermiso
        });

        res.status(201).json({
            estado: true,
            mensaje: 'Administrador registrado con éxito',
            usuario: {
                id: nuevoAdmin.id,
                nombre: nuevoAdmin.nombre,
                email: nuevoAdmin.email,
                rol: nuevoAdmin.nivelPermiso
            }
        });

    } catch (error) {
        console.error('Error en registrarAdmin:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al registrar el administrador',
            error: error.message,
        });
    }
};

export const solicitarRecuperacion = async (req, res) => {
    try {
        // extrae el mail del cuerpo de la petición.
        const { email } = req.body;

        // si no hay mail, devuelve error.
        if (!email) {
            return res.status(400).json({ estado: false, mensaje: 'El email es obligatorio' });
        }

        // busca el usuario en la bd.
        const usuario = await Usuario.findOne({ where: { email } });

        // si no está en la bd, igualmente responde de manera "neutra" para que no sepan que mails están registrados.
        if (!usuario) {
            return res.status(200).json({
                estado: true,
                mensaje: 'Si el correo está registrado, recibirás un código de verificación.'
            });
        }

        // generamos el código (entre 100000 y 999999) y lo convierte a texto.
        const codigo = Math.floor(100000 + Math.random() * 900000).toString();

        // guardamos el código y le damos 15 minutos de validez.
        usuario.codigoRecuperacion = codigo;

        // calcula la fecha, y le suma 15 min (en milisegundos, 15 * 60 * 1000), y se guarda en codigoExpiracion.
        usuario.codigoExpiracion = new Date(Date.now() + 15 * 60 * 1000);

        // guarda los nuevos datos (codigoExpiracion y codigoRecupoeracion)
        await usuario.save();

        // envia el correo
        mailRecuperarPassword(usuario.email, codigo);

        // responde al cliente, avisando que el mail fue enviado.
        return res.status(200).json({
            estado: true,
            mensaje: 'Si el correo está registrado, recibirás un código de verificación.'
        });

    } catch (error) {
        console.error('Error en solicitar recuperacion:', error);
        return res.status(500).json({ estado: false, mensaje: 'Error al procesar la solicitud' });
    }
};

export const restablecerPassword = async (req, res) => {
    try {
        // obtiene del cuerpo de la peticion el correo, el pin y la nueva contraseña.
        const { email, codigo, nuevaPassword } = req.body;

        // valida que no llegue vacío ningún parámetro
        if (!email || !codigo || !nuevaPassword) {
            return res.status(400).json({ 
                estado: false, 
                mensaje: 'Faltan datos obligatorios (email, código o nueva contraseña)' 
            });
        }

        // buscamos usuario donde coincida el email, el código y que NO haya expirado
        const usuario = await Usuario.findOne({
            where: {
                email,
                codigoRecuperacion: codigo,
                codigoExpiracion: { [Op.gt]: new Date() } // mayor a la hora actual
            }
        });

        if (!usuario) {
            return res.status(400).json({
                estado: false,
                mensaje: 'El código es incorrecto o ya ha expirado'
            });
        }

        // hasheamos la nueva clave
        const salt = 10;
        usuario.password = await bcrypt.hash(nuevaPassword, salt);

        // limpia los campos para que el código no sirva dos veces
        usuario.codigoRecuperacion = null;
        usuario.codigoExpiracion = null;

        // aplica los cambios (la nueva contraseña y los codigos de recuperacion y expiracion limpios)
        await usuario.save();

        return res.status(200).json({
            estado: true,
            mensaje: 'Contraseña actualizada con éxito. Ya podés iniciar sesión.'
        });

    } catch (error) {
        console.error('Error en restablecerPassword:', error);
        return res.status(500).json({ estado: false, mensaje: 'Error al restablecer la contraseña' });
    }
};