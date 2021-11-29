import { fireStore } from "@/firebase"
import { collection, getDocs } from "firebase/firestore";

export default {
  namespaced: true,
  state: {
    figures: {},
    emitIndex: 0
  },
  getters: {
    getFigures: state => state.figures,
    getEmitIndex: state => state.emitIndex,
  },
  mutations: {
    setFigures(state, array) {
      if (!Array.isArray(array)) {
        throw Error(`chess.mutations.setFigures(state, array) array must be Array`);
      }
      state.figures = array.reduce((acc, obj) => {
        acc[obj.name] = obj.url;
        return acc;
      }, {});
    },

    setEmitIndex(state, value) {
      if (!Number.isInteger(value)) {
        throw Error(`chess.mutations.setEmitIndex(state, value) array must be Integer`);
      }
      state.emitIndex = value;
    }
  },
  actions: {    
    async SET_FIGURES({commit}) {
      try {
        const reference = collection(fireStore, 'Chess');
        const chess = await getDocs(reference);
        const data = chess.docs.map(doc => doc.data())
        commit('setFigures', data);
      } 
      catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error({errorCode, errorMessage});
      }
    },

    CHANGE_EMIT_INDEX({commit}, value) {
      commit('setEmitIndex', value);
    },

    CLEAR_STATE({commit}) {
      commit('setEmitIndex', 0);
      commit('setFigures', []);
    }
  }
}