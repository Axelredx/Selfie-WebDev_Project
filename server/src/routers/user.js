import { Router } from "express";
import * as userController from "../controllers/user.js";
import * as userMiddlewere from "../middlewares/user.js";
import * as authUtils from "../utils/auth.js";

const router = Router();

// General info of user
router.get("/", async (req, res) => {
    try {
        const user = await userController.findUser(req.body.username);
        if (user) {
            res.status(200).json({
                name: user.name,
                username: user.username,
                email: user.email
            });
        } else {
            res.status(404).send("User not found!");
        }
    } catch (err) {
        res.status(500).send("Server error!");
    }
});

router.put("/", userMiddlewere.userVerification, async (req, res) => {
    try {
        const userUpdated = await userController.updateUser(req.params.username, req.body);
        if (userUpdated) {
            res.status(200).send("User updated successfully!");
        } else {
            res.status(500).send("Error: Server error");
        }
    } catch (err) {
        res.status(500).send("Error: Server error");
    }
});

/**
 *  NOTE: 'req.params' is an object with all parameters extracted from the URL.
 *  If the route is /user/:username, req.params.username will be the value of :username.
 *  'req.body' is an object with all parameters extracted from the body of the request.
 */
router.delete("/", userMiddlewere.userVerification, async (req, res) => {
    try {
        const userDeleted = await userController.deleteUser(req.params.username);
        if (userDeleted) {
            res.status(200).send("Sorry to see you go :(");
        } else {
            res.status(500).send("Error: Server error");
        }
    } catch (err) {
        res.status(500).send("Error: Server error");
    }
});

export default router;
