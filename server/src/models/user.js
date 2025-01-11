import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate: [validator.isEmail, "email not valid!"]
    },
    password: {
        type: String,
        required: true,
        trim: true,
        // pdf spec: 4 char min
        minlength: 4,
        // isStrongPassword: https://www.npmjs.com/package/validator
        // validate: [validator.isStrongPassword, "la password not strong enough!"]
    },
});

export default mongoose.model("User", userSchema);