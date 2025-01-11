import * as pomodoroController from "./pomodoro.js";

// Given a date, returns an array of dates of the week
export const getWeekDates = (givenDate) => {
    const weekDates = [];
    const [year, month, day] = givenDate.split('-').map(Number); // Estrarre anno, mese, giorno
    const baseDate = new Date(year, month - 1, day); // Creare un oggetto Date
    const weekday = baseDate.getDay();
    const diff = baseDate.getDate() - weekday + (weekday === 0 ? -6 : 1); // Calcola il lunedì

    let currentDay = new Date(baseDate);
    currentDay.setDate(diff);

    for (let i = 0; i < 7; i++) {
        const year = currentDay.getFullYear();
        const month = String(currentDay.getMonth() + 1).padStart(2, '0');
        const day = String(currentDay.getDate()).padStart(2, '0');
        weekDates.push(`${year}-${month}-${day}`);
        currentDay.setDate(currentDay.getDate() + 1);
    }

    return weekDates;
};

// Given a date, returns an array of dates of the month
export const getMonthDates = (givenDate) => {
    const monthDates = [];
    const [year, month] = givenDate.split('-').map(Number); // Estrarre anno e mese
    const daysInMonth = new Date(year, month, 0).getDate(); // Numero di giorni nel mese

    for (let day = 1; day <= daysInMonth; day++) {
        const formattedDay = String(day).padStart(2, '0');
        const formattedMonth = String(month).padStart(2, '0');
        monthDates.push(`${year}-${formattedMonth}-${formattedDay}`);
    }

    return monthDates;
};


// Retrieve Pomodoros for the current week
export const pomodoroThisWeek = async (ownerPomodoro, datePomodoro) => {
    const pomodoros = [];
    const days = getWeekDates(datePomodoro); 

    for (const day of days) {
        try {
            const pomodoroDay = await pomodoroController.findPomodoro(ownerPomodoro, day); 
            if (pomodoroDay) {
                pomodoros.push(pomodoroDay);
            }
        } catch (error) {
            //console.error(`Error fetching pomodoro for date ${day}:`, error);
        }
    }
    return pomodoros;
};

// Retrieve Pomodoros for the current month
export const pomodoroThisMonth = async (ownerPomodoro, datePomodoro) => {
    const pomodoros = [];
    const days = getMonthDates(datePomodoro); 

    for (const day of days) {
        try {
            const pomodoroDay = await pomodoroController.findPomodoro(ownerPomodoro, day); 
            if (pomodoroDay) {
                pomodoros.push(pomodoroDay);
            }
        } catch (error) {
            //console.error(`Error fetching pomodoro for date ${day}:`, error);
        }
    }
    return pomodoros;
};
