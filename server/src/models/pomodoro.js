import mongoose from "mongoose";

const pomodoroSchema = new mongoose.Schema({
    ownerPomodoro: {
        type: String,
        required: true,
        trim: true
    },
    cycles: {
        type: Number,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    breakDuration: {
        type: Number,
        required: true
    },
    datePomodoro: {
        type: String, // Mantieni il tipo String se il formato ISO è una stringa
        required: true,
        validate: {
            validator: function (v) {
                // Controlla che la data sia nel formato YYYY-MM-DD
                return /^\d{4}-\d{2}-\d{2}$/.test(v);
            },
            message: props => `${props.value} is not a valid date format! Use YYYY-MM-DD.`
        }
    }
});

export default mongoose.model("Pomodoro", pomodoroSchema);