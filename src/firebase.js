import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const config = {
  apiKey: "AIzaSyAN74W4lQ08kNqnVwpu6tWkvF6chy2J09o",
  authDomain: "games-65e21.firebaseapp.com",
  projectId: "games-65e21",
  storageBucket: "games-65e21.appspot.com",
  messagingSenderId: "325996537580",
  appId: "1:325996537580:web:e037778742f6d7ce9a27c9",
  measurementId: "G-KQ9PVDZSK4",
  databaseURL: "https://games-65e21-default-rtdb.europe-west1.firebasedatabase.app/"
}

const apps = getApps();
let firebaseApp;
if (!apps.length) { firebaseApp = initializeApp(config) } 
else { firebaseApp = apps[0] }

const fireStore = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const database = getDatabase(firebaseApp)

export { fireStore, auth, database }