<script setup>
import { ref, onMounted} from 'vue';
import { session } from "@/session";
import { useRouter } from "vue-router";
import Navbar from '@/components/GeneralComponents/Navbar.vue';
import TimeMachine from '@/components/GeneralComponents/TimeMachine.vue';
</script>

<template>
    <Navbar />
    <TimeMachine />
</template>

<style scoped>
</style>