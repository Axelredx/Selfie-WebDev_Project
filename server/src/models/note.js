import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    owner: {
        type: String,
        required: true,
        trim: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    trimmedContent: {
        type: String,
        required: true,
        trim: true,
        maxlenght: 200
    },
    date : {
        type: Date,
        required: true
    },
    lastUpdate: {
        type: Date,
        required: true
    }   
});

export default mongoose.model("Note", noteSchema);