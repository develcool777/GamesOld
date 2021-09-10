import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from "@/store";
import firebase from 'firebase/app';
import firebaseConfig from '../firebase.json';

// Initialize Firebase
firebase.initializeApp(firebaseConfig.config);

const app = createApp(App);
app.use(store);
app.use(router).mount('#app');