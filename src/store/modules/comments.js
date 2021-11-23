import { fireStore } from "@/firebase"
import { 
  doc, collection, getDocs, 
  addDoc, onSnapshot, deleteDoc, 
  query, orderBy, limit, startAfter,
} from "firebase/firestore";

export default {
  namespaced: true,
  state: {
    comments: null,
    latestDoc: null,
    amountOfComments: null,
  },
  getters: {
    getComments: state => state.comments,
    getLatestDoc: state => state.latestDoc,
    getAmountOfComments: state => state.amountOfComments,
  },
  mutations: {
    setComments(state, comments) {
      state.comments = comments;
    },

    updateComments(state, payload) {
      state.comments = payload.comments;
      state.amountOfComments = payload.amountOfCommentsInFirestore;
    },

    moreComments(state, comments) {
      state.comments.push(...comments);
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
        const comments = await dispatch('GET_COMMENTS', payload) || [];
        commit('setComments', comments);
      } 
      catch (error) {
        console.error(error);
      }
    },

    async GET_COMMENTS({state, commit}, payload) {
      try {
        const reference = collection(fireStore, `Games_Info/${payload.gameName}/comments`);
        const decideLimit = state.comments?.length > 5 ? state.comments.length + 1 : 5
        const limitOfComments = payload.listener ? decideLimit : 5
        const q = state.latestDoc === null || payload.listener
          ? query(reference, orderBy('created', 'desc'), limit(limitOfComments))
          : query(reference, orderBy('created', 'desc'), startAfter(state.latestDoc), limit(limitOfComments));

        const comments = await getDocs(q);
        commit('setLatestDoc', comments.docs[comments.docs.length - 1]);
        return comments.docs.map(doc => {
          const data = doc.data();
          data.id = doc.id
          return data;
        });
      } 
      catch (error) {
        console.error(error);
      }
    }, 

    LISTENER_FOR_COMMENTS({state, dispatch, commit}, gameName) {
      const reference = collection(fireStore, `Games_Info/${gameName}/comments`);
      const q = query(reference, orderBy('created', 'desc'));
      let firstTime = true;
      const unsubscribe = onSnapshot(q, async snap => {
        if (firstTime) { 
          commit('setAmountOfComments', snap.size);
          firstTime = false;
          return
        }

        const lastIndex = state.comments.length - 1;
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

    async POST_COMMENT({}, payload) {
      try {
        const reference = collection(fireStore, `Games_Info/${payload.game}/comments`);
        const { avatar, text, username, created, admin, userUID } = payload;
        await addDoc(reference, {
          avatar, text, username, created, admin, userUID
        })
      } 
      catch (error) {
        console.error(error);
      }
    },

    async DELETE_COMMENT({}, payload) {
      try {
        const reference = doc(fireStore, `Games_Info/${payload.game}/comments`, `${payload.id}`);
        await deleteDoc(reference);
      } 
      catch (error) {
        console.error(error);
      }
    },

    CLEAR_STATE({commit}) {
      commit('setComments', null);
      commit('setLatestDoc', null);
      commit('setAmountOfComments', null);
    }
  }
}