import firebase from 'firebase/app';
import "firebase/firestore";
import "firebase/storage";

export default {
  namespaced: true,
  state: {
    gameStatus: "",
    gameResult: {
      title: "",
      description: ""
    },
    figures: [],
    showModal: false,
    returnMove: false,
    clearBoard: false
  },
  getters: {
    getGameStatus: state => state.gameStatus,
    getGameResult: state => state.gameResult,
    getFigures: state => state.figures,
    getShowModal: state => state.showModal,
    getReturnMove: state => state.returnMove,
    getClearField: state => state.clearBoard,
  },
  mutations: {
    changeGameStatus(state, status="") {
      if (typeof status !== 'string') {
        throw Error(`chess.mutations.changeGameStatus(state, status) status must be String`);
      }
      if (!['start', 'finish', ''].includes(status)) {
        throw Error(`chess.mutations.changeGameStatus(state, status) status must be 'start' or 'finish' or ''`);
      }
      state.gameStatus = status;
    },
    changeGameResult(state, result) {
      if (Object.keys(result).join('|') !== 'title|description') {
        throw Error(`chess.mutations.changeGameResult(state, result) result must be Object with keys: 'title', 'description'`)
      }
      state.gameResult = result;
    },
    changeShowModal(state, bool) {
      if (typeof bool !== 'boolean') {
        throw Error(`chess.mutations.changeShowModal(state, bool) bool must be Boolean`)
      }
      state.showModal = bool;
    },
    changeReturnMove(state, bool) {
      if (typeof bool !== 'boolean') {
        throw Error(`chess.mutations.changeReturnMove(state, bool) bool must be Boolean`)
      }
      state.returnMove = bool;
    },
    changeClearBoard(state, bool) {
      if (typeof bool !== 'boolean') {
        throw Error(`chess.mutations.changeClearBoard(state, bool) bool must be Boolean`)
      }
      state.clearBoard = bool;
    },
    setFigures(state, array) {
      if (!Array.isArray(array)) {
        throw Error(`chess.mutations.setFigures(state, array) array must be Array`)
      }
      state.figures = array;
    }
  },
  actions: {
    CHANGE_GAME_STATUS({commit}, status) {
      commit('changeGameStatus', status);
    },
    CHANGE_GAME_RESULT({commit}, result) {
      commit('changeGameResult', result);
    },
    CHANGE_SHOW_MODAL({commit}, bool) {
      commit('changeShowModal', bool);
    },
    CHANGE_RETURN_MOVE({commit}, bool) {
      commit('changeReturnMove', bool);
    },
    CHANGE_CLEAR_BOARD({commit}, bool) {
      commit('changeClearBoard', bool);
    },
    async SET_FIGURES({commit}) {
      const DATA = [];
      const db = firebase.firestore();
      const collection = await db.collection('Chess').get();
      collection.docs.forEach(doc => {
        const data = doc.data();
        DATA.push(data)
      })
      // console.log(DATA);
      commit('setFigures', DATA);
    }
  }
}