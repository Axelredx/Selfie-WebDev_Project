import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHashHistory } from 'vue-router'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import App from './App.vue'
import { routes } from './router'

const app = createApp(App);
const pinia = createPinia();
const router = createRouter({
    history: createWebHashHistory(),
    routes: routes
})

app.use(router);
app.use(pinia);

app.mount('#app');
