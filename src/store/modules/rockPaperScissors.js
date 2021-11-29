import { fireStore } from "@/firebase"
import { collection, getDocs } from "firebase/firestore";

export default {
  namespaced: true,
  state: {
    showHistory: false,
    showAnalitics: false,
    choices: {},
    mode: ''
  },
  getters: {
    getShowHistory: state => state.showHistory,
    getShowAnalitics: state => state.showAnalitics,
    getChoices: state => state.choices,
    getMode: state => state.mode
  },
  mutations: {
    changeShowHistory(state, bool) {
      if (typeof bool !== 'boolean') {
        throw Error(`rockPaperScissors.mutation.changeShowHistory bool must Boolean`);
      }
      state.showHistory = bool;
    },

    changeShowAnalitics(state, bool) {
      if (typeof bool !== 'boolean') {
        throw Error(`rockPaperScissors.mutation.changeShowAnalitics bool must Boolean`);
      }
      state.showAnalitics = bool;
    },
    
    setChoices(state, array) {
      if (!Array.isArray(array)) {
        throw Error(`rockPaperScissors.mutations.setChoices(state, array) array must be Array`);
      }
      state.choices = array.reduce((acc, obj) => {
        acc[obj.name] = obj.url;
        return acc;
      }, {});
    },

    setMode(state, mode) {
      if (typeof mode !== 'string') {
        throw Error(`rockPaperScissors.mutations.setMode(state, mode) mode must be String`);
      }
      if (!['easy', 'impossible', 'withoutDraw', ''].includes(mode)) {
        throw Error(`rockPaperScissors.mutations.setMode(state, mode) mode must be 'easy', 'impossible', 'withoutDraw', '`);
      }
      state.mode = mode;
    },
  },
  actions: {
    INIT_STATE({commit}) {
      commit('changeShowHistory', false);
      commit('changeShowAnalitics', false);
    },

    CHANGE_SHOW_HISTORY({commit}, bool) {
      if (typeof bool !== 'boolean') {
        throw Error(`rockPaperScissors.actions.CHANGE_SHOW_HISTORY({commit}, bool) bool must be Boolean`);
      }
      commit('changeShowHistory', bool);     
    },

    CHANGE_SHOW_ANALITICS({commit}, bool) {
      if (typeof bool !== 'boolean') {
        throw Error(`rockPaperScissors.actions.CHANGE_SHOW_ANALITICS({commit}, bool) bool must be Boolean`);
      }
      commit('changeShowAnalitics', bool);     
    },

    async SET_CHOICES({commit}) {
      try {
        const reference = collection(fireStore, 'rockPaperScissors');
        const rps = await getDocs(reference);
        const data = rps.docs.map(doc => doc.data())
        commit('setChoices', data);
      } 
      catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error({errorCode, errorMessage});
      }
    },

    SET_MODE({commit}, mode) {
      if (typeof mode !== 'string') {
        throw Error(`rockPaperScissors.actions.SET_MODE({commit}, mode) mode must be String`);
      }
      commit('setMode', mode);
    },

    CLEAR_STATE({commit}) {
      commit('setChoices', []);
      commit('setMode', '');
      commit('changeShowHistory', false);
      commit('changeShowAnalitics', false);
    }
  }
}