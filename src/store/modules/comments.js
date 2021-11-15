import { fireStore } from "@/firebase"
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default {
  namespaced: true,
  state: {
    gameData: null
  },
  getters: {
    getGameData: state => state.gameData
  },
  mutations: {
    setGameData(state, data) {
      state.gameData = data;
    }
  },
  actions: {
    async GET_DATA({commit}, game) {
      const reference = doc(fireStore, 'Comments', game);
      const gameInfo = await getDoc(reference);
      const data = gameInfo.data();
      commit('setGameData', data);
    },

    async POST({state}, payload) {
      try {
        const reference = doc(fireStore, 'Comments', payload.game);
        const { avatar, text, username } = payload;
        state.gameData.comments.unshift({ avatar, text, username });
        await updateDoc(reference, {
          comments: state.gameData.comments
        })
      } 
      catch (error) {
        console.error(error);
      }
    }
  }
}