<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { session } from '@/session';

const events = ref([]);
const router = useRouter();

const GetEvents = async () => {
    try {
        const username = await session.get('/api/user').then(resp => resp.data.username);
        const response = await session.get(`/api/event/getEventsTodayServer`, {
            params: { owner: username }, 
        });

        events.value = response.data;
        if (!events.value || events.value.length === 0) {
            events.value = [];
            //console.log("No events today!");
            return;
        }

        for (let i = 0; i < events.value.length; i++) {
            const event = events.value[i];
            if (event.start === event.end) {
                event.start = new Date(event.start).toISOString().split('T')[0];
            } else {
                event.start = new Date(event.start).toLocaleTimeString();
                event.end = new Date(event.end).toLocaleTimeString();
            }
        }

        //console.log("Got events!");
    } catch (error) {
        //console.error("Error fetching events:", error);
    }
};


const goToCalendar = () => {
    router.push('/calendar');
}

onMounted(() => {
    GetEvents();
});
</script>

<template>
    <div id="calendar-preview">
        <div class="calendar-preview-header" id="upper">
            <h2>Events & Activities of Today:</h2>
            <div class="note-preview-header-buttons" id="button">
                <button @click="GetEvents()">Refresh</button>
            </div>
        </div>
        <div class="calendar-preview-content" id="lower">
            <div v-if="events.length == 0" class="calendar-preview-calendar" id="p">
                <h3>No events nor activities for today!</h3>
            </div>
            <div v-else class="calendar-preview-calendar" id="p">
                <div v-for="event in events" :key="event._id" class="calendar-preview-event card">
                    <div class="card-header" :class="event.groupId !== 'deafult_server_DontUseThisNamePls_activity' ? 'event' : 'activity'">
                        <h3>{{ event.groupId !== 'deafult_server_DontUseThisNamePls_activity' ? 'Event' : 'Activity' }}</h3>
                    </div>
                    <div class="card-body">
                        <p><strong>Title: </strong> {{ event.title }}</p>
                        <p v-if="event.allDay == true"><strong>When: </strong> All Day!</p>
                        <div v-else>
                            <p><strong>Start: </strong> {{ event.start }}</p>
                            <p><strong>End: </strong> {{ event.end }}</p>
                        </div>
                    </div>
                </div>
                <div class="calendar-button-container">
                    <button @click="goToCalendar()" id="go">See in Calendar</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
#calendar-preview {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #f9f9f9;
    max-width: 90%;
    width: 90%;
    margin: 10px auto;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

#upper {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 15px;
    border-bottom: 1px solid black;
}

#button {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.card {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 500px;
    margin: 15px 0;
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: width 0.3s;
}

.card-header {
    padding: 10px;
    border-bottom: 1px solid #ddd;
    text-align: center;
    font-size: 1.2em;
    font-weight: bold;
}

.card-header.event {
    color: #0210cf;
}

.card-header.activity {
    color: #db0101;
}

.card-body {
    padding: 10px;
}

.card-body p {
    margin: 5px 0;
    font-size: 1em;
}

button {
    margin: 5px;
    padding: 10px 15px;
    font-size: 1em;
    font-weight: bold;
    color: #fff;
    background-color: #17a2b8;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
}

button:hover {
    background-color: #138496;
}

#go {
    background-color: #0c8b00;
}

#go:active,
#go:focus,
#go:hover {
    background-color: #006600;
}

.calendar-button-container {
    display: flex;
    justify-content: center;
    margin-top: 15px;
}

@media screen and (min-width: 600px) {
    #upper {
        flex-direction: row;
        justify-content: space-between;
        width: 65%;
    }
    .card {
        max-width: 700px;
    }
}
</style>
