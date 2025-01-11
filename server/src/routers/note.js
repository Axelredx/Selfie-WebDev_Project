import { Router } from "express";
import * as noteController from "../controllers/note.js";
import { format, parse } from 'date-fns';
import note from "../models/note.js";

const router = Router();

router.get("/all", async (req, res) => {
    try {
        const notes = await noteController.findAllNote(req.body.username);
        if (notes) {
            res.status(200).send(notes);
        } else {
            res.status(204).send(notes);
        }
    } catch (err) {
        res.status(500).send("Server error!");
    }
});

router.get("/all/sortedByCategory", async (req, res) => {
    try {
        const notes = await noteController.findAllNote(req.body.username);
        if (notes) {
            res.status(200).send(notes.sort((a, b) => a.category.localeCompare(b.category)));
        } else {
            res.status(204).send(notes);
        }
    } catch (err) {
        res.status(500).send("Server error!");
    }
});

router.get("/all/sortedByDate", async (req, res) => {
    try {
        const notes = await noteController.findAllNote(req.body.username);
        if (notes) {
            res.status(200).send(notes.sort((a, b) => new Date(a.data) - new Date(b.data)));
        } else {
            res.status(204).send(notes);
        }
    } catch (err) {
        res.status(500).send("Server error!");
    }
});

router.get("/all/sortedByTextLenght", async (req, res) => {
    try {
        const notes = await noteController.findAllNote(req.body.username);
        if (notes) {
            res.status(200).send(notes.sort((a, b) => a.content.length - b.content.length));
        } else {
            res.status(204).send(notes);
        }
    } catch (err) {
        res.status(500).send("Server error!");
    }
});

router.get("/", async (req, res) => {
    try {
        const parsedDate = new Date(req.body.date);
        const note = await noteController.findNote(req.body.username, parsedDate);
        if (note) {
            res.status(200).json({
                owner: note.owner,
                title: note.title,
                content: note.content,
                trimmedContent: note.trimmedContent,
                date: note.date,
                lastUpdate: note.lastUpdate
            });
        } else {
            res.status(404).send("Note not found!");
        }
    } catch (err) {
        res.status(500).send("Server error!");
    }
});

router.post("/", async (req, res) => {
    try {
        await noteController.createNote(req.body.username, req.body.title, req.body.category, req.body.content);
        res.status(201).send("Note created!");
    } catch (err) {
        res.status(500).send("Server error!");
    }
});

router.put("/", async (req, res) => {
    try {
        const parsedDate = new Date(req.body.date);
        await noteController.updateNote(req.body.username, req.body.title, req.body.category, req.body.content, parsedDate);
        res.status(200).send("Note updated!");
    } catch (err) {
        res.status(500).send("Server error!");
    }
});

router.delete("/all", async (req, res) => {
    try {
        await noteController.deleteAllNote(req.body.username);
        res.status(200).send("Notes deleted!");
    } catch (err) {
        res.status(500).send("Server error!");
    }
});

router.delete("/", async (req, res) => {
    try {
        const parsedDate = new Date(req.body.date);
        await noteController.deleteNote(req.body.username, parsedDate);
        res.status(200).send("Note deleted!");
    } catch (err) {
        res.status(500).send("Server error!");
    }
});

export default router;