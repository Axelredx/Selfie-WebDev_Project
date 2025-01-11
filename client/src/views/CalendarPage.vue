<script setup>
import Navbar from '@/components/GeneralComponents/Navbar.vue';
import CalendarComponent from '@/components/CalendarComponents/CalendarComponent.vue';
import EventAdder from '@/components/CalendarComponents/EventAdder.vue';

</script>

<template>
    <Navbar />
    <div class="wrapper">
        <CalendarComponent />
        <div id="x"></div>
    </div>
</template>

<style scoped>
.wrapper {
    height: auto;
    background-color: blanchedalmond;
}

#x {
    height: 20px;
}
</style>

