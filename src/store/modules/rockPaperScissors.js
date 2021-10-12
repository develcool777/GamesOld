import firebase from 'firebase/app';
import "firebase/firestore";

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

    CHANGE_SHOW_HISTORY({commit}, boolean) {
      commit('changeShowHistory', boolean);     
    },

    CHANGE_SHOW_ANALITICS({commit}, boolean) {
      commit('changeShowAnalitics', boolean);     
    },

    async SET_CHOICES({commit}) {
      const DATA = [];
      const db = firebase.firestore();
      const collection = await db.collection('rockPaperScissors').get();
      collection.docs.forEach(doc => {
        const data = doc.data();
        DATA.push(data)
      })
      commit('setChoices', DATA);
    },

    SET_MODE({commit}, mode) {
      commit('setMode', mode);
    }
  }
}