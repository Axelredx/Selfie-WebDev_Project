<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from "vue-router";
import {signOut, session} from "@/session";
import Navbar from '@/components/GeneralComponents/Navbar.vue';
import PomodoroPreview from '@/components/HomeComponents/PomodoroPreview.vue';
import NotePreview from '@/components/HomeComponents/NotePreview.vue';
import CalendarPreview from '@/components/HomeComponents/CalendarPreview.vue';

const username = ref("");
const getUsername = () => {
    session.get("/api/user").then(resp => {
        username.value = resp.data.username;
    }).catch(error => {
        //console.error('Error fetching username:', error);
    });
};
onMounted(getUsername);

</script>

<template>
    <Navbar />
    <div id="home">
        <h1>Welcome, {{ username }}!</h1>
        <div id="p">
            <h5>Your activity:</h5>
        </div>
        <CalendarPreview />
        <NotePreview />
        <PomodoroPreview :username="username"/>
        <div id="x"></div>
    </div>
</template>

<style scoped>
    h1 {
        margin: 0;
        padding: 0;
        text-align: center;
        font-weight: bold;
        margin: 1px;
    }

    #home {
        min-height: 98vh;
        height: auto;
        background-color: blanchedalmond;
    }

    #p {
        display: flex;
        width: 90%;
        margin: 10px;
        margin-left: 10%;
    }

    #x {
        height: 20px;
    }
</style>