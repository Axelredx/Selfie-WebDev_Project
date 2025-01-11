import * as checkerController from '../controllers/checker.js';
import * as pomodoroController from '../controllers/pomodoro.js';
import * as timeMachineController from '../controllers/timeMachine.js';
import { Router } from 'express';

const router = Router();

router.get('/pomodoroToday', async (req, res) => {
    try {
        const date = timeMachineController.getYYYYMMDDserverClock();
        const ownerPomodoro = req.query.ownerPomodoro; 
        const pomodoros = await pomodoroController.findPomodoro(ownerPomodoro, date);
        if (pomodoros) {
            res.status(200).send(pomodoros);
        } else {
            res.status(204).send(pomodoros);
        }
    } catch (err) {
        res.status(500).send('Server error!');
    }
});

router.get("/todayServer", async (req, res) => {
    try {
        const date = timeMachineController.getYYYYMMDDserverClock();
        const ownerPomodoro = req.query.ownerPomodoro; 
        const pomodoro = await pomodoroController.findPomodoro(ownerPomodoro, date);
        if (pomodoro) {
            res.status(200).json({
                cycles: pomodoro.cycles,
                duration: pomodoro.duration,
                breakDuration: pomodoro.breakDuration,
                datePomodoro: pomodoro.datePomodoro,
            });
        } else {
            res.status(204).send("Pomodoro not found!");
        }
    } catch (err) {
        res.status(500).send("Server error!");
    }
});

router.get('/pomodoroThisWeek', async (req, res) => {
    try {
        const date = timeMachineController.getYYYYMMDDserverClock();
        const ownerPomodoro = req.query.ownerPomodoro; 
        const pomodoros = await checkerController.pomodoroThisWeek(ownerPomodoro, date);
        if (pomodoros) {
            res.status(200).send(pomodoros);
        } else {
            res.status(204).send(pomodoros);
        }
    } catch (err) {
        res.status(500).send('Server error!');
    }
});

router.get('/pomodoroThisMonth', async (req, res) => {
    try {
        const date = timeMachineController.getYYYYMMDDserverClock();
        const ownerPomodoro = req.query.ownerPomodoro; 
        const pomodoros = await checkerController.pomodoroThisMonth(ownerPomodoro, date);
        if (pomodoros) {
            res.status(200).send(pomodoros);
        } else {
            res.status(204).send(pomodoros);
        }
    } catch (err) {
        res.status(500).send('Server error!');
    }
});

export default router;
