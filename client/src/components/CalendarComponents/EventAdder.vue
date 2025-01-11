<script setup>
import { session } from '@/session';
import { onMounted, ref } from 'vue';
import EventCard from './EventCard.vue'


const props = defineProps(['showDialog']);
const today = defineModel('today');
const Event = defineModel('Event');
const onModify = defineModel('onModify');
const username = ref("");

const Data = ref({
  Event: Event,
  username: username,
  onModify: onModify,
  today: today,
});

const emit = defineEmits(['addEvent', 'handleCloseDialog']);

session.get("/api/user").then(resp => {
  username.value = resp.data.username;
  Event.value.owner = username.value;
}).catch(error => {
  //console.error('Error fetching username in Event Adder:', error);
});

const createEvent = () => {
  if (Event.value.rrule && Event.value.rrule.freq == "YEARLY") {
    Event.value.rrule = {
      freq: "YEARLY",
      until: Event.value.rrule.until,
      count: Event.value.rrule.count,
      dtstart: Event.value.rrule.dtstart,
    }
    //console.log("ho messo la rrule a " + Event.value.rrule);
  }
  Event.value.owner = username.value;
  Event.value._id = null;
  //console.log("in createEvent", Event.value);
  if (Event.value.groupId == "deafult_server_DontUseThisNamePls_activity") {
    Event.value._deadline = Event.value.end;
    //console.log("ho messo la deadline a " + Event.value._deadline);
  }
  ////console.log("in createEvent", Event.value);
  session.post("/api/event", Event.value).then(resp => {
    getAllEvents();
  }).catch(error => {
    //console.error('Error creating event:', error);
  });
  resetValues();

}

const getAllEvents = async () => {
  try {
    // Ottieni l'username dell'utente
    const username = await session.get('/api/user').then(resp => resp.data.username);

    // Effettua le chiamate API in parallelo
    const [eventsResponse, pomodorosResponse] = await Promise.all([
      session.get("/api/event/all"),
      session.get("/api/pomodoro/all", { params: { ownerPomodoro: username } })
    ]);

    // Dati delle API
    const events = eventsResponse.data || [];
    const pomodoros = pomodorosResponse.data || [];

    // Combina gli eventi con i pomodori trasformati
    const list = [
      ...events, // Aggiungi gli eventi così come sono
      ...pomodoros.map(pomodoro => createPomodoroEvent(pomodoro.datePomodoro, pomodoro.cycles)) // Trasforma i pomodori in eventi
    ];

    // Log e invio degli eventi combinati
    //console.log("Events and Pomodoros fetched!", list);
    emit('addEvent', list); // Emetti gli eventi combinati

  } catch (error) {
    //console.error("Error fetching events or pomodoros:", error);

    // Emetti una lista vuota in caso di errore
    emit('addEvent', []);
  }
};



const testTodaysEvents = () => {
  const OBJ = {
    owner: username.value,
    date: null,
  }
  session.post("/api/event/getdate", OBJ).then(resp => {
    //console.log(resp.data);
  }).catch(error => {
    //console.error('Error fetching events:', error);
  });
}

const handleCloseDialog = (value) => {
  emit('handleCloseDialog', value);
};

const resetValues = () => {
  Event.value = {};
  Event.value.owner = username.value;
};


const handleDeleteEvent = (reset) => {
  Event.value.owner = username.value;
  //console.log("in handleDeleteEvent", Event.value);
  session.post("/api/event/delete", Event.value).then(resp => {
    handleCloseDialog(true);
    if (reset) {
      resetValues();
    }
    getAllEvents();
  }).catch(error => {
    //console.error('Error fetching events:', error);
  });

};


const handleDeletePomodoro = async (pomodoro) => {
  //console.log("in handleDeletePomo", pomodoro);
  const body = {
    ownerPomodoro: username.value,
    ...pomodoro,
  };
  //console.log("in handleDeletePomo", body);
  session.post('/api/pomodoro/deleteGivenDate',body ).then(resp => {
    handleCloseDialog(true);
    resetValues();
    getAllEvents();
  }).catch(error => {
    //console.error('Error fetching events:', error);
  });
};

const handleAddPomodoro = async (pomodoroData) => {
  //console.log("in handleAddPomodoro", pomodoroData);

  try {
    const user = await session.get('/api/user').then(resp => resp.data.username);

    // Crea il body combinando username e pomodoroData
    const body = {
      ownerPomodoro: user,
      ...pomodoroData,
    };

    await session.post("/api/pomodoro/givenDate", body);
    
    // Aggiorna gli eventi
    getAllEvents();
  } catch (error) {
    //console.error('Error adding pomodoro:', error);
  }
};

const sanity_check = () => {
  if (Event.value.start > Event.value.end) {
    Event.value.end = new Date(new Date(Event.value.start).getTime() + 60 * 1000); // Imposta end a 1 minuto dopo start
    return false;
  }
  if (Event.value.rrule && Event.value.rrule.until < Event.value.start) {
    Event.value.rrule.until = new Date(new Date(Event.value.start).getTime() + 60 * 1000); // Imposta until a 1 minuto dopo start
    return false;
  }
  return true; // La funzione restituisce true solo se tutto è corretto (probabilmente non verrà utilizzato)
};

const handleObtainData = (onMod) => {
  sanity_check();

  if (onMod) {
    //console.log('stiamo per entrare in handleModifyEvent');
    handleModifyEvent();
  } else {
    createEvent();
  }
  handleCloseDialog(true);
  resetValues();
}

const handleModifyEvent = () => {
  Event.value.owner = username.value;


  //console.log("in handleModifyEvent", Event.value);
  handleDeleteEvent(false);

  createEvent();
  resetValues();

}

const createPomodoroEvent = (date, cycles) => {
  const tmp = `Pomodoro for ${cycles} cycles`;
  let tempevent = {...Event.value};

  tempevent.title = tmp;
  tempevent.start = date; 
  tempevent.end = date;
  tempevent.allDay = true;
  tempevent.rrule = null;
  tempevent.groupId = 'default_server_DontUseThisNamePls_Pomodoro';
  tempevent.color = '#00ff00';
  tempevent.extendedProps = {
    _id: null,
    _deadline: null,
  }

 return tempevent;
}

onMounted(getAllEvents);

</script>



<template>
  <!--<button @click="getAllEvents">Refresh</button>
  <button @click="testTodaysEvents">get today's events!</button>
  <h2>{{ onModify }}</h2> -->
  <EventCard v-if="showDialog" @handleCloseDialog="handleCloseDialog" @deleteEvent="handleDeleteEvent"
    @dataObtained="handleObtainData" @addPomodoro="handleAddPomodoro" @deletePomodoro="handleDeletePomodoro" v-model:Data="Data" />
</template>



<style scoped>
#NoteCreator {
  height: auto;
  width: 40%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 5px;
  border: 1px solid black;
  border-radius: 10px;
  background-color: #e6e6fa;
}

form {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 5px;
  /*border: 1px solid black;*/
}

.mb-3 {
  margin: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

h1 {
  border-bottom: 1px solid black;
  margin: 2px;
}

#MarkedDiv {
  border-top: 1px solid black;
  width: 90%;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  margin: 5px;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;

}

#rendering {
  background-color: white;
  width: 90%;
  min-height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 5px;
  /*border: 1px solid black;*/
  overflow-y: auto;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
  border-radius: 5px;
}

#btn-render {
  margin: 10px;
  background-color: darkorange;
  border-color: darkorange;
  width: 50%;
}

#btn-render:hover {
  background-color: chocolate;
  border-color: chocolate;
}

label {
  font-weight: bold;
  font-size: 0.8em;
}

@media screen and (max-width: 600px) {
  #NoteCreator {
    width: 90%;
  }
}
</style>