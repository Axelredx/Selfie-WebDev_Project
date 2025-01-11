<script setup>
import { ref, onMounted } from 'vue';
import { session } from "@/session";
import { useRouter } from "vue-router";

const router = useRouter();
const currentTime = ref('');
const futureDate = ref('');

const fetchCurrentTime = async () => {
    try {
        const response = await session.get('/api/timeMachine');
        const timeFromServer = new Date(response.data.time);
        currentTime.value = timeFromServer.toLocaleString();
        //console.log('Current time fetched: ', currentTime.value);
    } catch (error) {
        //console.error('Error fetching current time:', error);
    }
};

const setFutureDate = async () => {
    try {
        const newDate = new Date(futureDate.value);
        if (isNaN(newDate.getTime())) {
            //console.error('Invalid date entered');
            return;
        }

        const formattedDate = newDate.toISOString();  // Converti la data in formato ISO
        const response = await session.post('/api/timeMachine/setClock', { date: formattedDate });
        if (response.status === 200) {
            //console.log('Future date set: ', newDate.toLocaleString());
            fetchCurrentTime();
        } else {
            throw new Error('Failed to set future date: ' + response.statusText);
        }
    } catch (error) {
        //console.error('Error setting future date:', error.message);
    }
};

const resetDate = async () => {
    try {
        const response = await session.post('/api/timeMachine/resetClock');
        if (response.status === 200) {
            const timeFromServer = new Date(response.data.time);  // Converti la stringa ISO in un oggetto Date
            currentTime.value = timeFromServer.toLocaleString();
            //console.log('Time reset: ', currentTime.value);
            fetchCurrentTime();
            getTimemachine();
        } else {
            throw new Error('Failed to reset date');
        }
    } catch (error) {
        //console.error('Error resetting date:', error.message);
    }
};


const getBack = () => {
    router.push('/');
};

const getTimemachine = () => {
    router.push('/tmachine');
};

onMounted(fetchCurrentTime);
</script>


<template>
    <div class="page">
        <div class="machine">
            <h1>Time Machine</h1>
            <p class="current-time">Current Time: <span>{{ currentTime }}</span></p>
            <h5>Select Future Date and Time</h5>
            <input type="datetime-local" v-model="futureDate" class="datetime-input" />
            <div class="button-group">
                <button @click="setFutureDate" class="btn set-btn">Set</button>
                <button @click="resetDate" class="btn reset-btn">Reset</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.page {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    height: auto;
    /*background: linear-gradient(to bottom, #f8f9fa, #e9ecef);*/
    background-image: url('../../assets/time.jpg');
    background-position: center;
    background-repeat:repeat;
    background-size: 25%;
}

.machine {
    background: #fff;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    max-width: 400px;
    width: 90%;
    text-align: center;
}

h1 {
    margin-bottom: 20px;
    font-size: 1.8rem;
    color: #007bff;
    text-shadow: 1px 1px 1px rgba(0, 123, 255, 0.2);
}

.current-time {
    margin-bottom: 20px;
    font-size: 1.1rem;
    color: #333;
}

.current-time span {
    font-weight: bold;
    color: #007bff;
}

.datetime-input {
    margin-bottom: 20px;
    padding: 10px;
    font-size: 1rem;
    border: 1px solid #ced4da;
    border-radius: 5px;
    width: 100%;
    box-sizing: border-box;
}

.datetime-input:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.button-group {
    display: flex;
    justify-content: space-between;
    gap: 10px;
}

.btn {
    flex: 1;
    padding: 10px 15px;
    font-size: 1rem;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.set-btn {
    background-color: #28a745;
}

.set-btn:hover {
    background-color: #218838;
}

.reset-btn {
    background-color: #eeb711;
}

.reset-btn:hover {
    background-color: #e0a800;
}

@media (max-width: 500px) {
    .machine {
        padding: 15px;
    }

    h1 {
        font-size: 1.5rem;
    }

    .datetime-input {
        font-size: 0.9rem;
    }

    .btn {
        font-size: 0.9rem;
    }
}
</style>
