import { Router } from "express";
import * as pomodoroController from "../controllers/pomodoro.js";
import * as timeMachineController from "../controllers/timeMachine.js";

const router = Router();

router.get("/all", async (req, res) => {
    try {
        const pomodoros = await pomodoroController.findAllPomodoro(req.query.ownerPomodoro);
        if (pomodoros) {
            res.status(200).json(pomodoros.map(pomodoro => {
                return {
                    cycles: pomodoro.cycles,
                    duration: pomodoro.duration,
                    breakDuration: pomodoro.breakDuration,
                    datePomodoro: pomodoro.datePomodoro,
                }
            }));
        } else {
            res.status(204).send([]);
        }
    } catch (err) {
        res.status(500).send("Server error!");
    }
});

router.get("/todayServer", async (req, res) => {
    try {
        const date = timeMachineController.getYYYYMMDDserverClock();
        const pomodoro = await pomodoroController.findPomodoro(req.query.ownerPomodoro, date);
        if (pomodoro) {
            /*res.status(200).json({
                cycles: pomodoro.cycles,
                duration: pomodoro.duration,
                breakDuration: pomodoro.breakDuration,
                datePomodoro: pomodoro.datePomodoro,
            });*/
            res.status(200).send(pomodoro);
        } else {
            res.status(204).send([]);
        }
    } catch (err) {
        res.status(500).send("Server error!");
    }
});

router.post("/todayServer", async (req, res) => {
    try {
        const date = timeMachineController.getYYYYMMDDserverClock();
        const pomodorofound = await pomodoroController.findPomodoro(req.body.ownerPomodoro, date);
        if (pomodorofound) {
            await pomodoroController.deletePomodoro(req.body.ownerPomodoro, date);
        }
        const pomodoro = await pomodoroController.createPomodoro(req.body.ownerPomodoro, req.body.cycles, req.body.duration, req.body.breakDuration, date);
        if (pomodoro) {
            res.status(201).json({
                cycles: pomodoro.cycles,
                duration: pomodoro.duration,
                breakDuration: pomodoro.breakDuration,
                datePomodoro: pomodoro.datePomodoro,
            });
        } else {
            res.status(500).send("Error creating Pomodoro!");
        }
    } catch (err) {
        res.status(500).send("Server error!");
    }
});

router.post("/givenDate", async (req, res) => {
    try {
        const pomodorofound = await pomodoroController.findPomodoro(req.body.ownerPomodoro, req.body.datePomodoro);
        if (pomodorofound) {
            await pomodoroController.deletePomodoro(req.body.ownerPomodoro, req.body.datePomodoro);
        }
        const pomodoro = await pomodoroController.createPomodoro(req.body.ownerPomodoro, req.body.cycles, req.body.duration, req.body.breakDuration, req.body.datePomodoro);
        if (pomodoro) {
            res.status(201).json({
                cycles: pomodoro.cycles,
                duration: pomodoro.duration,
                breakDuration: pomodoro.breakDuration,
                datePomodoro: pomodoro.datePomodoro,
            });
        } else {
            res.status(500).send("Error creating Pomodoro!");
        }
    } catch (err) {
        res.status(500).send("Server error!");
    }
});

router.delete("/todayServer", async (req, res) => {
    try {
        const date = timeMachineController.getYYYYMMDDserverClock();
        await pomodoroController.deletePomodoro(req.query.ownerPomodoro, date);
        res.status(200).send("Pomodoro deleted!");
    } catch (err) {
        res.status(500).send("Server error!");
    }
});

router.post("/deleteGivenDate", async (req, res) => {
    //console.log("nel post"+req.body.ownerPomodoro);
    //console.log("nel post"+req.body.datePomodoro);
    try {
        await pomodoroController.deletePomodoro(req.body.ownerPomodoro, req.body.datePomodoro);
        res.status(200).send("Pomodoro deleted!");
    } catch (err) {
        res.status(500).send("Server error!");
    }
});

router.delete("/allOfOwner", async (req, res) => {
    try {
        await pomodoroController.deleteAllPomodoro(req.query.ownerPomodoro);
        res.status(200).send("Pomodoros deleted!");
    } catch (err) {
        res.status(500).send("Server error!");
    }
});

router.delete("/all", async (req, res) => {
    try {
        await pomodoroController.deleteAllPomodoro(req.query.ownerPomodoro);
        res.status(200).send("Pomodoros deleted!");
    } catch (err) {
        res.status(500).send("Server error!");
    }
});

/*Do not use
router.put("/nextDay", async (req, res) => {
    try {
        const dateToSearch = timeMachineController.getYYYYMMDDserverClock();
        const dateToUpdate = timeMachineController.getYYYYMMDDnextDay();
        const pomodoro = await pomodoroController.deletePomodoro(req.query.ownerPomodoro, dateToSearch);
        await pomodoroController.addNextDay(req.query.ownerPomodoro, pomodoro.cycles, dateToUpdate);
        res.status(202).send(`${pomodoro.cycles} added to next day!`);
    } catch (err) {
        res.status(500).send("Server error!");
    }
});
*/

export default router;