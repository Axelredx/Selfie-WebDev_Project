import { Router } from "express";
import * as eventController from "../controllers/event.js";
import { format, parse } from 'date-fns';
import Event from "../models/event.js";

const router = Router();

router.post("/", async (req, res) => {
    try {
        //console.log("nel post",req.body);
        const event = await eventController.createEvent(req.body.owner, req.body.id, req.body.allDay, req.body.start, req.body.end, req.body.title, req.body.rrule, req.body.groupId, req.body.color, req.body._deadline, req.body.EarlyFlag, req.body.LateFlag);
        if (event) {
            res.status(201).send("Event created!");
        } else {
            res.status(400).send("Event not created!");
        }
    } catch (err) {
        res.status(500).send("Server error!");
    }
});

router.post("/delete", async (req, res) => {
    try {
        await eventController.deleteEvent(req.body.owner,req.body._id);
        res.status(201).send("Event deleted!");
    } catch (err) {
        res.status(500).send("Server error!");
    }
});

router.get("/all", async (req, res) => {
    try {
        
        const events = await eventController.findAllEvents(req.body.username);
        if (events) {
            res.status(200).send(events);
        } else {
            res.status(404).send("Seems your schedule is clear!");
        }
    } catch (err) {
        res.status(500).send("Server error!");
    }
});

router.get("/getEventsTodayServer", async (req, res) => {
    try {
        const owner = req.query.owner; 
        const events = await eventController.findEventsDate(owner);
        if (events && events.length > 0) {
            res.status(200).send(events); 
        } else {
            res.status(204).send([]); 
        }
    } catch (err) {
        //console.error("Error fetching events:", err.message);
        res.status(500).send("Server error!");
    }
});

router.post("/modify", async (req, res) => {
    try {
        //console.log("nel post",req.body);
        const event = await eventController.modifyEvent(req.body.oldOwner,req.body._id, req.body.newEvent);
        if (event) {
            res.status(201).send("Event modified!");
        } else {
            res.status(400).send("Event not modified!");
        }
    } catch (err) {
        res.status(500).send("Server error!");
    }
});

export default router;