<script setup>
import { ref, onMounted} from 'vue';
import { useRouter } from 'vue-router';
import { session } from '@/session';
import { marked } from 'marked';

const notes = ref([]);
const router = useRouter();
const noteContent = ref("");

const GetByDate = async () => {
    const username = await session.get('/api/user').then(resp => resp.data.username);
    session.get('/api/note/all/sortedByDate', {username: username}).then(resp => {
        notes.value = resp.data;
        notes.value = notes.value.reverse();
        if(notes.value.length == 0){
            notes.value = [];
            return;
        }
        for(let i=0; i<notes.value.length; i++){
            notes.value[i].date = new Date(notes.value[i].date);
            const lastUp = new Date(notes.value[i].lastUpdate);
            notes.value[i].lastUpdate = lastUp.toLocaleString();
        }
        textMarked();
        //console.log("Got notes by date!");
    }).catch(error => {
        //console.error('Error fetching notes:', error);
    });
}

const GetByCategory = async () => {
    const username = await session.get('/api/user').then(resp => resp.data.username);
    session.get('/api/note/all/sortedByCategory', {username: username}).then(resp => {
        notes.value = resp.data;
        if(notes.value.length == 0){
            notes.value = [];
            return;
        }
        for(let i=0; i<notes.value.length; i++){
            notes.value[i].date = new Date(notes.value[i].date);
            const lastUp = new Date(notes.value[i].lastUpdate);
            notes.value[i].lastUpdate = lastUp.toLocaleString();
        }
        textMarked();
        //console.log("Got notes by category!");
    }).catch(error => {
        //console.error('Error fetching notes:', error);
    });
}

const GetByTextLenght = async () => {
    const username = await session.get('/api/user').then(resp => resp.data.username);
    session.get('/api/note/all/sortedByTextLenght', {username: username}).then(resp => {
        notes.value = resp.data;
        if(notes.value.length == 0){
            notes.value = [];
            return;
        }
        for(let i=0; i<notes.value.length; i++){
            notes.value[i].date = new Date(notes.value[i].date);
            const lastUp = new Date(notes.value[i].lastUpdate);
            notes.value[i].lastUpdate = lastUp.toLocaleString();
        }
        textMarked();
        //console.log("Got notes by text length!");
    }).catch(error => {
        //console.error('Error fetching notes:', error);
    });
}

const textMarked = () => {
    if (notes.value.length > 0) {
        for (let i = 0; i < notes.value.length; i++) {
            notes.value[i].content = marked(notes.value[i].content);
            if (i == 0) {
                noteContent.value = notes.value[i].content;
            }
        }
    }
}

const goToNotes = () => {
    router.push('/note');
};

onMounted(() => {
    GetByDate();
});

</script>

<template>
    <div id="note-preview">
        <div class="note-preview-header">
            <h2>Last Note written: </h2>
            <div class="note-preview-header-buttons">
                <button @click="GetByDate()">By Date</button>
                <button @click="GetByCategory()">By Category</button>
                <button @click="GetByTextLenght()">By Text Lenght</button>
            </div>
        </div>
        <div class="note-preview-content">
            <div v-if="notes.length == 0" class="note-preview-note">
                <h3>No notes yet written!</h3>
            </div>
            <div v-else class="note-preview-note">
                <h3>{{ notes[0].title }}</h3>
                <p v-html="noteContent"></p>
                <p><strong>Last updated: </strong> {{ notes[0].lastUpdate }}</p>
                <button @click="goToNotes()" id="go">Go to Notes</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
#note-preview {
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

.note-preview-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 15px;
    border-bottom: 1px solid black;
    width: 100%;
    padding-bottom: 10px;
}

.note-preview-header h2 {
    margin: 0;
    font-size: 1.5em;
    color: #333;
    text-align: center;
}

.note-preview-header-buttons {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: 10px;
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

#go {
    background-color: #0c8b00;
}   

#go:active, #go:focus, #go:hover {
    background-color: #006600;
}

button:hover {
    background-color: #138496;
}

.note-preview-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
}

.note-preview-note {
    text-align: center;
    margin-top: 10px;
}

.note-preview-note h3 {
    font-size: 1.3em;
    font-weight: bold;
    color: #333;
    margin-bottom: 5px;
}

.note-preview-note p {
    font-size: 0.95em;
    font-weight: 500;
    color: #333;
}

@media screen and (min-width: 600px) {
    .note-preview-header {
        flex-direction: row;
        justify-content: space-between;
        width: 65%;
    }
}
</style>
