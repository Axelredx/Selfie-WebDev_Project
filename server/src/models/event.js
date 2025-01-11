import mongoose from "mongoose";


const eventSchema = new mongoose.Schema({
    owner: {//molti required sono false per testing!!!!
        type: String,
        required: false,
        trim: true
    },
    allDay: {
        type: Boolean,
        required: false,
    },
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: false
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    groupId: {
        type: String,
        required: false,
    },
    rrule: {
        type: Object,
        required: false
    },
    color: {
        type: String,
        required: false
    },
    _deadline: {
        type: Date,
        required: false
    },
    EarlyFlag: {
        type: Boolean,
        required: false
    },
    LateFlag: {
        type: Boolean,
        required: false
    },
    
});

export default mongoose.model("Event", eventSchema);