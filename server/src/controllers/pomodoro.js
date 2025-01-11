import Pomodoro from "../models/pomodoro.js";

export const createPomodoro = async (ownerPomodoro, cycles, duration, breakDuration, datePomodoro) => {
    try {
        return await Pomodoro.create({
            ownerPomodoro: ownerPomodoro,
            cycles: cycles,
            duration: duration,
            breakDuration: breakDuration,
            datePomodoro: datePomodoro
        });
    } catch (error) {
        //console.error('Error creating Pomodoro:', error);
        return null;
    }
}

export const findPomodoro = async (ownerPomodoro, datePomodoro) => {
    try {
        const query = { ownerPomodoro: ownerPomodoro, datePomodoro: datePomodoro };
        //console.log(query);
        return await Pomodoro.findOne(query).orFail();
    } catch (error) {
        //console.error(`Pomodoro not found for owner: ${ownerPomodoro}`);//, error);
        return null;
    }
}

export const findAllPomodoro = async (owner) => {
    try {
        return await Pomodoro.find({ownerPomodoro: owner}).orFail();
    } catch (error) {
        //console.error(`Pomodoro not found for owner: ${owner}`);//, error);
        return null;
    }
}

export const findAllPomodoroByDate = async (date) => {
    try {
        return await Pomodoro.find({datePomodoro: date}).orFail();
    } catch (error) {
        // console.error(`Pomodoro not found for date: ${date}`);//, error);
        return null;
    }
}

export const deletePomodoro = async (ownerPomodoro, datePomodoro) => {
    try {
        const query =  { ownerPomodoro: ownerPomodoro, datePomodoro: datePomodoro };
        return await Pomodoro.findOneAndDelete(query).orFail();
    } catch (error) {
        //console.error(`Error deleting Pomodoro for owner ${owner}:`, error);
        return null;
    }
}

export const deleteAllPomodoro = async (owner) => {
    try {
        return await Pomodoro.deleteMany({ownerPomodoro: owner}).orFail();
    } catch (error) {
        //console.error(`Error deleting Pomodoro for owner ${owner}:`, error);
        return null;
    }
}

export const deleteAllPomodoroByDate = async (date) => {
    try {
        return await Pomodoro.deleteMany({datePomodoro: date}).orFail();
    } catch (error) {
        // console.error(`Error deleting Pomodoro for date ${date}:`, error);
        return null;
    }
}

/* Do not use
export const addNextDay = async (owner, cyclesToAdd, dateToUpdate) => {
    try {
        const pomodoro = await Pomodoro.findOne({ ownerPomodoro: owner, datePomodoro: dateToUpdate }).orFail();
        await Pomodoro.updateOne(
            { ownerPomodoro: owner, datePomodoro: dateToUpdate },
            { $set: { cycles: pomodoro.cycles + cyclesToAdd } }
        );
    } catch (error) {
        console.error(`Error updating Pomodoro for owner ${owner}:`, error);
        return null;
    }
};
*/