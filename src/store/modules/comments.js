import { fireStore } from "@/firebase"
import { 
  doc, collection, getDocs, 
  addDoc, onSnapshot, deleteDoc, 
  query, orderBy, limit, startAfter,
} from "firebase/firestore";

export default {
  namespaced: true,
  state: {
    comments: [],
    latestDoc: null,
    amountOfComments: 0,
  },
  getters: {
    getComments: state => state.comments,
    getLatestDoc: state => state.latestDoc,
    getAmountOfComments: state => state.amountOfComments,
  },
  mutations: {
    setComments(state, comments) {
      if (!Array.isArray(comments)) {
        throw Error(`comments.mutations.setComments(state, comments) comments must be Array`);
      }
      state.comments = comments;
    },

    updateComments(state, payload) {
      if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
        throw Error(`comments.mutations.updateComments(state, payload) payload must be String`);
      }
      if (!['comments', 'amountOfCommentsInFirestore'].every(prop => Object.prototype.hasOwnProperty.call(payload, prop))) {
        throw Error(`comments.mutations.updateComments(state, payload) payload must be Object with keys: 'comments', 'amountOfCommentsInFirestore'`);
      }
      if (!Array.isArray(payload.comments)) {
        throw Error(`comments.mutations.updateComments(state, payload) payload.comments must be Array`);
      }
      if (!Number.isInteger(payload.amountOfCommentsInFirestore)) {
        throw Error(`comments.mutations.updateComments(state, payload) payload.amountOfCommentsInFirestore must be Integer`);
      }
      state.comments = payload.comments;
      state.amountOfComments = payload.amountOfCommentsInFirestore;
    },

    moreComments(state, comments) {
      if (!Array.isArray(comments)) {
        throw Error(`comments.mutations.moreComments(state, comments) comments must be Array`);
      }
      state.comments.push(...comments);
    },

    setLatestDoc(state, doc) {
      state.latestDoc = doc;
    },

    setAmountOfComments(state, amount) {
      if (!Number.isInteger(amount)) {
        throw Error(`comments.mutations.setAmountOfComments(state, amount) amount must be Integer`);
      }
      state.amountOfComments = amount;
    }
  },
  actions: {
    async GET_DATA({commit, dispatch}, payload) {
      if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
        throw Error(`comments.actions.GET_DATA({commit, dispatch}, payload) payload must be Object`);
      }
      if (!['gameName', 'listener'].every(prop => Object.prototype.hasOwnProperty.call(payload, prop))) {
        throw Error(`comments.actions.GET_DATA({commit, dispatch}, payload) payload must be Object with keys: 'gameName', 'listener'`);
      }
      if (typeof payload.gameName !== 'string') {
        throw Error(`comments.actions.GET_DATA({commit, dispatch}, payload) payload.gameName must be String`);
      }
      if (typeof payload.listener !== 'boolean') {
        throw Error(`comments.actions.GET_DATA({commit, dispatch}, payload) payload.listener must be Boolean`);
      }
      try {
        const comments = await dispatch('GET_COMMENTS', payload) || [];
        commit('setComments', comments);
      } 
      catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error({errorCode, errorMessage});
      }
    },

    async GET_COMMENTS({state, commit}, payload) {
      if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
        throw Error(`comments.actions.GET_COMMENTS({state, commit}, payload) payload must be Object`);
      }
      if (!['gameName', 'listener'].every(prop => Object.prototype.hasOwnProperty.call(payload, prop))) {
        throw Error(`comments.actions.GET_COMMENTS({state, commit}, payload) payload must be Object with keys: 'gameName', 'listener'`);
      }
      if (typeof payload.gameName !== 'string') {
        throw Error(`comments.actions.GET_COMMENTS({state, commit}, payload) payload.gameName must be String`);
      }
      if (typeof payload.listener !== 'boolean') {
        throw Error(`comments.actions.GET_COMMENTS({state, commit}, payload) payload.listener must be Boolean`);
      }
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
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error({errorCode, errorMessage});
      }
    }, 

    LISTENER_FOR_COMMENTS({state, dispatch, commit}, gameName) {
      if (typeof gameName !== 'string' ) {
        throw Error(`comments.actions.LISTENER_FOR_COMMENTS({state, dispatch, commit}, gameName) gameName must be String`);
      }
      try {
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
      } 
      catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error({errorCode, errorMessage});
      }

    },

    async LOAD_MORE_COMMENTS({dispatch, commit}, gameName) {
      if (typeof gameName !== 'string' ) {
        throw Error(`comments.actions.LOAD_MORE_COMMENTS({dispatch, commit}, gameName) gameName must be String`);
      }
      try {
        const comments = await dispatch('GET_COMMENTS', {gameName, listener: false});
        commit('moreComments', comments);
      } 
      catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error({errorCode, errorMessage});
      }
    },

    async POST_COMMENT({}, payload) {
      if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
        throw Error(`comments.actions.POST_COMMENT({}, payload) payload must be Object`);
      }
      if (!['avatar', 'text', 'username', 'created', 'admin', 'userUID', 'game'].every(prop => Object.prototype.hasOwnProperty.call(payload, prop))) {
        throw Error(`comments.actions.POST_COMMENT({}, payload) payload must be Object with keys: 'avatar', 'text', 'username', 'created', 'admin', 'userUID', 'game'`);
      }
      if (typeof payload.avatar !== 'string') {
        throw Error(`comments.actions.POST_COMMENT({}, payload) payload.avatar must be String`);
      }
      if (typeof payload.text !== 'string') {
        throw Error(`comments.actions.POST_COMMENT({}, payload) payload.text must be String`);
      }
      if (typeof payload.username !== 'string') {
        throw Error(`comments.actions.POST_COMMENT({}, payload) payload.username must be String`);
      }
      if (!Number.isInteger(payload.created)) {
        throw Error(`comments.actions.POST_COMMENT({}, payload) payload.created must be Integer`);
      }
      if (typeof payload.admin !== 'boolean') {
        throw Error(`comments.actions.POST_COMMENT({}, payload) payload.admin must be Boolean`);
      }
      if (typeof payload.userUID !== 'string') {
        throw Error(`comments.actions.POST_COMMENT({}, payload) payload.userUID must be String`);
      }
      if (typeof payload.game !== 'string') {
        throw Error(`comments.actions.POST_COMMENT({}, payload) payload.game must be String`);
      }
      try {
        const reference = collection(fireStore, `Games_Info/${payload.game}/comments`);
        const { avatar, text, username, created, admin, userUID } = payload;
        await addDoc(reference, {
          avatar, text, username, created, admin, userUID
        })
      } 
      catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error({errorCode, errorMessage});
      }
    },

    async DELETE_COMMENT({}, payload) {
      if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
        throw Error(`comments.actions.DELETE_COMMENT({}, payload) payload must be Object`);
      }
      if (!['id', 'game'].every(prop => Object.prototype.hasOwnProperty.call(payload, prop))) {
        throw Error(`comments.actions.DELETE_COMMENT({}, payload) payload must be Object with keys: 'id', 'game'`);
      }
      if (typeof payload.id !== 'string') {
        throw Error(`comments.actions.DELETE_COMMENT({}, payload) payload.id must be String`);
      }
      if (typeof payload.game !== 'string') {
        throw Error(`comments.actions.DELETE_COMMENT({}, payload) payload.game must be String`);
      }
      try {
        const reference = doc(fireStore, `Games_Info/${payload.game}/comments`, `${payload.id}`);
        await deleteDoc(reference);
      } 
      catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error({errorCode, errorMessage});
      }
    },

    CLEAR_STATE({commit}) {
      commit('setComments', []);
      commit('setLatestDoc', null);
      commit('setAmountOfComments', 0);
    }
  }
}