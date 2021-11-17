import sha256 from 'sha256';
import { auth, database } from "@/firebase"
import { ref, set, get, child } from "firebase/database";
import { 
  createUserWithEmailAndPassword, signInWithEmailAndPassword, 
  signOut, onAuthStateChanged
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

    async CREATE_ACCOUNT({dispatch}, payload) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, payload.email, payload.password);
        const avatarURl = await dispatch('GENERATE_AVATAR', payload.username[0].toUpperCase());
        set(ref(database, 'users/' + userCredential.user.uid), {
          username: payload.username,
          email: payload.email,
          avatar: avatarURl,
          password: sha256(payload.password),
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

    async GET_USER_DATA_BY_UID({commit}, uid) {
      const dbRef = ref(database);
      try {
        const promise = await get(child(dbRef, `users/${uid}`));
        return promise.exists() ? promise.val() : null;
      } 
      catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        return {errorCode, errorMessage};
      }
    },

    async GENERATE_AVATAR({commit}, letter) {
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

    async SIGN_IN({dispatch, commit}, payload) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, payload.email, payload.password);
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