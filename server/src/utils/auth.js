import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import env from './env.js';

// JsWebToken for autentication
export const createJWT = (username) => {
    return jwt.sign({ username }, env.JWT_SECRET, { expiresIn: '24h' });
}

// return username if token is valid
export const verifyJWT = (token) => {
    try {
        return jwt.verify(token, env.JWT_SECRET);
    } catch (error) {
        //console.error('Token verification failed:', error.message);
        return null;    
    }
}

// Password hashing in db
export const hashPassword = (plainPwd) => {
    try {
        return bcrypt.hashSync(plainPwd, env.SALT_ROUNDS);
    } catch (error) {
        //console.error('Password hashing failed:', error.message);
        return null;
    }
}
export const comparePasswords = (plainPwd, hash) => bcrypt.compareSync(plainPwd, hash);
