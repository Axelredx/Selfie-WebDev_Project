import { body, cookie } from "express-validator";
import * as authUtils from "../utils/auth.js";
import * as userMiddlewere from "./user.js";
import user from "../models/user.js";

// Necessary fields to access the application
export const validateBodySignUp = () => [
    body('name').notEmpty().withMessage('Name is required'),
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 4 }).withMessage('Password must be at least 4 characters long')
];
export const validateBodySignIn = () => [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').isLength({ min: 4 }).withMessage('Password must be at least 4 characters long')
];

// Check if token is not empty
export const validateCookie = () => cookie("token").notEmpty().withMessage("Token is required");

// Check if token is valid
export const validateToken = (req, res, next) => {
    try {
        const user_jwt = authUtils.verifyJWT(req.cookies.token);
        req.body.username = user_jwt.username;
        next()
    } catch {
        res.status(401).json({ message: "not authorized - invalid token (During validation)"}).send();
    }
}
