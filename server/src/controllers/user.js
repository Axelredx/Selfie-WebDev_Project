import User from "../models/user.js";
import { hashPassword } from "../utils/auth.js";

export const createUser = (name, username, email, password) => {
    try {
        return User.create({
            name: name,
            username: username,
            email: email,
            password: hashPassword(password),
        });
    } catch (error) {
        //console.error("Error creating user", error);
        return null;
    }
}

export const findUser = async (username) => {
    try {
        return await User.findOne({ username }).orFail();
    } catch (error) {
        //console.error(`User not found: ${username}`, error);
        return null;
    }
}


export const deleteUser = async (user_to_delete) => {
    try {
        await User.findOneAndDelete({ username: user_to_delete }).orFail();
        return true;
    } catch (error) {
        return false;
    }
}

export const updateUser = async (user_to_update, new_data) => {
    try {
        await User.findOneAndUpdate({ username: user_to_update }, new_data).orFail();
        return true;
    } catch (error) {
        return false;
    }
}
