<script setup>
import { marked } from 'marked';
import { session } from '@/session';
import { onMounted, onUnmounted, ref } from 'vue';

const username = ref("");
const notes = ref([]);
const full = ref(false);
const showEditDialog = ref(false);
const editedNote = ref({});
const i = ref(0);
let fetchInterval = null;

session.get("/api/user").then(resp => {
    username.value = resp.data.username;
}).catch(error => {
    //console.error('Error fetching username:', error);
});

session.get('/api/note/all').then((resp) => {
    i.value = 0;
    if (resp.data.length == 0) {
        notes.value = [];
    } else {
        notes.value = resp.data;
        textMarked();
        for(let i=0; i<notes.value.length; i++){
            notes.value[i].date = new Date(notes.value[i].date);
            const lastUp = new Date(notes.value[i].lastUpdate);
            notes.value[i].lastUpdate = lastUp.toLocaleString();
        }
    }
}).catch(error => {
    //console.error('Error loocking for notes:', error);
});

const FetchNewNotes = ()=> {
    session.get('/api/note/all').then((resp) => {
        i.value = 0;
        if (resp.data.length == 0) {
            notes.value = [];
        } else {
            notes.value = resp.data;
            textMarked();
            for(let i=0; i<notes.value.length; i++){
                notes.value[i].date = new Date(notes.value[i].date);
                const lastUp = new Date(notes.value[i].lastUpdate);
                notes.value[i].lastUpdate = lastUp.toLocaleString();
            }
            //console.log('Notes fetched!');
        }
    }).catch(error => {
        //console.error('Error fetching notes:', error);
    });
}

const textMarked = () => {
    if (notes.value.length > 0) {
        for (let i = 0; i < notes.value.length; i++) {
            notes.value[i].content = marked(notes.value[i].content);
        }
    }
}

const GetSortedByDate = () => {
    session.get('/api/note/all/sortedByDate').then(resp => {
        i.value = 1;
        notes.value = resp.data;
        for(let i=0; i<notes.value.length; i++){
            notes.value[i].date = new Date(notes.value[i].date);
            const lastUp = new Date(notes.value[i].lastUpdate);
            notes.value[i].lastUpdate = lastUp.toLocaleString();
        }
        //console.log("Sorted by date!");
    }).catch(error => {
        //console.error('Error fetching notes:', error);
    });
}

const GetSortedByCategory = () => {
    session.get('/api/note/all/sortedByCategory').then(resp => {
        i.value = 2;
        notes.value = resp.data;
        for(let i=0; i<notes.value.length; i++){
            notes.value[i].date = new Date(notes.value[i].date);
            const lastUp = new Date(notes.value[i].lastUpdate);
            notes.value[i].lastUpdate = lastUp.toLocaleString();
        }
        //console.log("Sorted by category!");
    }).catch(error => {
        //console.error('Error fetching notes:', error);
    });
}

const GetSortedByTextLenght = () => {
    session.get('/api/note/all/sortedByTextLenght').then(resp => {
        i.value = 3;
        notes.value = resp.data;
        for(let i=0; i<notes.value.length; i++){
            notes.value[i].date = new Date(notes.value[i].date);
            const lastUp = new Date(notes.value[i].lastUpdate);
            notes.value[i].lastUpdate = lastUp.toLocaleString();
        }
        //console.log("Sorted by text length!");
    }).catch(error => {
        //console.error('Error fetching notes:', error);
    });
}

const deleteNote = (content, date) => {
    session.delete(`/api/note`, { data: { owner: username.value, date: date } }).then(() => {
        notes.value = notes.value.filter(note => note.content !== content);
        //console.log('Note deleted!');
    }).catch(error => {
        //console.error('Error deleting note:', error);
    });
}

const deleteAllNotes = () => {
    session.delete(`/api/note/all`, { data: { owner: username.value } }).then(() => {
        notes.value = [];
        //console.log('All notes deleted!');
    }).catch(error => {
        //console.error('Error fetching all notes:', error);
    });
}

const switchContent = () => {
    full.value = !full.value;
}

const openEditDialog = (note) => {
    let tmp = note;
    // check if in markdown to prevent seeing in dialog
    const markdownRegex = /(\*\*|__|# |\* |_|\n- )/;
    const hasMarkdown = markdownRegex.test(tmp.content);
    // Remove HTML tags from content (keeping markdown)
    if (!hasMarkdown) {
        // remove all tag
        tmp.content = marked(tmp.content).replace(/<[^>]*>/g, ''); 
    }
    showEditDialog.value = true;
    editedNote.value = { ...tmp };
};

const closeEditDialog = () => {
    showEditDialog.value = false;
};

const updateNote = () => {
    session.put('/api/note', {
        username: username.value,
        title: editedNote.value.title,
        category: editedNote.value.category,
        content: editedNote.value.content,
        date: editedNote.value.date
    }).then(() => {
        FetchNewNotes();
        closeEditDialog();
    }).catch(error => {
        //console.error('Error updating note:', error);
    });
};

onMounted(() => {
    // auto fetch every 10 seconds
    fetchInterval = setInterval(() => {
        if (i.value === 0) {
            FetchNewNotes();
        } else if (i.value === 1) {
            GetSortedByDate();
        } else if (i.value === 2) {
            GetSortedByCategory();
        } else if (i.value === 3) {
            GetSortedByTextLength();
        }
    }, 10000);
});

onUnmounted(() => {
    // Canc interval when component is unmounted
    if (fetchInterval) {
        clearInterval(fetchInterval);
        fetchInterval = null;
    }
});
</script>

<template>
    <div id="NoteDisplayer">
        <h1>Notes of {{ username }}: </h1>
        <div id="Buttons">
            <button @click="FetchNewNotes()" id="fetch">Fetch for New Notes!</button>
            <button @click="GetSortedByDate()" id="sort">Sort by Date</button>
            <button @click="GetSortedByCategory()" id="sort">Sort by Category</button>
            <button @click="GetSortedByTextLenght()" id="sort">Sort by Text Length</button>
            <button @click="deleteAllNotes()" id="del">Delete all notes</button>
        </div>
        <div id="WrapperNoteContainer">
            <div v-for="note in notes" :key="note.content" id="WrapperNote">
                <div id="t_c_d">
                    <div id="t_c">
                        <h4><strong>Title: </strong> {{ note.title }}</h4>
                        <h6><strong>Category: </strong> {{ note.category }}</h6>
                    </div>
                    <div id="t_c">
                        <h6><strong>Last update: </strong> {{ note.lastUpdate }}</h6>
                    </div>
                </div>
                <div id="txtWrapper">
                    <p v-if="!full" v-html="note.trimmedContent"></p>
                    <p v-else v-html="note.content"></p>
                </div>
                <div id="ButtonsN">
                    <button @click="switchContent()">See/Hide full content or show marked!</button>
                    <button @click="openEditDialog(note)" id="editN">Modify</button>
                    <button @click="deleteNote(note.content, note.date)" id="del">Delete</button>
                </div>
            </div>
        </div>
        <div v-if="showEditDialog" id="editDialog">
            <h2>Edit Note</h2>
            <label>Title: <input v-model="editedNote.title" /></label>
            <label>Category: <input v-model="editedNote.category" /></label>
            <label>Content: <textarea v-model="editedNote.content"></textarea></label>
            <button @click="updateNote()">Save</button>
            <button @click="closeEditDialog()">Cancel</button>
        </div>
    </div>
</template>


<style scoped>
#NoteDisplayer {
    width: 50%;
    height: 80vh; 
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start; 
    margin-top: 5px;
    padding: 20px;
    border: 1px solid black;
    border-radius: 10px;
    background-color: #f9f9f9;
}

#Buttons {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    margin: 5px 0;
    position: sticky; 
    top: 0;
    background-color: #f9f9f9;
    z-index: 1; 
    border-bottom: 1px solid black;
}

#ButtonsN {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    margin: 5px 0;
    position: sticky; 
    top: 0;
    z-index: 1; 
}

#WrapperNoteContainer {
    width: 100%;
    height: calc(80vh - 100px); 
    overflow-y: auto; 
    padding: 10px 0;
}

#t_c_d, #t_c {
    display: flex;
    align-items: center;
}

#t_c_d {
    justify-content: space-between;
    width: 98%;
    height: auto;
}

#t_c {
    width: 50%;
    height: auto;
    flex-direction: column;
    margin-right: 20px;
}

#WrapperNote {
    width: 100%;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ddd;
    border-radius: 5px;
    background-color: #fff;
}

button {
    padding: 5px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin: 5px;
}

#sort {
    background-color: #17a2b8;
}

#sort:hover {
    background-color: #138496;
}

#fetch {
    background-color: #0c8b00;
}

#fetch:hover {
    background-color: #006600;
}

button:hover {
    background-color: #0056b3;
}

#del {
    background-color: #dc3545;
    margin-left: 10px;
}

#del:hover {
    background-color: #c82333;
}

h1, h2, h3, h4 {
    margin: 5px 0;
}

h1 {
    border-bottom: 1px solid black;
    width: 100%;
    text-align: center;
}

#txtWrapper {
    width: 98%;
    height: auto;
    border: 1px solid #ddd;
}

p {
    margin: 3px;
}

#editN {
    background-color: #ffc107;
}

#editN:hover {
    background-color: #e0a800;
}

#editDialog {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 20px;
    border: 1px solid #ccc;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 1000;
}

#editDialog label {
    display: block;
    margin: 10px 0;
}

@media screen and (max-width: 600px) {
    #NoteDisplayer {
        margin: 5px;
        width: 90%;
    }  
}
</style>
