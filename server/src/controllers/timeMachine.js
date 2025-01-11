let serverClock = new Date();
console.log('Server clock initialized at:', serverClock);

export const getServerClock = () => {
    return serverClock;
};

export const getYYYYMMDDserverClock = () => {
    const date = new Date(getServerClock());
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`
};

export const getYYYYMMDDnextDay = () => {
    const date = new Date(getServerClock());
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate() + 1).padStart(2, '0');
    return `${year}-${month}-${day}`
};

export const getYYYYMMDDyesterday = () => {
    const date = new Date(getServerClock()); 
    date.setDate(date.getDate() - 1); // set to yesterday
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0'); 
    return `${year}-${month}-${day}`;
};

// return year in number
export const getYearServerClock = () => {
    return new Date(getServerClock()).getFullYear();
}

// return month in number
export const getMonthServerClock = () => {
    return new Date(getServerClock()).getMonth();
}

// return day in number
export const getDayServerClock = () => {
    return new Date(getServerClock()).getDay();
}

// return hour in number
export const getHourServerClock = () => {
    return new Date(getServerClock()).getHours();
}

// return minutes in number
export const getMinutesServerClock = () => {
    return new Date(getServerClock()).getMinutes();
}

// return seconds in number
export const getSecondsServerClock = () => {
    return new Date(getServerClock()).getSeconds();
}

export const setServerClock = (newDate) => {
    if (newDate instanceof Date && !isNaN(newDate.getTime())) {
        serverClock = new Date(newDate);
    } else {
        throw new Error('Invalid date');
    }
};

export const resetServerClock = () => {
    serverClock = new Date();
    return serverClock;
};
