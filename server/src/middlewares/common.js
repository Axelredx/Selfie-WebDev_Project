import { validationResult } from "express-validator"

// Return error message if validation fails
export const failedValidationMsg = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        next();
    } else {
        res.status(401).json({ errors: errors.array() });
    }
}