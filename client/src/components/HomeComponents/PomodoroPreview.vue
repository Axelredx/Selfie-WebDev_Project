<script setup>
import { ref, onMounted} from 'vue';
import { session } from '@/session';
import { useRouter } from 'vue-router';

const router = useRouter();
const numberTomatoes = ref(0);
const tom = ref([]);
const i = ref(1);
const props = defineProps({
    username: {
        type: String,
        required: true 
    }
});
 
const getTomatoToday = async () => {
    i.value = 1;
    try {
        const username = await session.get('/api/user').then(resp => resp.data.username);
        const res = await session.get('/api/checker/pomodoroToday', { params: { ownerPomodoro: username } });
        if (res.status !== 204) {
            numberTomatoes.value = 1;
            //console.log(res.data);
        } else {
            numberTomatoes.value = 0;
        }
    } catch (error) {
        numberTomatoes.value = 0;
        //console.error("Error fetching today's pomodoros:", error);
    }
};

const getTomatoWeek = async () => {
    i.value = 2;
    try {
        tom.value = [];
        const username = await session.get('/api/user').then(resp => resp.data.username);
        const res = await session.get('/api/checker/pomodoroThisWeek', { params: { ownerPomodoro: username } });
        numberTomatoes.value = Array.isArray(res.data) ? res.data.length : 0;
        res.data.forEach((tomato) => {
            tom.value.push(tomato);
        });
    } catch (error) {
        numberTomatoes.value = 0;
        //console.error('Error fetching this week\'s pomodoros:', error);
    }
};

const getTomatoMonth = async () => {
    i.value = 3;
    try {
        tom.value = [];
        const username = await session.get('/api/user').then(resp => resp.data.username);
        const res = await session.get('/api/checker/pomodoroThisMonth', { params: { ownerPomodoro: username } });
        numberTomatoes.value = Array.isArray(res.data) ? res.data.length : 0;
        res.data.forEach((tomato) => {
            tom.value.push(tomato);
        });
    } catch (error) {
        numberTomatoes.value = 0;
        //console.error('Error fetching this month\'s pomodoros:', error);
    }
};

const goToTomato = () => {
    router.push('/pomodoro');
};

onMounted(() => {
    getTomatoToday();
});
</script>

<template>
    <div id="pomodoro-preview">
        <div id="upper">
            <div id="p">
                <p >Check pomodoro scheduled for:</p>
            </div>
            <div id="button">
                <button @click="getTomatoToday">Today</button>
                <button @click="getTomatoWeek">This Week</button>
                <button @click="getTomatoMonth">This Month</button>
            </div>
        </div>
        <div id="lower">
            <p v-if="i === 1">Pomodoros scheduled for <strong>today</strong>: {{ numberTomatoes }}</p>
            <button v-if="i === 1 && numberTomatoes > 0" @click="goToTomato" id="go">Go to Pomodoro</button>
            <p v-else-if="i === 2">Pomodoros scheduled for this <strong>week</strong>: {{ numberTomatoes }}</p>
            <p v-else-if="i === 3">Pomodoros scheduled for this <strong>month</strong>: {{ numberTomatoes }}</p>
            <div v-if="i !== 1">
                <p v-for="t in tom" :key="t.datePomodoro">
                    <strong>Scheduled for: </strong> {{ t.datePomodoro }}
                </p>
            </div>
        </div>
    </div>
</template>

<style scoped>
#pomodoro-preview {
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

#p {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-self: center;
    height: 100%;
}

#p p {
    margin: 0; 
    font-size: 1.3em; 
    text-align: center; 
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

#go:active, #go:focus, #go:hover {
    background-color: #006600;
}

#lower {
    display: flex;
    flex-direction: column;
    align-items: center;
}

p {
    font-size: 0.95em;
    font-weight:500;
    color: #333;
}

@media screen and (min-width: 600px) {
    #upper {
        flex-direction: row;
        justify-content:space-between;  
        width: 65%;
        
    }
    
}
</style>
