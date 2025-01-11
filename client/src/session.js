import axios from "axios";

export const session = axios.create({ 
    // Ensures cookies are sent with requests
    withCredentials: true,  
    // The base URL for all requests.
    baseURL: "http://localhost:8000",  
    headers: {
        // Specifies that the content type is JSON for all requests.
        'Content-Type': 'application/json',  
        // Instructs the browser and intermediaries to avoid caching the response.
        'Cache-Control': 'no-cache',  
        // Another header to prevent caching (mainly for HTTP/1.0).
        'Pragma': 'no-cache',  
        // Ensures the response is considered stale immediately after being served.
        'Expires': '0',  
    },
});

export const signOut = async () => {
    await session.post("/api/signout");
}

export const signIn = async (username, password) => {
    let val_to_ret = undefined;
    await session.post("/api/signin", { username: username, password: password })
        .then((response) => { val_to_ret = response.status; })
        .catch((err) => {
            if (err.response != undefined) {
                val_to_ret = err.response.status;
            } else {
                val_to_ret = undefined;
            }
        })
    return val_to_ret;
}

export const signUp = async (name, username, email, password) => {
    let val_to_ret = undefined;
    await session.post("/api/signup", { name: name, username: username, email: email, password: password })
        .then((response) => { val_to_ret = response.status; })
        .catch((err) => {
            if (err.response != undefined) {
                val_to_ret = err.response.status;
            } else {
                val_to_ret = undefined;
            }
        })
    return val_to_ret;
}
