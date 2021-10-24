import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";

const config = {
  apiKey: "AIzaSyAN74W4lQ08kNqnVwpu6tWkvF6chy2J09o",
  authDomain: "games-65e21.firebaseapp.com",
  projectId: "games-65e21",
  storageBucket: "games-65e21.appspot.com",
  messagingSenderId: "325996537580",
  appId: "1:325996537580:web:e037778742f6d7ce9a27c9",
  measurementId: "G-KQ9PVDZSK4"
}

const firebaseApp = initializeApp(config);
const fireStore = getFirestore(firebaseApp);

export { fireStore }