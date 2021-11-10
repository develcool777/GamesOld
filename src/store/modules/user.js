import { auth } from "@/firebase"
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile, 
} from "firebase/auth";

export default {
  namespaced: true,
  state: {
    showUser: false,
    whatToShow: 'registration',
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
        // const avatarURl = await dispatch('generateAvatar', payload.username[0]);
        await updateProfile(userCredential.user, {
          displayName: payload.username,
          // photoURL: avatarURl
        });
        // const actionCodeSettings = {
        //   url: 'http://localhost:8080/',
        // };
        // await sendEmailVerification(userCredential.user);
        return {isCreated: true};
      } 
      catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        return {errorCode, errorMessage, isCreated: false};
      }
    },

    async generateAvatar({commit}, letter) {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
  
      canvas.width = 200;
      canvas.height = 200;
  
      // Draw background
      const colors = ['red', 'green', 'purple', 'pink', 'blue', 'gray', 'orange']
      context.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      context.fillRect(0, 0, canvas.width, canvas.height);
  
      // Draw text
      context.font = 'bold 100px Assistant';
      context.fillStyle = 'white';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(letter, canvas.width / 2, canvas.height / 2);
  
      return canvas.toDataURL('image/png');
    },

    async SIGN_IN({commit}, payload) {
      try {
        await signInWithEmailAndPassword(auth, payload.email, payload.password);
        return {isLogined: true}
      } 
      catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        return {errorCode, errorMessage, isLogined: false};
      }
    }
  }
}