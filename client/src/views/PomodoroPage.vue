<script setup>
import Navbar from '@/components/GeneralComponents/Navbar.vue';
import Pomodoro from '@/components/PomodoroComponents/Pomodoro.vue';
</script>

<template>
    <div id="pomodoro">
        <Navbar />
        <div class="pomodoro-container">
            <Pomodoro />
        </div>  
        <div id="x"></div>
    </div>
</template>

<style scoped>
#pomodoro {
    background-color: blanchedalmond;
    height: auto;
}

.pomodoro-container {
    min-width: auto;
    overflow: auto;
    height: 100vh;
    overflow-y: auto;
}

#x {
    height: 20px;
}
</style>