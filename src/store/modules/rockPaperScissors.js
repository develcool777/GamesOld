import firebase from 'firebase/app';
import "firebase/firestore";

export default {
  namespaced: true,
  state: {
    impossible: false,
    easy: false,
    withoutDraw: false,
    clear: false,
    showHistory: false,
    showAnalitics: false,
    resultOfMove: false,
    choices: {}
  },
  getters: {
    getImpossible: state => state.impossible,
    getEasy: state => state.easy,
    getWithoutDraw: state => state.withoutDraw,
    getClear: state => state.clear,
    getShowHistory: state => state.showHistory,
    getShowAnalitics: state => state.showAnalitics,
    getResultOfMove: state => state.resultOfMove,
    getChoices: state => state.choices
  },
  mutations: {
    changeImpossible(state, boolean) {
      state.impossible = boolean;
    },
    changeEasy(state, boolean) {
      state.easy = boolean;
    },
    changeWithoutDraw(state, boolean) {
      state.withoutDraw = boolean;
    },
    changeClear(state, boolean) {
      state.clear = boolean;
    },
    changeShowHistory(state, boolean) {
      state.showHistory = boolean;
    },
    changeShowAnalitics(state, boolean) {
      state.showAnalitics = boolean;
    },
    changeResultOfMove(state, boolean) {
      state.resultOfMove = boolean;
    },
    setChoices(state, array) {
      if (!Array.isArray(array)) {
        throw Error(`rockPaperScissors.mutations.setChoices(state, array) array must be Array`);
      }
      state.choices = array.reduce((acc, obj) => {
        acc[obj.name] = obj.url;
        return acc;
      }, {});
    }
  },
  actions: {
    INIT_STATE({commit, dispatch}) {
      dispatch('RESET_MODE');
      commit('changeClear', false);
      commit('changeShowHistory', false);
      commit('changeResultOfMove', false);
      commit('changeShowAnalitics', false);
    },
    RESET_MODE({commit}) {
      commit('changeImpossible', false);
      commit('changeEasy', false);
      commit('changeWithoutDraw', false); 
    },
    CHANGE_IMPOSSIBLE({commit}, boolean) {
      commit('changeImpossible', boolean);     
    },
    CHANGE_EASY({commit}, boolean) {
      commit('changeEasy', boolean);     
    },
    CHANGE_WITHOUT_DRAW({commit}, boolean) {
      commit('changeWithoutDraw', boolean);     
    },
    CHANGE_CLEAR({commit}, boolean) {
      commit('changeClear', boolean);     
    },
    CHANGE_SHOW_HISTORY({commit}, boolean) {
      commit('changeShowHistory', boolean);     
    },
    CHANGE_SHOW_ANALITICS({commit}, boolean) {
      commit('changeShowAnalitics', boolean);     
    },
    CHANGE_RESULT_OF_MOVE({commit}, boolean) {
      commit('changeResultOfMove', boolean);     
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
    }
  }
}