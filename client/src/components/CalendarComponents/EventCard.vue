<script setup>
import { end, start } from '@popperjs/core';
import { ref, computed } from 'vue';
import { session } from '@/session';


const dateYYYYMMDD = ref("");
const username = ref("");

const emit = defineEmits(['handleCloseDialog', 'deleteEvent', 'dataObtained', 'addPomodoro', 'deletePomodoro']);


const endType = ref("until");
const isRecur = ref(false);
const monday = ref(false);
const tuesday = ref(false);
const wednesday = ref(false);
const thursday = ref(false);
const friday = ref(false);
const saturday = ref(false);
const sunday = ref(false);
const isEvent = ref(true);
const tmpDate = ref(new Date());
/*
const getYYYYMMDDdate = async () => {
    const date = await session.get('/api/timeMachine/YYYYMMDD').then((response) => {
        dateYYYYMMDD.value = response.data;
    });
}
getYYYYMMDDdate();
*/



const pomodoroDisplay = ref(false);
const TimeToInput = ref(false);
const Data = defineModel('Data');
const startDate = ref("");
const endDate = ref("");
const startTime = ref("");
const endTime = ref("");
const selectedTimezone = ref("0");



const closeDialog = () => {
    pomodoroDisplay.value = false;
    emit('handleCloseDialog', true);
};
const deleteEvent = () => {
    emit('deleteEvent', true);
};


const pomodoroData = ref({
    cycles: 5,
    duration: 25,
    breakDuration: 5,
    datePomodoro: Data.value.Event.start.slice(0, 10)
});

const showForm = (miao) => {
    isEvent.value = miao;
    const offsetMinutes = new Date().getTimezoneOffset(); // Offset in minuti (negativo per fusi orari a est di UTC)
    selectedTimezone.value = -(offsetMinutes / 60); // Convertiamo in ore e invertiamo il segno
    if (isEvent.value) {
        TimeToInput.value = true;
        Data.value.Event.groupId = "deafult_server_DontUseThisNamePls_event";
        Data.value.Event.title = "New Event";
        startDate.value = new Date(Data.value.Event.start).toISOString().split('T')[0];
        startTime.value = new Date(Data.value.Event.start).toISOString().split('T')[1].slice(0, 5);
    }
    else {
        TimeToInput.value = true;

        Data.value.Event.title = "New Activity";
        Data.value.Event.groupId = "deafult_server_DontUseThisNamePls_activity";
        Data.value.Event.color = "#ff0000";
        Data.value.Event.allDay = true;
        Data.value.Event.rrule = null;
        Data.value.Event.start = new Date(Data.value.today).toISOString();

    }

    endDate.value = new Date(Data.value.Event.end).toISOString().split('T')[0];
    endTime.value = new Date(Data.value.Event.end).toISOString().split('T')[1].slice(0, 5);

    //Data.value.Event.start = Data.value.Event.start.toISOString().slice(0, 16);
    /* 
    
    
    //console.log('Event.value.start:', Data.value.Event.value.start);
    
    Data.value.Event.value.end = Data.value.Event.value.end.toISOString().slice(0, 16); */
};
const modifyEvent = () => {
    emit('dataObtained', Data.value.onModify);
};
const createEvent = () => {
    emit('dataObtained', Data.value.onModify);
};

const allWeekOn = () => {
    monday.value = true;
    tuesday.value = true;
    wednesday.value = true;
    thursday.value = true;
    friday.value = true;
    saturday.value = true;
    sunday.value = true;
};

const convertOffsetToISOSuffix = (offset) => {
    const hours = Math.floor(Math.abs(offset)).toString().padStart(2, "0");
    const minutes = "00"; // Offset sempre in ore intere
    const sign = offset >= 0 ? "+" : "-";
    return `${sign}${hours}:${minutes}`;
};

const isoTimezoneSuffix = computed(() => convertOffsetToISOSuffix(Number(selectedTimezone.value)));

const timezones = {
    "-12": "UTC-12:00 (Baker Island, Howland Island)",
    "-11": "UTC-11:00 (Samoa, Midway Atoll)",
    "-10": "UTC-10:00 (Hawaii-Aleutian Time, Tahiti)",
    "-9": "UTC-09:00 (Alaska Time)",
    "-8": "UTC-08:00 (Pacific Time, Los Angeles, Vancouver)",
    "-7": "UTC-07:00 (Mountain Time, Denver, Calgary)",
    "-6": "UTC-06:00 (Central Time, Chicago, Mexico City)",
    "-5": "UTC-05:00 (Eastern Time, New York, Toronto, Lima)",
    "-4": "UTC-04:00 (Atlantic Time, Caracas, Santiago)",
    "-3": "UTC-03:00 (Buenos Aires, São Paulo, Montevideo)",
    "-2": "UTC-02:00 (South Georgia, Atlantic Islands)",
    "-1": "UTC-01:00 (Azores, Cape Verde)",
    "0": "UTC+00:00 (Greenwich Mean Time, London, Reykjavik)",
    "1": "UTC+01:00 (Central European Time, Rome, Paris, Berlin)",
    "2": "UTC+02:00 (Eastern European Time, Athens, Helsinki, Istanbul)",
    "3": "UTC+03:00 (Moscow, Riyadh, Nairobi)",
    "4": "UTC+04:00 (Dubai, Samara, Baku)",
    "5": "UTC+05:00 (Pakistan Standard Time, Islamabad, Karachi)",
    "6": "UTC+06:00 (Bangladesh Time, Dhaka, Omsk)",
    "7": "UTC+07:00 (Indochina Time, Bangkok, Hanoi, Jakarta)",
    "8": "UTC+08:00 (China Standard Time, Beijing, Singapore, Perth)",
    "9": "UTC+09:00 (Japan Standard Time, Tokyo, Seoul, Pyongyang)",
    "10": "UTC+10:00 (Australian Eastern Time, Sydney, Vladivostok)",
    "11": "UTC+11:00 (Solomon Islands, New Caledonia)",
    "12": "UTC+12:00 (Fiji, Kamchatka, Auckland)"
};

const getInput = () => {
    //console.log("suffisso:", isoTimezoneSuffix.value);
    let str = ""
    let date = "";
    if (startDate.value && startTime.value) {
        str = startDate.value + "T" + startTime.value + isoTimezoneSuffix.value;
        date = new Date(str).toISOString();
        Data.value.Event.start = new Date(date).toISOString();
    }
    const estr = endDate.value + "T" + endTime.value + isoTimezoneSuffix.value;


    const edate = new Date(estr).toISOString();

    Data.value.Event.end = new Date(edate).toISOString();
    if (Data.value.Event.rrule) {
        Data.value.Event.rrule.dtstart = Data.value.Event.start;
        if (!Data.value.Event.rrule.byweekday) {
            Data.value.Event.rrule.byweekday = [];
            if (monday.value) {
                Data.value.Event.rrule.byweekday.push(0);
            }
            if (tuesday.value) {
                Data.value.Event.rrule.byweekday.push(1);
            }
            if (wednesday.value) {
                Data.value.Event.rrule.byweekday.push(2);
            }
            if (thursday.value) {
                Data.value.Event.rrule.byweekday.push(3);
            }
            if (friday.value) {
                Data.value.Event.rrule.byweekday.push(4);
            }
            if (saturday.value) {
                Data.value.Event.rrule.byweekday.push(5);
            }
            if (sunday.value) {
                Data.value.Event.rrule.byweekday.push(6);
            }
        }
    }
    if (Data.value.onModify) {
        modifyEvent();
    }
    else {
        createEvent();
    }
};


const rruleInit = () => {
    if (!Data.value.Event.rrule && isRecur) {
        Data.value.Event.rrule = {
            freq: "DAILY",
            dtstart: Data.value.Event.start
        };
    } else if (!isRecur) {
        Data.value.Event.rrule = null;
    }
};


const getPomodoro = () => {
    //console.log("Pomodoro iniziale: ", pomodoroData.value);

    const date = new Date(tmpDate.value);
    pomodoroData.value.datePomodoro = date.toISOString().split('T')[0];

    //console.log("Pomodoro aggiornato: ", pomodoroData.value);

    pomodoroData.value.datePomodoro = startDate.value;
    closeDialog();
    emit('addPomodoro', pomodoroData.value);
};

const showEvent = () => {
    //console.log("scheduling event");
    showForm(true);
    pomodoroDisplay.value = false;
}

const showActivity = () => {
    //console.log("scheduling activity");
    showForm(false);
    pomodoroDisplay.value = false;
}

const showPomodoro = () => {
    //console.log("scheduling pomodoro");
    showForm(true);//this will be our little secret
    TimeToInput.value = false;
    pomodoroDisplay.value = true;

    startDate.value = new Date(Data.value.Event.start).toISOString().split('T')[0];
    pomodoroData.value.datePomodoro = Data.value.Event.start;
}

const deletePomodoro = () => {
    //console.log("deleting pomodoro");
    emit('deletePomodoro', pomodoroData.value);
}



</script>

<template>
    <div class="dialog-overlay">
        <div class="dialog">
            <div v-if="!(Data.onModify)">
                <div class="button-group">
                    <button @click="showEvent" id="ebtn">Create new Event</button>
                    <button @click="showActivity" id="actbtn">Create new Activity</button>
                    <button @click="showPomodoro" id="pomobtn">Schedule new Pomodoro</button>
                </div>
            </div>

            <div v-else>
                <div v-if="Data.Event.groupId !== 'deafult_server_DontUseThisNamePls_activity' && Data.Event.groupId !== 'default_server_DontUseThisNamePls_Pomodoro'"
                    class="button-group">
                    <button @click="showForm(true)" id="mdfybtn">Modify Event</button>
                    <button @click="deleteEvent" id="actbtn">Delete Event</button>
                </div>
                <div v-else-if="Data.Event.groupId !== 'deafult_server_DontUseThisNamePls_activity' && Data.Event.groupId === 'default_server_DontUseThisNamePls_Pomodoro'"
                    class="button-group">
                    <button @click="showPomodoro" id="mdfybtn">Modify Pomodoro</button>
                    <button @click="deletePomodoro" id="actbtn">Delete Pomodoro</button>
                </div>
                <div v-else class="button-group">
                    <button @click="showForm(false)" id="mdfybtn">Modify Activity</button>
                    <button @click="deleteEvent" id="actbtn">Delete Activity</button>
                </div>
            </div>

            <form v-if="pomodoroDisplay" @submit.prevent="getPomodoro" class="pomodoro-form">
                <!-- Quantità -->
                <div class="form-group">
                    <label for="quantity">Cycles n°:</label>
                    <input type="number" id="quantity" v-model="pomodoroData.cycles" min="1" required />
                </div>

                <!-- Durata -->
                <div class="form-group">
                    <label for="duration">Study session (min):</label>
                    <input type="number" id="duration" v-model="pomodoroData.duration" min="1" required />
                </div>

                <!-- Pausa -->
                <div class="form-group">
                    <label for="break">Break session (min):</label>
                    <input type="number" id="break" v-model="pomodoroData.breakDuration" min="1" required />
                </div>

                <!-- Data -->
                <div class="form-group">
                    <label for="date">Date:</label>
                    <input type="date" v-model="startDate" id="date" required />
                </div>

                <!-- Pulsante di invio -->
                <div class="form-group form-button">
                    <button type="submit">Create!</button>
                </div>
            </form>

            <form @submit.prevent="getInput" v-if="TimeToInput" class="event-activity-form">
                <div class="mb-3">
                    <label for="title">Title:</label>
                    <input type="text" v-model="Data.Event.title" id="title" placeholder="new title" required />
                </div>

                <div v-if="isEvent" class="mb-3">
                    <label for="start">Start:</label>
                    <div>
                        <input type="date" id="start" v-model="startDate" required />
                        <input v-if="!Data.Event.allDay" type="time" v-model="startTime"
                            :required="!Data.Event.allDay" /> <!-- TODO: si può gestire required se non AllDay  -->
                    </div>
                </div>

                <div class="mb-3">
                    <label for="end">End:</label>
                    <div>
                        <input type="date" id="end" v-model="endDate" required />
                        <input v-if="!Data.Event.allDay" type="time" v-model="endTime" :required="!Data.Event.allDay" />
                        <!-- TODO: si può gestire required se non AllDay  -->
                    </div>
                </div>

                <div>
                    <label for="timezone-select">Select Time Zone:</label>
                    <select id="timezone-select" v-model="selectedTimezone">
                        <option v-for="(label, offset) in timezones" :key="offset" :value="offset">
                            {{ label }}
                        </option>
                    </select>
                    <p>
                        <!-- (Offset: <strong>{{ selectedTimezone }}</strong>) -->
                    </p>
                </div>

                <label for="giornoIntero" v-if="isEvent">Giornata intera</label>
                <input v-if="isEvent" id="giornoIntero" type="checkbox" v-model="Data.Event.allDay" />
                <label v-if="isEvent" for="recursion">Repeat Event</label>
                <input id="recursion" v-if="isEvent" type="checkbox" v-model="isRecur" @click="rruleInit" />
                <div v-if="isRecur && isEvent">
                    <label for="freq">Recurrency:</label>
                    <select v-model="Data.Event.rrule.freq" id="freq" required>
                        <option value="DAILY">Daily</option>
                        <option value="WEEKLY">Weekly</option>
                        <option value="MONTHLY">Monthly</option>
                        <option value="YEARLY">Yearly</option>
                    </select>
                    <h6>Recurrency end type:</h6>
                    <label for="rUntil">End date</label>
                    <input type="radio" id="rUntil" v-model="endType" value="until" />
                    <label for="rCount">Number of iterations</label>
                    <input type="radio" id="rCount" v-model="endType" value="count" />

                    <!-- Data di fine -->
                    <div v-if="endType === 'until'">
                        <label for="until">End date:</label>
                        <input type="datetime-local" v-model="Data.Event.rrule.until" id="until" />
                    </div>

                    <!-- Numero di iterazioni -->
                    <div v-if="endType === 'count'">
                        <label for="count">Iteration n°:</label>
                        <input type="number" v-model.number="Data.Event.rrule.count" id="count" min="1" />
                    </div>

                    <div v-if="Data.Event.rrule.freq === 'MONTHLY'">
                        <label for="position">Settimana del mese:</label>
                        <select v-model.number="Data.Event.rrule.bysetpos" id="position">
                            <option value="1">First</option>
                            <option value="2">Second</option>
                            <option value="3">Third</option>
                            <option value="4">Fourth</option>
                            <option value="-1">Last</option>
                        </select>
                    </div>


                    <div v-if="Data.Event.rrule.freq === 'WEEKLY'">
                        <h6>Day of the week:</h6>
                        <input id="allWeek" type="button" value="All Week" @click="allWeekOn" />
                        <div>
                            <label for="mo">monday</label>
                            <input id="mo" type="checkbox" v-model="monday" />
                        </div>
                        <div>
                            <label for="tu">tuesday</label>
                            <input id="tu" type="checkbox" v-model="tuesday" />
                        </div>
                        <div>
                            <label for="we">wednesday</label>
                            <input id="we" type="checkbox" v-model="wednesday" />
                        </div>
                        <div>
                            <label for="th">thursday</label>
                            <input id="th" type="checkbox" v-model="thursday" />
                        </div>
                        <div>
                            <label for="fr">friday</label>
                            <input id="fr" type="checkbox" v-model="friday" />
                        </div>
                        <div>
                            <label for="sa">saturday</label>
                            <input id="sa" type="checkbox" v-model="saturday" />
                        </div>
                        <div>
                            <label for="su">sunday</label>
                            <input id="su" type="checkbox" v-model="sunday" />
                        </div>
                    </div>
                    <div v-if="Data.Event.rrule.freq === 'MONTHLY'">
                        <label>Giorno della settimana</label>
                        <select v-model.number="Data.Event.rrule.byweekday">
                            <option value="0">Monday</option>
                            <option value="1">Tuesday</option>
                            <option value="2">Wednesday</option>
                            <option value="3">Thursday</option>
                            <option value="4">Friday</option>
                            <option value="5">Saturday</option>
                            <option value="6">Sunday</option>
                        </select>
                    </div>



                </div>
                <label for="LateNotification" v-if="isEvent">
                    Notifica 5 minuti prima
                </label>
                <input v-if="isEvent" id="LateNotification" type="checkbox" v-model="Data.Event.LateFlag" />
                <label for="EarlyNotification" v-if="isEvent">
                    Notifica 1 ora prima
                </label>
                <input v-if="isEvent" id="EarlyNotification" type="checkbox" v-model="Data.Event.EarlyFlag" />

                <div v-if="isEvent" class="form-group form-button-event">
                    <button type="submit">Create!</button>
                </div>
                <div v-else class="form-group form-button-activity">
                    <button type="submit">Create!</button>
                </div>
            </form>

            <div class="button-group">
                <button @click="closeDialog" id="clsbtn">Close</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Overlay del dialog */
.dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    /* Sfondo semi-trasparente */
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

/* Contenitore del dialog */
.dialog {
    background: #fff;
    /* Sfondo bianco */
    border-radius: 8px;
    padding: 20px;
    width: 90%;
    max-width: 600px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    /* Ombra leggera */
    animation: fadeIn 0.3s ease-in-out;
}

/* Gruppo di pulsanti */
.button-group {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    margin: 20px 0;
}

/* Stile generico per i pulsanti */
.button-group button {
    background-color: #007bff;
    /* Colore principale blu */
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px 15px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.2s;
}

/* Effetto hover e attivo sui pulsanti */
.button-group button:hover {
    background-color: #0056b3;
}

.button-group button:active {
    transform: scale(0.95);
}

/* Modulo pomodoro */
.pomodoro-form .form-group {
    margin-bottom: 15px;
}

.pomodoro-form label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
}

.pomodoro-form input,
.pomodoro-form select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
}

/* Pulsante di invio nel modulo */
.pomodoro-form .form-button button {
    width: 100%;
    background-color: #28a745;
    /* Verde */
    color: white;
    font-weight: bold;
    border-radius: 5px;
}

.pomodoro-form .form-button button:hover {
    background-color: #218838;
}

/* Stile per le sezioni secondarie */
.mb-3 {
    margin-bottom: 15px;
}

.mb-3 label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
}

.span-column {
    display: flex;
    justify-content: space-between;
}

.event-activity-form {
    margin-bottom: 8px;
    overflow-y: auto;
    overflow-x: hidden;
    max-height: 70vh;
}

.event-activity-form label,
.event-activity-form h6 {
    display: block;
    font-weight: bold;
    margin-bottom: 2px;
}



.event-activity-form input,
.event-activity-form select {
    width: 100%;
    padding: 4px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 12px;
}

.event-activity-form .form-button-event button {
    width: 100%;
    background-color: #007bff;
    color: white;
    font-weight: bold;
    border-radius: 5px;
}

.event-activity-form .form-button-event button:hover {
    background-color: #0056b3;
}

.event-activity-form .form-button-activity button {
    width: 100%;
    background-color: #cc0000;
    color: white;
    font-weight: bold;
    border-radius: 5px;
}

.event-activity-form .form-button-activity button:hover {
    background-color: #a30000;
}



#ebtn {
    background-color: #007bff;
}

#actbtn {
    background-color: #cc0000;
}

#pomobtn {
    background-color: #0c8b00;
}

#mdfybtn {
    background-color: #e6a100;
}

#clsbtn {
    background-color: #b3c0cb;
}

#ebtn:hover {
    background-color: #0056b3;
}

#actbtn:hover {
    background-color: #a30000;
}

#pomobtn:hover {
    background-color: #0a6e00;
}

#mdfybtn:hover {
    background-color: #d08c00;
}

#clsbtn:hover {
    background-color: #8a9aae;
}

/* Animazione di comparsa */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: scale(0.95);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}

/* Adattamento per schermi piccoli */
@media (max-width: 480px) {
    .dialog {
        width: 95%;
        padding: 15px;
    }

    .button-group {
        flex-direction: column;
        gap: 5px;
    }
}
</style>
