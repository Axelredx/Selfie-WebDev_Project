<script setup>
import Navbar from '@/components/GeneralComponents/Navbar.vue';
import NoteCreator from '@/components/NoteComponents/NoteCreator.vue';
import NoteDisplayer from '@/components/NoteComponents/NoteDisplayer.vue';

</script>

<template>
    <div id="note">
        <Navbar />
        <div id="wrapper">
            <NoteCreator />
            <NoteDisplayer />        
        </div>
        <div id="x"></div>
    </div>
</template>

<style scoped>
#note {
    background-color: blanchedalmond;
}

#x {
    height: 20px;
}

#wrapper {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    height: 93vh;
    min-width: auto;
    overflow: auto;
    width: 100%;
    margin-top: 5px;
}

@media screen and (max-width: 600px) {
    #wrapper {
        flex-direction: column;
    }  
}

</style>