import Event from "../models/event.js";
import { getServerClock } from "../controllers/timeMachine.js";
import pkg from "rrule";
const { RRule } = pkg; //mistero della fede

export const createEvent = (owner, id, allDay, start, end, title, rrule, groupId, color, _deadline, EarlyFlag, Lateflag) => {
    try {
        return Event.create({
            owner: owner,
            id: id,
            allDay: allDay,
            start: start,
            end: end,
            title: title,
            rrule: rrule,
            groupId: groupId,
            color: color,
            _deadline: _deadline,
            EarlyFlag: EarlyFlag,
            LateFlag: Lateflag

        });
    } catch (error) {
        //console.error("Error creating event", error);
        return null;
    }
}

export const deleteEvent = async (owner, _id) => {
    try {
        await Event.findOneAndDelete({ owner, _id }).orFail();
    } catch (error) {
        //console.error(`Event not found on owner: ${owner}, id: ${_id} `, error);
        return null;
    }
}

export const findAllEvents = async (ownerName) => {
    try {
        return await Event.find({ owner: ownerName }).orFail();
    } catch (error) {
        //console.error(`Group of events not found on owner: ${owner}`, error);
        return null;
    }
}

export const findActiviesLate = async () => {
    try {
        const eventsList = await Event.find({ groupId: "deafult_server_DontUseThisNamePls_activity" }).orFail();
        const currentServerDate = new Date(getServerClock());



        // Filtra gli eventi che rientrano nell'intervallo della giornata
        const filteredEvents = eventsList.filter(event => {
            return new Date(event._deadline).getTime() < currentServerDate.getTime();
        });

        return filteredEvents;
    } catch (error) {
        //console.error(`Error finding events":`, error);
        return [];
    }
};

export const delayActivity = async (owner, _id) => {
    let activity;
    try {
        const serverDate = new Date(getServerClock());
        serverDate.setDate(serverDate.getDate() + 1); // Aggiunge un giorno
        const end = new Date(serverDate).setHours(0, 0, 0, 0);
        activity = await Event.updateOne({ owner, _id }, {
            $set: {
                end: end,
                color: "#ff00ff"
            }
        }).orFail();
    } catch (error) {
        //console.error(`Event not found on owner: ${owner}, title: ${_id} `, error);
        return null;
    }

}

function convertToRRule(fullCalendarRRule) {//chat gpt doing God's work
    const freqMapping = {
        'DAILY': RRule.DAILY,
        'WEEKLY': RRule.WEEKLY,
        'MONTHLY': RRule.MONTHLY,
        'YEARLY': RRule.YEARLY
    };
    let obj = {};
    if(fullCalendarRRule.dtstart){
        obj.dtstart = new Date(fullCalendarRRule.dtstart);
    }
    if(fullCalendarRRule.until){
        obj.until = new Date(fullCalendarRRule.until);
    }
    if(fullCalendarRRule.count){   
        obj.count = fullCalendarRRule.count;
    }
    if(fullCalendarRRule.freq){
        obj.freq = freqMapping[fullCalendarRRule.freq];
    }
    if(fullCalendarRRule.byweekday){
        obj.byweekday = fullCalendarRRule.byweekday;
    }
    if(fullCalendarRRule.bysetpos){
        obj.bysetpos = fullCalendarRRule.bysetpos;
    }
    return new RRule(obj);
}

export const findEventsInTime = async (flag) => { //true = early, false = late
    //finds all events that are happening at the given time from now, this function is going to be used to send notifications to the users
    //and is going to be called by the event deamon every minute.
    try {
        const currentServerDate = new Date(getServerClock());
        let start;
        let eventsList;
        if (flag) {
            eventsList = await Event.find({ groupId: "deafult_server_DontUseThisNamePls_event", EarlyFlag: true }).orFail();
            start = new Date(currentServerDate).setHours(currentServerDate.getHours() + 1, currentServerDate.getMinutes(), 0, 0);//1 ora prima
        }
        else {
            eventsList = await Event.find({ groupId: "deafult_server_DontUseThisNamePls_event", LateFlag: true }).orFail();
            start = new Date(currentServerDate).setHours(currentServerDate.getHours(), currentServerDate.getMinutes() + 5, 0, 0);//5 min prima
        }
        // Filtra gli eventi che rientrano nell'intervallo della giornata
        const filteredEvents = eventsList.filter(event => {

            if (event.rrule) {
                const rrulee = convertToRRule(event.rrule);
                const array = rrulee.all();
                for (const item of array) {
                    //console.log("item" + item);
                    const startDate = new Date(item).getTime()
                    if (startDate == start) {
                        return true;
                    }
                }
                return false;
            }
            else {
                //console.log("Evento senza rrule Pescato" + event);
                const startDate = new Date(event.start).getTime();
                return (startDate == start);
            }
        });

        return filteredEvents;
    } catch (error) {
        //console.error(`Error finding events":`, error);
        return [];
    }
}





export const findActivitiesInTime = async (hours, minutes) => {
    //finds all events that are happening at the given time from now, this function is going to be used to send notifications to the users
    //and is going to be called by the event deamon every minute.
    try {
        const eventsList = await Event.find().orFail();
        const currentServerDate = new Date(getServerClock());
        const start = new Date(currentServerDate).setHours(currentServerDate.getHours() + hours, currentServerDate.getMinutes() + minutes, 0, 0);

        // Filtra gli eventi che rientrano nell'intervallo della giornata
        const filteredEvents = eventsList.filter(event => {
            if (event.groupId != "deafult_server_DontUseThisNamePls_activity") {
                return false;
            }
            const startDate = new Date(event._deadline).getTime();
            return (startDate == start); // guardia un po' fragile ma per una volta al minuto dovrebbe funzionare.
        });

        return filteredEvents;
    } catch (error) {
        //console.error(`Error finding events":`, error);
        return [];
    }
}



export const findEventsByDate = async (date) => {
    try {
        // Converte la data fornita in un oggetto `Date`
        const targetDate = new Date(date);
        if (isNaN(targetDate)) {
            throw new Error("La data fornita non è valida.");
        }

        // Imposta l'inizio e la fine del giorno specificato
        const startOfDay = new Date(targetDate).setHours(0, 0, 0, 0);
        const endOfDay = new Date(targetDate).setHours(23, 59, 59, 999);

        // Trova tutti gli eventi
        const eventsList = await Event.find().orFail();

        // Filtra gli eventi che rientrano nell'intervallo della giornata
        const filteredEvents = eventsList.filter(event => {
            const startDate = new Date(event.start).getTime();
            const endDate = new Date(event.end).getTime();
            return startDate <= endOfDay && endDate >= startOfDay;
        });

        return filteredEvents;
    } catch (error) {
        //console.error(`Error finding events:`, error);
        return [];
    }
};


export const findEventsDate = async (ownerName) => {
    try {
        const eventsList = await Event.find({ owner: ownerName }).orFail();
        const currentServerDate = new Date(getServerClock());

        const startOfDay = new Date(currentServerDate).setHours(0, 0, 0, 0); // Inizio del giorno
        const endOfDay = new Date(currentServerDate).setHours(23, 59, 59, 999); // Fine del giorno

        // Filtra gli eventi che rientrano nell'intervallo della giornata
        const filteredEvents = eventsList.filter(event => {
            
            if(event.rrule){
                const rrulee = convertToRRule(event.rrule);
                const array = rrulee.all();
                for (const item of array) {
                    const startDate = new Date(item).getTime()
                    if (startOfDay <=startDate && startDate <= endOfDay) {
                        return true;
                    }
                }
                return false;
            }
            else{
                const startDate = new Date(event.start).getTime();
                const endDate = new Date(event.end).getTime();
                return startDate <= endOfDay && endDate >= startOfDay;
            }
        });

        return filteredEvents;
    } catch (error) {
        //console.error(`Error finding events for owner "${ownerName}":`, error);
        return [];
    }
};

export const modifyEvent = async (Owner, _id, newEvent) => {
    deleteEvent(Owner, _id);
    createEvent(newEvent.owner, newEvent.id, newEvent.allDay, newEvent.start, newEvent.end, newEvent.title);
}