<script>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import EventAdder from './EventAdder.vue'
import rrulePlugin from '@fullcalendar/rrule'
import TimeMachine from '../GeneralComponents/TimeMachine.vue'
import moment from 'vue-moment'

import { ref } from 'vue'
import { start } from '@popperjs/core'
import { session } from '@/session';
import allLocales from '@fullcalendar/core/locales-all'


export default {
  components: {
    FullCalendar, // make the <FullCalendar> tag available
    EventAdder,
  },

  data() {
    return {
      calendarApi: null,
      showDialog: ref(false),
      Event: {},
      onModify: ref(false),
      Ready: false,
      calendarOptions: {},
      Coptions: {
        plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin, rrulePlugin],
        locales: allLocales,
        locale: 'it',
        headerToolbar: {
          left: 'title',
          center: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
          right: 'prev,today,next'
        },
        buttonText: {
          today: 'Today',
          month: 'Month',
          week: 'Week',
          day: 'Day',
          list: 'List'
        },
        now: new Date(),
        weekends: "false",
        selectable: "true",
        editable: "true",
        initialView: 'dayGridMonth',
        nowIndicator: "true",
        select: this.handleSelect,
        eventClick: this.handleEventClick,
        events: [
        ]
      }
    }
  },
  mounted() {

    //this.calendarApi = this.$refs.fullCalendar.getApi();
    const fetchServerTime = async () => {
      try {
          const response = await session.get('/api/timeMachine');
          const updatedNow = new Date(response.data.time);  // Converte la stringa ISO in un oggetto Date
          ////console.log('Data dal server:', response.data.time);
          //console.log('Data aggiornata:', updatedNow);

          this.Coptions.now = updatedNow;  // Usa l'oggetto Date
          this.calendarOptions = this.Coptions;
          this.Ready = true;
      } catch (error) {
          //console.error('Errore nel recupero della data dal server:', error);
      }
    };


    // Recupera subito la data iniziale
    fetchServerTime();

    // Imposta un intervallo per aggiornare la data ogni 60 secondi
    this.updateInterval = setInterval(fetchServerTime, 60000);
  },
  
  beforeUnmount() {
    // Pulisci l'intervallo quando il componente viene smontato
    clearInterval(this.updateInterval);
  },
  methods: {
    addEvent(events) {
      this.calendarOptions.events = [] // altrimenti si accumulano sempre gli stessi eventi.
      
      for (let i = 0; i < events.length; i++) {
        const tempevent = {
          title: events[i].title,
          start: events[i].start,
          end: events[i].end,
          allDay: events[i].allDay,
          rrule: events[i].rrule,
          groupId: events[i].groupId,
          color: events[i].color,
          extendedProps: {
            _id: events[i]._id,
            deadline: events[i]._deadline,
            EarlyFlag: events[i].EarlyFlag,
            LateFlag: events[i].LateFlag
          }
        }
        this.calendarOptions.events.push(tempevent);
      }
    },
    handleEventClick: function (clickInfo) {
      this.onModify = true;
      this.showDialog = true;
      
      //dal server arrivano orari in UTC
      this.Event.title = clickInfo.event.title;
      this.Event.start = new Date(clickInfo.event.start);
      this.Event.timeZone = new Date(clickInfo.event.start).getTimezoneOffset();
      var tmp = this.Event.start.getHours() - this.Event.timeZone/60;
      var tmp2 = this.Event.start.getMinutes() - this.Event.timeZone%60;
      this.Event.start.setHours(tmp, tmp2, 0);
      this.Event.start = this.Event.start.toISOString();
      this.Event.end = new Date(clickInfo.event.end);
      tmp = this.Event.end.getHours() - this.Event.timeZone/60;
      tmp2 = this.Event.end.getMinutes() - this.Event.timeZone%60;
      this.Event.end.setHours(tmp, tmp2, 0);
      this.Event.end = this.Event.end.toISOString();
      this.Event.allDay = clickInfo.event.allDay;
      this.Event.rrule = clickInfo.event.rrule;
      this.Event.groupId = clickInfo.event.groupId;
      this.Event.color = clickInfo.event.color;
      this.Event._id = clickInfo.event.extendedProps._id;
      this.Event.deadline = clickInfo.event._deadline;
      this.Event.EarlyFlag = clickInfo.event.extendedProps.EarlyFlag;
      this.Event.LateFlag = clickInfo.event.extendedProps.LateFlag;
    },
    handleSelect: function (selectInfo) {
      this.showDialog = true;
      ////console.log("hai cliccato dal " + selectInfo.startStr + " al " + selectInfo.endStr);
      this.Event.title = "";
      this.Event.start = "";
      const temp = new Date(selectInfo.startStr).setHours(12, 0, 0);
      this.Event.start = new Date(temp);
      this.Event.timeZone = new Date().getTimezoneOffset();
      var tmp = this.Event.start.getHours() - this.Event.timeZone/60;
      var tmp2 = this.Event.start.getMinutes() - this.Event.timeZone%60;
      this.Event.start.setHours(tmp, tmp2, 0);
      this.Event.start = this.Event.start.toISOString();
      const temp2 = new Date(selectInfo.startStr).setHours(13, 0, 0);
      this.Event.end = new Date(temp2);
      tmp = this.Event.end.getHours() - this.Event.timeZone/60;
      tmp2 = this.Event.end.getMinutes() - this.Event.timeZone%60;
      this.Event.end.setHours(tmp, tmp2, 0);
      this.Event.end = this.Event.end.toISOString();
      

      this.Event.allDay = true;
      this.Event.rrule = null;
      this.Event.groupId = null;
      this.Event.color = null;
      this.Event.EarlyFlag = false;
      this.Event.LateFlag = false;
    },
    handleCloseDialog(value) {
      if (value) {
        this.showDialog = false;
        this.onModify = false;
        this.Event = {};
      }
    },
    handleLocale() {
      var locale = document.getElementById("locale-selector").value;
      this.calendarOptions.locale = locale;
    },
    test() {
      //console.log(this.calendarApi.getOption('now'));
    }
  }
}
</script>

<template>
  <div id="top">
    "local: 
    <select id="locale-selector" @change="handleLocale">
      <option value="it">Ita</option>
      <option value="en">Eng</option>
    </select> 
    "
  </div>
  <EventAdder @addEvent="addEvent" @handleCloseDialog="handleCloseDialog" v-model:Event="Event"
    v-model:onModify="onModify" :showDialog="showDialog" v-model:today="Coptions.now"/>

  <FullCalendar v-if="Ready" :options="calendarOptions" ref="fullCalendar" />
  <!--<button @click="test">Test data calendario</button>-->
</template>

<style>
#top {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 1px;
  border-bottom: 1px solid #d1d1d1;
  border-top: 1px solid #d1d1d1;
  background-color: #f7f7f7;
  padding: 12px 20px;
  border-radius: 8px;
}

/* .fc-... style applied to fullCalendar component*/
.fc {
  background-color: #ffffff !important; /* Rende il background del calendario opaco (non trasparente) */
  border: 2px solid black !important;  /* Aggiunge un bordo nero */
  border-radius: 8px;  /* Arrotonda i bordi del calendario */
}

.fc-header-toolbar {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
  background: linear-gradient(90deg, #e6f2ff, #b3d9ff);
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid black;
}

.fc-toolbar-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
  text-align: center;
  padding: 5px;
}

.fc-button {
  padding: 10px 16px;
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(90deg, #4a90e2, #0066cc);
  border: 1px solid #005bb5;
  border-radius: 6px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.fc-button:hover {
  background: linear-gradient(90deg, #0066cc, #004f99);
  transform: translateY(-2px);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.2);
}

.fc-button:active {
  background: linear-gradient(90deg, #004f99, #003366);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
}

.fc-button.fc-button-active {
  background: #007bff;
  color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.fc-button.fc-button-disabled {
  background: #b0bec5;
  color: #90a4ae;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .fc-header-toolbar {
    flex-direction: column;
    gap: 12px;
  }

  .fc-toolbar-title {
    font-size: 1.3rem;
  }

  .fc-button {
    width: 100%;
    text-align: center;
  }
}
</style>
