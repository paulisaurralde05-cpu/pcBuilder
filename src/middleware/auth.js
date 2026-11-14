import jwt from 'jsonwebtoken';
import { JWT_SECRET_CLIENT, JWT_SECRET_ADMIN } from '../utils/auth.js';
import Usuario from '../models/usuario.js';
import Administrador from '../models/administrador.js';

export const verificarToken = (secret) => (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                estado: false,
                mensaje: 'No se proporcionó un token de autenticación',
            });
        }

        const token = authHeader.split(' ')[1];
        const payload = jwt.verify(token, secret);

        req.user = payload;
        next();
    } catch (error) {
        return res.status(401).json({
            estado: false,
            mensaje: 'Token inválido o expirado',
            error: error.message,
        });
    }
};

export const verificarCliente = (req, res, next) => {
    verificarToken(JWT_SECRET_CLIENT)(req, res, async (err) => {
        if (err) return next(err);

        try {
            if (!req.user || req.user.tipo !== 'cliente') {
                return res.status(403).json({
                    estado: false,
                    mensaje: 'Acceso solo para clientes',
                });
            }

            const usuario = await Usuario.findByPk(req.user.id);

            if (!usuario) {
                return res.status(403).json({
                    estado: false,
                    mensaje: 'Cliente no encontrado',
                });
            }

            req.usuario = usuario;
            req.cliente = usuario;
            next();
        } catch (error) {
            console.error('Error en verificarCliente:', error);
            return res.status(500).json({
                estado: false,
                mensaje: 'Error al verificar cliente',
                error: error.message,
            });
        }
    });
};

export const verificarAdmin = (req, res, next) => {
    verificarToken(JWT_SECRET_ADMIN)(req, res, async (err) => {
        if (err) return next(err);

        try {
            if (!req.user || req.user.tipo !== 'admin') {
                return res.status(403).json({
                    estado: false,
                    mensaje: 'Acceso solo para administradores',
                });
            }

            const usuario = await Administrador.findByPk(req.user.id);

            if (!usuario) {
                return res.status(403).json({
                    estado: false,
                    mensaje: 'Usuario o rol no encontrado',
                });
            }

            if (usuario.nivelPermiso && usuario.nivelPermiso.toLowerCase() !== 'administrador' && usuario.nivelPermiso.toLowerCase() !== 'superadmin') {
                return res.status(403).json({
                    estado: false,
                    mensaje: 'El usuario no tiene permisos de administrador',
                });
            }

            req.usuario = usuario;
            next();
        } catch (error) {
            console.error('Error en verificarAdmin:', error);
            return res.status(500).json({
                estado: false,
                mensaje: 'Error al verificar administrador',
                error: error.message,
            });
        }
    });
};