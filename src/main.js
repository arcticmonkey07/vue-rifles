import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { autoAnimatePlugin } from '@formkit/auto-animate/vue';
import router from './router.js';

const app = createApp(App);

app.use(autoAnimatePlugin);

app.use(router);

app.mount('#app');
