import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import mitt from 'mitt';
import store from "@/store";
const emitter = mitt();
const app = createApp(App);
app.use(store);
app.config.globalProperties.emitter = emitter;
app.use(router).mount('#app');
