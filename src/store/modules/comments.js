import { fireStore } from "@/firebase"
import { 
  doc, getDoc, collection, 
  getDocs, setDoc, onSnapshot, 
  deleteDoc, query, orderBy, 
  limit, startAfter,
} from "firebase/firestore";

export default {
  namespaced: true,
  state: {
    gameData: {
      info: null,
      comments: null
    },
    latestDoc: null,
    amountOfComments: null,
  },
  getters: {
    getGameData: state => state.gameData,
    getLatestDoc: state => state.latestDoc,
    getAmountOfComments: state => state.amountOfComments,
  },
  mutations: {
    setGameData(state, data) {
      state.gameData.info = data.info;
      state.gameData.comments = data.comments;
    },

    updateComments(state, payload) {
      state.gameData.comments = payload.comments;
      state.amountOfComments = payload.amountOfCommentsInFirestore;
    },

    moreComments(state, comments) {
      state.gameData.comments.push(...comments);
    },

    setLatestDoc(state, doc) {
      state.latestDoc = doc;
    },

    setAmountOfComments(state, amount) {
      state.amountOfComments = amount;
    }
  },
  actions: {
    async GET_DATA({commit, dispatch}, payload) {
      try {
        const info = await dispatch('GET_INFO', payload.gameName);
        const comments = await dispatch('GET_COMMENTS', payload) || [];
        commit('setGameData', {info, comments});
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

    async GET_COMMENTS({state, commit}, payload) {
      try {
        const reference = collection(fireStore, `Comments/${payload.gameName}/comments`);
        const decideLimit = state.gameData.comments?.length > 5 ? state.gameData.comments.length : 5
        const limitOfComments = payload.listener ? decideLimit : 5
        const q = state.latestDoc === null || payload.listener
          ? query(reference, orderBy('created', 'desc'), limit(limitOfComments))
          : query(reference, orderBy('created', 'desc'), startAfter(state.latestDoc), limit(limitOfComments));

        const comments = await getDocs(q);
        commit('setLatestDoc', comments.docs[comments.docs.length - 1]);
        return comments.docs.map(doc => doc.data());
      } 
      catch (error) {
        console.error(error);
      }
    }, 

    LISTENER_FOR_COMMENTS({state, dispatch, commit}, gameName) {
      const reference = collection(fireStore, `Comments/${gameName}/comments`);
      const q = query(reference, orderBy('created', 'desc'));
      let firstTime = true;
      const unsubscribe = onSnapshot(q, async snap => {
        if (firstTime) { 
          commit('setAmountOfComments', snap.size);
          firstTime = false;
          return
        }

        const lastIndex = state.gameData.comments.length - 1;
        if (snap.docs[lastIndex]?.id !== state.latestDoc?.id || lastIndex === -1) {
          const comments = await dispatch('GET_COMMENTS', {gameName, listener: true});
          commit('updateComments', { comments, amountOfCommentsInFirestore: snap.size });
        }
      });
      return unsubscribe;
    },

    async LOAD_MORE_COMMENTS({dispatch, commit}, gameName) {
      const comments = await dispatch('GET_COMMENTS', {gameName, listener: false});
      commit('moreComments', comments);
    },

    async POST({}, payload) {
      try {
        const reference = doc(fireStore, `Comments/${payload.game}/comments`, `${payload.id}`);
        const { avatar, text, username, id, created, admin } = payload;
        await setDoc(reference, {
          avatar, text, username, id, created, admin
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