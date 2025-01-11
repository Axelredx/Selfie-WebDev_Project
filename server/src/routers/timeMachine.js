import { Router } from 'express';
import * as timeMachineController from '../controllers/timeMachine.js';

const router = Router();

router.get('/', async (_req, res) => {
    try {
        const time = await timeMachineController.getServerClock();
        res.status(200).json({ time: time.toISOString() });
    } catch (err) {
        //console.error('Error getting server clock:', err);
        res.status(500).send('Server error!');
    }
});

router.get('/YYYYMMDD', async (_req, res) => {
    try {
        const time = await timeMachineController.getYYYYMMDDserverClock();
        res.status(200).json({ time: time });
    } catch (err) {
        //console.error('Error getting server clock:', err);
        res.status(500).send('Server error!');
    }
});

router.post('/setClock', async (req, res) => {
    try {
        const newDate = new Date(req.body.date);  
        if (isNaN(newDate.getTime())) {
            return res.status(400).send('Invalid date format');
        }
        //console.log('Request to set clock with date:', newDate);
        await timeMachineController.setServerClock(newDate);  
        res.status(200).json({ message: 'Server clock updated' });
    } catch (err) {
        //console.error('Error in setClock:', err);
        res.status(500).send('Server error!');
    }
});


router.post('/resetClock', async (_req, res) => {
    try {
        const time = await timeMachineController.resetServerClock();
        res.status(200).json({ time: time.toISOString() });
    } catch (err) {
        //console.error('Error resetting server clock:', err);
        res.status(500).send('Server error!');
    }
});

export default router;
