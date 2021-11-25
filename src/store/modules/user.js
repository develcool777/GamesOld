import sha256 from 'sha256';
import { auth, database, fireStore } from "@/firebase"
import { 
  ref, set, get, child, query as queryDatabase,
  equalTo, orderByChild, update 
} from "firebase/database";

import { 
  collection, getDocs, query as queryFirestore,
  where, updateDoc, doc 
} from "firebase/firestore";

import { 
  createUserWithEmailAndPassword, signInWithEmailAndPassword, 
  signOut, onAuthStateChanged, updateEmail, updatePassword,
  reauthenticateWithCredential, EmailAuthProvider, 
} from "firebase/auth";


export default {
  namespaced: true,
  state: {
    showUser: false,
    whatToShow: 'login',
    user: null,
  },
  getters: {
    getShowUser: state => state.showUser,
    getWhatToShow: state => state.whatToShow,
    getUser: state => state.user,
  },
  mutations: {
    setShowUser(state, value) {
      if (typeof value !== 'boolean') {
        throw Error(`user.mutation.setShowUser value must Boolean`);
      }
      state.showUser = value;
    },

    setWhatToShow(state, value) {
      if (typeof value !== 'string') {
        throw Error(`user.mutation.setWhatToShow value must String`);
      }
      if (!['registration', 'login', 'account'].includes(value)) {
        throw Error(`user.mutation.setWhatToShow value must 'registration' or 'login' or 'account'`);
      }
      state.whatToShow = value;
    },

    setUser(state, user) {
      state.user = user;
    }
  },
  actions: {
    SET_SHOW_USER({commit}, value) {
      commit('setShowUser', value);
    },

    SET_WHAT_TO_SHOW({commit}, value) {
      commit('setWhatToShow', value);
    },

    async CHECK_AVAILABILITY({}, payload) {
      try {
        const reference = ref(database, 'users');
        const q = queryDatabase(reference, orderByChild(payload.key), equalTo(payload.value));
        const d = await get(q);
        return d.exists();
      } 
      catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error({errorCode, errorMessage});  
      }
    },

    CHECK_EQUALITY({state}, password) {
      return state.user.password === sha256(password);
    },

    async UPDATE_USERNAME({dispatch}, payload) {
      try {
        const referenceDatabase = ref(database, 'users/' + payload.uid);
        const avatarURl = await dispatch('GENERATE_AVATAR', payload.username[0].toUpperCase());
        await update(referenceDatabase, {
          username: payload.username,
          avatar: avatarURl
        });

        const games = ['Chess', 'Maze', 'Memoji', 'RockPaperScissors', 'TicTacToe'];
        games.forEach(async game => {
          const referenceFirestore = collection(fireStore, `Games_Info/${game}/comments`);
          const q = queryFirestore(referenceFirestore, where('userUID', '==', payload.uid)); 
          const comments = await getDocs(q);
          const ids = comments.docs.map(doc => doc.id);

          if (ids.length === 0) return;

          ids.forEach(async id => {
            const commentReference = doc(fireStore, `Games_Info/${game}/comments`, id);
            await updateDoc(commentReference, {
              avatar: avatarURl,
              username: payload.username,
            });
          })
        })
      } 
      catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error({errorCode, errorMessage});
      }
    },

    async UPDATE_EMAIL({}, payload) {
      try {
        const user = auth.currentUser;
        const credential = EmailAuthProvider.credential(payload.userData.email, payload.userData.password)
        await reauthenticateWithCredential(user, credential);
        await updateEmail(auth.currentUser, payload.newEmail);
        const reference = ref(database, 'users/' + payload.userData.uid);
        await update(reference, { email: payload.newEmail });
      } 
      catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error({errorCode, errorMessage});
      }
    },

    async UPDATE_PASSWORD({}, payload) {
      try {
        const shaPass = sha256(payload.newPassword);
        const user = auth.currentUser;
        const credential = EmailAuthProvider.credential(payload.userData.email, payload.userData.password)
        await reauthenticateWithCredential(user, credential);
        await updatePassword(auth.currentUser, shaPass)
        const reference = ref(database, 'users/' + payload.userData.uid);
        await update(reference, { password: shaPass });
      } 
      catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error({errorCode, errorMessage});
      }
    },

    async CREATE_ACCOUNT({dispatch}, payload) {
      try {
        const shaPass = sha256(payload.password);
        const userCredential = await createUserWithEmailAndPassword(auth, payload.email, shaPass);
        const avatarURl = await dispatch('GENERATE_AVATAR', payload.username[0].toUpperCase());
        await set(ref(database, 'users/' + userCredential.user.uid), {
          username: payload.username,
          email: payload.email,
          avatar: avatarURl,
          password: shaPass,
          created: userCredential.user.metadata.creationTime,
          admin: false
        });
        return {isCreated: true};
      } 
      catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        return {errorCode, errorMessage, isCreated: false};
      }
    },

    async GET_USER_DATA_BY_UID({}, uid) {
      const dbRef = ref(database);
      try {
        const promise = await get(child(dbRef, `users/${uid}`));
        if (promise.exists()) {
          const userData = promise.val();
          userData.uid = uid;
          return userData;
        }
        return null;
      } 
      catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        return {errorCode, errorMessage};
      }
    },

    async GENERATE_AVATAR({}, letter) {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
  
      canvas.width = 100;
      canvas.height = 100;
  
      // Draw background
      const colors = [
        'lightcoral', 'lightpink', 'lightsalmon', 'lightseagreen', 
        'lightslategray', 'olivedrab', 'olive','darkkhaki', 'darkcyan', 
        'darksalmon', 'darkorange', 'palevioletred', 'yellowgreen', 
        'royalblue', 'hotpink', 'rebeccapurple'
      ]
      context.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      context.fillRect(0, 0, canvas.width, canvas.height);
  
      // Draw text
      context.font = 'bold 100px Arial';
      context.fillStyle = 'white';
      const textWidth = context.measureText(letter).width;
      context.fillText(letter, canvas.width / 2 - textWidth / 2, canvas.height / 2 + 35);
  
      return canvas.toDataURL('image/png');
    },

    GENERATE_PASSWORD() {
      const pass = [];
      const randNumber = () => Math.floor(Math.random() * 10);
      const randLetter = (min, max) => String.fromCharCode(Math.floor(Math.random() * (max - min)) + min);
      const specialcharacters = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '\\', '-', '_', '=', '+', '[', '{', '}', ']', ':', ';', '.', ',', '\'', '\"', '?', '/', '|', '\`', '~', '<', '>'];
      const randSpecialCharacter = () => specialcharacters[Math.floor(Math.random() * (specialcharacters.length - 1))];
      pass.push(
        randNumber(), randNumber(), randNumber(),
        randLetter(65, 90), randLetter(65, 90), randLetter(65, 90),
        randLetter(97, 122), randLetter(97, 122), randLetter(97, 122),
        randSpecialCharacter(), randSpecialCharacter(), randSpecialCharacter()
      );
      return pass.sort(() => Math.random() - 0.5).join('');
    },

    async SIGN_IN({dispatch, commit}, payload) {
      try {
        const shaPass = sha256(payload.password);
        const userCredential = await signInWithEmailAndPassword(auth, payload.email, shaPass);
        const userData = await dispatch('GET_USER_DATA_BY_UID', userCredential.user.uid);
        commit('setUser', userData);
        return {isLogined: true}
      } 
      catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        return {errorCode, errorMessage, isLogined: false};
      }
    },

    async SIGN_OUT({commit}) {
      try {
        await signOut(auth);
        commit('setWhatToShow', 'login');
        commit('setUser', null);
      } 
      catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log({errorCode, errorMessage})
      }
    },

     SURVIVE_PAGE_RELOAD({dispatch, commit}) {
      const unsubscribe = onAuthStateChanged(auth, async user => {
        if (user) {
          const userData = await dispatch('GET_USER_DATA_BY_UID', user.uid);
          commit('setUser', userData);
          commit('setWhatToShow', 'account');
        }
        else {
          commit('setWhatToShow', 'login');
        }
      })
      unsubscribe();
    }
  }
}