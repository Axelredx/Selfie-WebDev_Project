import { validationResult } from 'express-validator';
import * as authUtils from "./auth.js";
import * as userController from "../controllers/user.js";

// Sign-up function
export const signUp = async (req, res) => {
    try {
        await userController.createUser(req.body.name, req.body.username, req.body.email, req.body.password);
        res.status(200)
           .cookie("token", authUtils.createJWT(req.body.username), { sameSite: "lax", httpOnly: true })
           .json({ message: "User created!" });
    } catch (err) {
        res.status(403)
           .json({ message: `${err}` });
    }
};

// Sign-in function
export const signIn = async (req, res) => {
    try {
        const user = await userController.findUser(req.body.username);
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        const isPasswordCorrect = authUtils.comparePasswords(req.body.password, user.password);
        if (isPasswordCorrect) {
            res.status(200)
               .cookie("token", authUtils.createJWT(req.body.username), { sameSite: "lax", httpOnly: true })
               .send("Sign-in successful!");
        } else {
            res.status(401).json({ message: "Wrong password!" });
        }
    } catch (err) {
        res.status(500).json({ message: `Internal server error: ${err}` });
    }
}

// Sign-out function
export const signOut = (_, res) => {
    res.status(200)
       .cookie("token", "", { sameSite: "lax", httpOnly: true})
       .send("Sign-out successful!");
}

// Logged-in or re-log
export const testIfLogged = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(200).json({ username: undefined, message: "Redirecting to Login Page!" });
    }
    try {
        const user_jwt = authUtils.verifyJWT(req.cookies.token);
        const userToken = user_jwt.username; 
        const user = await userController.findUser(userToken);
        if (!user) {
            return res.status(204).json({ message: "User not found, redirect to login" });
        }
    
        res.status(200).json({ username: user.username, message: "User logged in" });
    } catch (err) {
        res.status(200).json({ message: `Redirecting to Login Page!`});
    }
}
