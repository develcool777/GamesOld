import { fireStore } from "@/firebase"
import { doc, getDoc, } from "firebase/firestore";

export default {
  namespaced: true,
  state: {
    info: null
  },
  getters: {
    getInfo: state => state.info
  },
  mutations: {
    setInfo(state, information) {
      state.info = information;
    }
  },
  actions: {
    async GET_DATA({commit, dispatch}, gameName) {
      try {
        const info = await dispatch('GET_INFO', gameName);
        commit('setInfo', info);
      } 
      catch (error) {
        console.error(error);
      }
    },

    async GET_INFO({}, gameName) {
      try {
        const reference = doc(fireStore, 'Games_Info', gameName);
        const gameInfo = await getDoc(reference);
        const gameInfoData = gameInfo.data();
        return gameInfoData;
      } 
      catch (error) {
        console.error(error);
      }
    }, 

    CLEAR_STATE({commit}) {
      commit('setInfo', null);
    }
  }
}