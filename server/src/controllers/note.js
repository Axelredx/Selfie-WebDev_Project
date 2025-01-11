import Note from "../models/note.js";

export const createNote = (owner, title, category, content) => {
    const trimmedContent = content.length > 200 ? content.substring(0, 200) + '...' : content;
    try {
        return Note.create({
            owner: owner,
            title: title,
            category: category,
            content: content,
            trimmedContent: trimmedContent,
            date: Date.now(),
            lastUpdate: Date.now()
        });
    } catch (error) {
        //console.error("Error creating note", error);
        return null;
    }
}   

export const findAllNote = async (owner) => {
    try {
        return await Note.find({ owner}).orFail();
    } catch (error) {
        //console.error(`Group of notes not found on owner: ${owner}`, error);
        return null;
    }
}

export const deleteAllNote = async (owner) => {
    try {
        await Note.deleteMany({ owner }).orFail();
    } catch (error) {
        //console.error(`Can't delete all notes not found on owner: ${owner}`, error);
        return null;
    }
}

export const findNote = async (owner, date) => {
    try {
        return await Note.findOne({ owner , date }).orFail();
    } catch (error) {
        //console.error(`Note not found on owner: ${owner} and date: ${date}`, error);
        return null;
    }
}

export const deleteNote = async (owner, date) => {
    try {
        await Note.findOneAndDelete({ owner, date }).orFail();
    } catch (error) {
        //console.error(`Note not found on owner: ${owner} and date: ${date}`, error);
        return null;
    }
}

export const updateNote = async (owner, title, category, content, date) => {
    const trimmedContent = content.length > 200 ? content.substring(0, 200) + '...' : content;
    try {
        const lastUpdate = Date.now();
        await Note.findOneAndUpdate({ owner, date }, { title, category, content, trimmedContent, lastUpdate: lastUpdate }).orFail();
    } catch (error) {
        //console.error(`Can't update note not found on owner: ${owner} and date: ${date}`, error);
        return null;
    }
}
