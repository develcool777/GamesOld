import { fireStore } from "@/firebase"
import { doc, getDoc, collection, getDocs, setDoc, onSnapshot, deleteDoc } from "firebase/firestore";

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
    },

    updateComments(state, comments) {
      state.gameData.comments = comments;
    }
  },
  actions: {
    async GET_DATA({commit, dispatch}, game) {
      try {
        const info = await dispatch('GET_INFO', game);
        const comments = await dispatch('GET_COMMENTS', game);
        info.comments = comments;
        commit('setGameData', info);
      } 
      catch (error) {
        console.error(error);
      }
    },

    async GET_INFO({}, gameName) {
      try {
        const reference = doc(fireStore, 'Comments', gameName);
        const gameInfo = await getDoc(reference);
        const gameInfoData = gameInfo.data();
        return gameInfoData;
      } 
      catch (error) {
        console.error(error);
      }

    }, 

    async GET_COMMENTS({}, gameName) {
      try {
        const reference = collection(fireStore, `Comments/${gameName}/comments`);
        const comments = await getDocs(reference);
        return comments.docs.map(doc => doc.data()).sort((a, b) => b.created - a.created);
      } 
      catch (error) {
        console.error(error);
      }
    }, 

    LISTENER_FOR_COMMENTS({state, dispatch, commit}, gameName) {
      const reference = collection(fireStore, `Comments/${gameName}/comments`);
      const unsubscribe = onSnapshot(reference, async snap => {
        if (snap.size !== state.gameData.comments) {
          const comments = await dispatch('GET_COMMENTS', gameName);
          commit('updateComments', comments);
        }
      })
      return unsubscribe;
    },

    async POST({}, payload) {
      try {
        const reference = doc(fireStore, `Comments/${payload.game}/comments`, `${payload.id}`);
        const { avatar, text, username, id, created } = payload;
        await setDoc(reference, {
          avatar, text, username, id, created
        })
      } 
      catch (error) {
        console.error(error);
      }
    },

    async DELETE_COMMENT({}, payload) {
      try {
        const reference = doc(fireStore, `Comments/${payload.game}/comments`, `${payload.id}`);
        await deleteDoc(reference);
      } 
      catch (error) {
        console.error(error);
      }
    }
  }
}