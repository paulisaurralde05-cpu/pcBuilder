import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SALT_ROUNDS = 10;

export const JWT_SECRET_CLIENT = process.env.JWT_SECRET_CLIENT || 'clave_por_defecto_cliente';
export const JWT_SECRET_ADMIN = process.env.JWT_SECRET_ADMIN || 'clave_por_defecto_admin';

export const encriptarPassword = async (password) => {
    return bcrypt.hash(password, SALT_ROUNDS);
};

export const compararPassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};

export const generarToken = (payload, secret) => {
    return jwt.sign(payload, secret, { expiresIn: '24h' });
};