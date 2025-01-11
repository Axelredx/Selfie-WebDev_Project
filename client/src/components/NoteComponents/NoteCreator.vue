<script setup>
import { marked } from 'marked';
import { session } from '@/session';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const username = ref("");
const title = ref("");
const category = ref("");
const txt = ref("");
const markedText = ref("");

session.get("/api/user").then(resp => {
    username.value = resp.data.username;
}).catch(error => {
    //console.error('Error fetching username:', error);
});

const createNote = () => {
    session.post('/api/note', {
        owner: username.value, 
        title: title.value, 
        category: category.value, 
        content: txt.value
    })
    .then(() => {
        title.value = "";
        category.value = "";
        txt.value = "";
        markedText.value = "";
        //console.log('Note created!');
    }).catch(error => {
        //console.error('Error creating note:', error);
    });
}

const renderMarked = () => {
    markedText.value = marked(txt.value);
}
</script>

<template>
    <div id="NoteCreator">
        <h1>Create a new note! <img src="../icons/pencil.svg" /></h1>
        <form @submit.prevent="createNote">
            <div class="mb-3">
                <label for="title">Title:</label>
                <input type="text" id="title" required class="form-control" placeholder="Cool title" v-model="title">
            </div>
            <div class="mb-3">
                <label for="category">Category:</label>
                <input type="text" id="category" required class="form-control" placeholder="Cool Category" v-model="category">
            </div>
            <div class="mb-3">
                <label for="content">Content:</label>
                <textarea id="content" required class="form-control" rows="3" placeholder="Cool text" v-model="txt"></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Create!</button>
        </form>
        <div id="MarkedDiv">
            <button class="btn btn-primary" @click="renderMarked" id="btn-render">Try see marked text!</button>
            <div v-html="markedText" id="rendering"></div>
        </div>
    </div>
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
    width:90%;
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