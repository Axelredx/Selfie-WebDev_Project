import * as userController from "../controllers/user.js";

// Check if user still exists
export const isUserDeleted = async (req, res, next) => {
    try {
       (await userController.findUser(req.body.username)) == undefined ? 
        res.status(400).send("Error: user doesn't exist anymore!"): next();
    } catch (error) {
        next(new Error(`Error: ${error.message}`)); 
    }
}

// Check if user is authorized
export const userVerification = async (req, res, next) => {
    isUserDeleted(req, res, next);
    (await userController.findUser(req.body.username) == req.body.username) ? 
        next() : res.status(401).send("Error: not authorized - invalid token! (during verification)");
};
