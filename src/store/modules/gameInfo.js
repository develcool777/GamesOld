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
    async GET_INFO({commit}, gameName) {
      if (typeof gameName !== 'string' ) {
        throw Error(`comments.actions.GET_INFO({commit}, gameName) gameName must be String`);
      }
      try {
        const reference = doc(fireStore, 'Games_Info', gameName);
        const gameInfo = await getDoc(reference);
        const gameInfoData = gameInfo.data();
        commit('setInfo', gameInfoData);
      } 
      catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error({errorCode, errorMessage});
      }
    }, 

    CLEAR_STATE({commit}) {
      commit('setInfo', null);
    }
  }
}