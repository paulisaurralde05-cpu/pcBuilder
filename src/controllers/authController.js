import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Usuario, Administrador } from '../models/index.js';

export const registrarCliente = async (req, res) => {
    try {
        const { nombre, apellido, email, password } = req.body;

        const existe = await Usuario.findOne({ where: { email } });
        if (existe) {
            return res.status(400).json({ mensaje: 'El email ya está registrado' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const nuevoUsuario = await Usuario.create({
            nombre,
            apellido,
            email,
            password: hashedPassword
        });

        const token = jwt.sign(
            { id: nuevoUsuario.id, email: nuevoUsuario.email },
            process.env.JWT_SECRET || 'secreto',
            { expiresIn: '2h' }
        );

        return res.status(201).json({
            token,
            cliente: {
                id: nuevoUsuario.id,
                nombre: nuevoUsuario.nombre,
                email: nuevoUsuario.email
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al registrar usuario' });
    }
};

export const loginCliente = async (req, res) => {
    try {
        const { email, password } = req.body;

        const usuario = await Usuario.findOne({ where: { email } });
        if (!usuario) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }

        const esValida = await bcrypt.compare(password, usuario.password);
        if (!esValida) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }

        const token = jwt.sign(
            { id: usuario.id, email: usuario.email },
            process.env.JWT_SECRET || 'secreto',
            { expiresIn: '2h' }
        );

        return res.status(200).json({
            token,
            cliente: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await Administrador.findOne({ where: { email } });
        if (!admin) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas o no es administrador' });
        }

        const esValida = await bcrypt.compare(password, admin.password);
        if (!esValida) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas o no es administrador' });
        }

        const token = jwt.sign(
            { id: admin.id, email: admin.email, rol: 'admin' },
            process.env.JWT_SECRET || 'secreto',
            { expiresIn: '2h' }
        );

        return res.status(200).json({
            token,
            admin: {
                id: admin.id,
                nombre: admin.nombre,
                email: admin.email
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};