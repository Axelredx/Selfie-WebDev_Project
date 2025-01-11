<script setup>
import { RouterLink, RouterView } from 'vue-router';
import { useRouter } from "vue-router";
import {signOut, session} from "@/session";

const router = useRouter();

const signOutAndRefresh = async () => {
    await signOut();
    router.push("/signin");
}

const goToTmachine = () => {
    router.push("/tmachine");
}

</script>

<template>
    <header>
        <nav>
            <RouterLink to="/" class="item">
                <img src="../icons/house.svg"> Home
            </RouterLink>
            <RouterLink to="/calendar" class="item">
                <img src="../icons/calendar.svg"> Calendar
            </RouterLink>
            <RouterLink to="/note" class="item">
                <img src="../icons/note.svg"> Note
            </RouterLink>
            <RouterLink to="/pomodoro" class="item">
                <img src="../icons/timer.svg"> Pomodoro
            </RouterLink>
        </nav>
        <div class="left">
            <button @click="goToTmachine">
                <img src="../icons/hourglass.svg"> Machine
            </button>
            <button @click="signOutAndRefresh()">
                <img src="../icons/door.svg"> SignOut
            </button>
        </div>
        <RouterView />
    </header>
</template>

<style scoped>
    header {
        width: 100%;
        height: 20%;
        background-color: orange;/* #d0d0d0;*/
        margin-bottom: 0px;
        border-bottom: solid 1px rgb(255, 119, 0) ;/*#b2b1b1da;*/
        display: flex;
        justify-content: space-between;
    }

    nav {
        height: 100%;
        width: 80%;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .item {
        margin: 5px;
        height: 60%;
        /*border: solid 1px #000;*/
        font-size: 1em;
        font-weight: bold;


    }

    a {
        text-decoration: none;
        color: #000;
    }

    a:hover {
        color: #007bff;
    }

    button {
        margin: 5px;
        height: 25px;
        width: 100px;
        font-size: 1em;
        font-weight: bold;
        background-color: black;
        color: #fff;
        border: none;
        border-radius: 5px;
    }

    @media screen and (max-width: 600px) {
        header {
            flex-direction: column;
        }
    }
</style>