<script setup>
import { reactive, ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router';
import * as session from "@/session"

const router = useRouter();
const error = ref('');
const state = reactive({
    username: "",
    password: ""
})

const onSubmit = async (username, password) => {
    let res = await session.signIn(username, password);
    if (res == undefined){
        error.value = "WARNING: An error occurred during the login process, try later!";          
    } else {
        res == 200 ? router.push("/") : error.value = `ops, error: ${res}, wrong password and/or username!`;
    }
}

</script>

<template>
    <div id="signin">
        <div id="wrapper">
            <h1>Welcome back to Selfie!</h1>
            <h6>Log to the app with the form down below :)</h6>    
            <form @submit.prevent="async () => {                
                await onSubmit(state.username, state.password);
            }" id="form">
                <h5>Username:</h5>
                <input v-model="state.username" required>
                <h5>Password:</h5>
                <input v-model="state.password" type="password" required>
                <button type="submit">Submit!</button>
            </form>
            <p id="error"> {{ error }} </p>
            <p id="goto">Not registered yet? <RouterLink to="/signup" id="signup">Click Here!</RouterLink></p>
        </div>
    </div>
</template>

<style scoped>
#signin {
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

#signup {
    color: #007bff;
}

#signup:hover {
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