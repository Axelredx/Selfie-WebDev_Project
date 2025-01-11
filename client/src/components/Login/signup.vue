<script setup>
import { reactive, ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router';
import * as session from "@/session"

const router = useRouter();
const error = ref('');
const state = reactive({
    name: "",
    username: "",
    email: "",
    password: ""
})

const onSubmit = async (name, username, email, password) => {
    let res = await session.signUp(name, username, email, password);
    if (res == undefined){
        error.value = "WARNING: An error occurred during the login process, try later!";          
    } else {
        res == 200 ? router.push("/") : error.value = `Ops, error: ${res}, username, password and/or email not allowed!`;
    }
}

</script>

<template>
    <div id="signup">
        <div id="wrapper">
            <h1>Welcome to Selfie!</h1>
            <h6>Register to the app with the form down below :)</h6>
            <form @submit.prevent="async () => {                
                await onSubmit(state.name, state.username, state.email, state.password);
            }" id="form">
                <h5>Name:</h5>
                <input v-model="state.name" required>
                <h5>Username (unique!):</h5>
                <input v-model="state.username" required>
                <h5>Email:</h5>
                <input v-model="state.email" required>
                <h5>Password (at least 8 char):</h5>
                <input v-model="state.password" required>
                <button type="submit">Submit!</button>
            </form>
            <p id="error"> {{ error }} </p>
            <p id="goto">Already regitered? <RouterLink to="/signin" id="signin">Click Here!</RouterLink></p>
        </div>
    </div>
</template>

<style scoped>
#signup {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100vw;
    background-image: url('/PubImage.png');
    background-position: center;
    background-repeat:repeat;
    background-size: 25%;
}

#wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px solid black;
    background-color: blanchedalmond;
    padding: 20px;
    border-radius: 10px;
}

h1 {
    border-bottom: 1px solid black;
}

form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}


input {
    margin: 5px;
    width: 200px;
    height: 30px;
    border-radius: 5px;
    border: 1px solid black;
    background-color: azure;
}

button {
    margin: 5px;
    font-size: 1em;
    font-weight: bold;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
}

button:hover {
    background-color: black;
}

a {
    text-decoration: none;
    color:#fff;
}

#signin {
    color: #007bff;
}

#signin:hover {
    color: #858585;
}

h6, h5 {
    font-weight: 400;
    margin: 2px;
}

#goto {
    border-top: 1px solid black;
}

#error {
    color: red;
}
</style>