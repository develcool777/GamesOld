import firebase from 'firebase/app';
import "firebase/firestore";

export default {
  namespaced: true,
  state: {
    gameResult: {
      title: "",
      description: ""
    },
    figures: {},
    showModal: false,
    analyze: false,
  },
  getters: {
    getGameResult: state => state.gameResult,
    getFigures: state => state.figures,
    getShowModal: state => state.showModal,
    getAnalyze: state => state.analyze,
  },
  mutations: {
    changeGameResult(state, result) {
      if (Object.keys(result).join('|') !== 'title|description') {
        throw Error(`chess.mutations.changeGameResult(state, result) result must be Object with keys: 'title', 'description'`);
      }
      state.gameResult = result;
    },

    changeShowModal(state, bool) {
      if (typeof bool !== 'boolean') {
        throw Error(`chess.mutations.changeShowModal(state, bool) bool must be Boolean`);
      }
      state.showModal = bool;
    },

    changeAnalyze(state, bool) {
      if (typeof bool !== 'boolean') {
        throw Error(`chess.mutations.changeAnalyze(state, bool) bool must be Boolean`);
      }
      state.analyze = bool;
    },

    setFigures(state, array) {
      if (!Array.isArray(array)) {
        throw Error(`chess.mutations.setFigures(state, array) array must be Array`);
      }
      state.figures = array.reduce((acc, obj) => {
        acc[obj.name] = obj.url;
        return acc;
      }, {});
    }
  },
  actions: {
    CHANGE_GAME_RESULT({commit}, result) {
      commit('changeGameResult', result);
    },

    CHANGE_SHOW_MODAL({commit}, bool) {
      commit('changeShowModal', bool);
    },

    CHANGE_ANALYZE({commit}, bool) {
      commit('changeAnalyze', bool);
    },
    
    async SET_FIGURES({commit}) {
      const DATA = [];
      const db = firebase.firestore();
      const collection = await db.collection('Chess').get();
      collection.docs.forEach(doc => {
        const data = doc.data();
        DATA.push(data)
      })
      commit('setFigures', DATA);
    }
  }
}