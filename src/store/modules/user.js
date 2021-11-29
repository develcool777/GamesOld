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
    SET_SHOW_USER({commit}, bool) {
      if (typeof bool !== 'boolean') {
        throw Error(`user.actions.SET_SHOW_USER({commit}, bool) bool must Boolean`);
      }
      commit('setShowUser', bool);
    },

    SET_WHAT_TO_SHOW({commit}, value) {
      if (typeof value !== 'string') {
        throw Error(`user.actions.SET_WHAT_TO_SHOW({commit}, value) value must String`);
      }
      commit('setWhatToShow', value);
    },

    async CHECK_AVAILABILITY({}, payload) {
      if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
        throw Error(`user.actions.CHECK_AVAILABILITY({}, payload) payload must be Object`);
      }
      if (!['key', 'value'].every(prop => Object.prototype.hasOwnProperty.call(payload, prop))) {
        throw Error(`user.actions.CHECK_AVAILABILITY({}, payload) payload must be Object with keys: 'key', 'value'`);
      }
      if (typeof payload.key !== 'string') {
        throw Error(`user.actions.CHECK_AVAILABILITY({}, payload) payload.key must be String`);
      }
      if (typeof payload.value !== 'string') {
        throw Error(`user.actions.CHECK_AVAILABILITY({}, payload) payload.value must be String`);
      }
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
      if (typeof password !== 'string') {
        throw Error(`user.actions.CHECK_EQUALITY({state}, password) password must be String`);
      }
      return state.user.password === sha256(password);
    },

    async UPDATE_USERNAME({dispatch, commit}, payload) {
      if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
        throw Error(`user.actions.UPDATE_USERNAME({dispatch, commit}, payload) payload must be Object`);
      }
      if (!['uid', 'username'].every(prop => Object.prototype.hasOwnProperty.call(payload, prop))) {
        throw Error(`user.actions.UPDATE_USERNAME({dispatch, commit}, payload) payload must be Object with keys: 'uid', 'username'`);
      }
      if (typeof payload.uid !== 'string') {
        throw Error(`user.actions.UPDATE_USERNAME({dispatch, commit}, payload) payload.uid must be String`);
      }
      if (typeof payload.username !== 'string') {
        throw Error(`user.actions.UPDATE_USERNAME({dispatch, commit}, payload) payload.username must be String`);
      }
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
        });

        const newUserData = await dispatch('GET_USER_DATA_BY_UID', payload.uid);
        commit('setUser', newUserData);
      } 
      catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error({errorCode, errorMessage});
      }
    },

    async UPDATE_EMAIL({commit, dispatch}, payload) {
      if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
        throw Error(`user.actions.UPDATE_EMAIL({commit, dispatch}, payload) payload must be Object`);
      }
      if (!['userData', 'newEmail'].every(prop => Object.prototype.hasOwnProperty.call(payload, prop))) {
        throw Error(`user.actions.UPDATE_EMAIL({commit, dispatch}, payload) payload must be Object with keys: 'userData', 'newEmail'`);
      }
      if (typeof payload.newEmail !== 'string') {
        throw Error(`user.actions.UPDATE_EMAIL({commit, dispatch}, payload) payload.newEmail must be String`);
      }
      if (typeof payload.userData !== 'object' || payload.userData === null || Array.isArray(payload.userData)) {
        throw Error(`user.actions.UPDATE_EMAIL({commit, dispatch}, payload) payload.userData must be Object`);
      }
      if (!['username', 'email', 'password', 'avatar', 'created', 'admin'].every(prop => Object.prototype.hasOwnProperty.call(payload.userData, prop))) {
        throw Error(`user.actions.UPDATE_EMAIL({commit, dispatch}, payload) payload must be Object with keys: 'username', 'email', 'password', 'avatar', 'created', 'admin'`);
      }
      if (typeof payload.userData.username !== 'string') {
        throw Error(`user.actions.UPDATE_EMAIL({commit, dispatch}, payload) payload.userData.username must be String`);
      }
      if (typeof payload.userData.email !== 'string') {
        throw Error(`user.actions.UPDATE_EMAIL({commit, dispatch}, payload) payload.userData.email must be String`);
      }
      if (typeof payload.userData.password !== 'string') {
        throw Error(`user.actions.UPDATE_EMAIL({commit, dispatch}, payload) payload.userData.password must be String`);
      }
      if (typeof payload.userData.avatar !== 'string') {
        throw Error(`user.actions.UPDATE_EMAIL({commit, dispatch}, payload) payload.userData.avatar must be String`);
      }
      if (typeof payload.userData.created !== 'string') {
        throw Error(`user.actions.UPDATE_EMAIL({commit, dispatch}, payload) payload.userData.created must be String`);
      }
      if (typeof payload.userData.admin !== 'boolean') {
        throw Error(`user.actions.UPDATE_EMAIL({commit, dispatch}, payload) payload.userData.admin must be Boolean`);
      }
      try {
        const user = auth.currentUser;
        const credential = EmailAuthProvider.credential(payload.userData.email, payload.userData.password)
        await reauthenticateWithCredential(user, credential);
        await updateEmail(auth.currentUser, payload.newEmail);
        const reference = ref(database, 'users/' + payload.userData.uid);
        await update(reference, { email: payload.newEmail });

        const newUserData = await dispatch('GET_USER_DATA_BY_UID', payload.userData.uid);
        commit('setUser', newUserData);
      } 
      catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error({errorCode, errorMessage});
      }
    },

    async UPDATE_PASSWORD({commit, dispatch}, payload) {
      if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
        throw Error(`user.actions.UPDATE_EMAIL({commit, dispatch}, payload) payload must be Object`);
      }
      if (!['userData', 'newPassword'].every(prop => Object.prototype.hasOwnProperty.call(payload, prop))) {
        throw Error(`user.actions.UPDATE_EMAIL({commit, dispatch}, payload) payload must be Object with keys: 'userData', 'newPassword'`);
      }
      if (typeof payload.newPassword !== 'string') {
        throw Error(`user.actions.UPDATE_EMAIL({commit, dispatch}, payload) payload.newPassword must be String`);
      }
      if (typeof payload.userData !== 'object' || payload.userData === null || Array.isArray(payload.userData)) {
        throw Error(`user.actions.UPDATE_EMAIL({commit, dispatch}, payload) payload.userData must be Object`);
      }
      if (!['username', 'email', 'password', 'avatar', 'created', 'admin'].every(prop => Object.prototype.hasOwnProperty.call(payload.userData, prop))) {
        throw Error(`user.actions.UPDATE_EMAIL({commit, dispatch}, payload) payload must be Object with keys: 'username', 'email', 'password', 'avatar', 'created', 'admin'`);
      }
      if (typeof payload.userData.username !== 'string') {
        throw Error(`user.actions.UPDATE_EMAIL({commit, dispatch}, payload) payload.userData.username must be String`);
      }
      if (typeof payload.userData.email !== 'string') {
        throw Error(`user.actions.UPDATE_EMAIL({commit, dispatch}, payload) payload.userData.email must be String`);
      }
      if (typeof payload.userData.password !== 'string') {
        throw Error(`user.actions.UPDATE_EMAIL({commit, dispatch}, payload) payload.userData.password must be String`);
      }
      if (typeof payload.userData.avatar !== 'string') {
        throw Error(`user.actions.UPDATE_EMAIL({commit, dispatch}, payload) payload.userData.avatar must be String`);
      }
      if (typeof payload.userData.created !== 'string') {
        throw Error(`user.actions.UPDATE_EMAIL({commit, dispatch}, payload) payload.userData.created must be String`);
      }
      if (typeof payload.userData.admin !== 'boolean') {
        throw Error(`user.actions.UPDATE_EMAIL({commit, dispatch}, payload) payload.userData.admin must be Boolean`);
      }
      try {
        const shaPass = sha256(payload.newPassword);
        const user = auth.currentUser;
        const credential = EmailAuthProvider.credential(payload.userData.email, payload.userData.password)
        await reauthenticateWithCredential(user, credential);
        await updatePassword(auth.currentUser, shaPass)
        const reference = ref(database, 'users/' + payload.userData.uid);
        await update(reference, { password: shaPass });

        const newUserData = await dispatch('GET_USER_DATA_BY_UID', payload.userData.uid);
        commit('setUser', newUserData);
      } 
      catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error({errorCode, errorMessage});
      }
    },

    async CREATE_ACCOUNT({dispatch}, payload) {
      if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
        throw Error(`user.actions.CREATE_ACCOUNT({dispatch}, payload) payload must be Object`);
      }
      if (!['password', 'username', 'email'].every(prop => Object.prototype.hasOwnProperty.call(payload, prop))) {
        throw Error(`user.actions.CREATE_ACCOUNT({dispatch}, payload) payload must be Object with keys: 'password', 'username', 'email'`);
      }
      if (typeof payload.password !== 'string') {
        throw Error(`user.actions.CREATE_ACCOUNT({dispatch}, payload) payload.password must be String`);
      }
      if (typeof payload.username !== 'string') {
        throw Error(`user.actions.CREATE_ACCOUNT({dispatch}, payload) payload.username must be String`);
      }
      if (typeof payload.email !== 'string') {
        throw Error(`user.actions.CREATE_ACCOUNT({dispatch}, payload) payload.email must be String`);
      }
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
      if (typeof uid !== 'string') {
        throw Error(`user.actions.GET_USER_DATA_BY_UID({}, uid) uid must be String`);
      }
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
      if (typeof letter !== 'string') {
        throw Error(`user.actions.GENERATE_AVATAR({}, letter) letter must be String`);
      }
      if (letter.length !== 1) {
        throw Error(`user.actions.GENERATE_AVATAR({}, letter) letter length must be 1`);
      }

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
      if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
        throw Error(`user.actions.SIGN_IN({dispatch, commit}, payload) payload must be Object`);
      }
      if (!['password', 'email'].every(prop => Object.prototype.hasOwnProperty.call(payload, prop))) {
        throw Error(`user.actions.SIGN_IN({dispatch, commit}, payload) payload must be Object with keys: 'password', 'email'`);
      }
      if (typeof payload.password !== 'string') {
        throw Error(`user.actions.SIGN_IN({dispatch, commit}, payload) payload.password must be String`);
      }
      if (typeof payload.email !== 'string') {
        throw Error(`user.actions.SIGN_IN({dispatch, commit}, payload) payload.email must be String`);
      }
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