import { compararPassword, generarToken, JWT_SECRET_CLIENT, JWT_SECRET_ADMIN, encriptarPassword } from '../utils/auth.js';
import Usuario from '../models/usuario.js';
import Administrador from '../models/administrador.js';

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