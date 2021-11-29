import { fireStore } from "@/firebase"
import { 
  collection, getDocs, doc, updateDoc,
  query, orderBy, where
} from "firebase/firestore";

export default {
  namespaced: true,
  state: {
    data: [],
    searchResult: [],
  },
  getters: {
    getData: state => state.data,
    getSearchResult: state => state.searchResult,
  },
  mutations: {
    setData(state, data) {
      if (!Array.isArray(data)) {
        throw Error(`games.mutations.setData(state, data) data must be Array`);
      }
      state.data = data;
    },
    setSearchResult(state, data) {
      if (!Array.isArray(data)) {
        throw Error(`games.mutations.setSearchResult(state, data) data must be Array`);
      }
      state.searchResult = data;
    },
  },
  actions: {
    async INIT({commit}) {
      try {
        const reference = collection(fireStore, 'Games_Info');
        const q = query(reference, orderBy('created', 'asc'))
        const games = await getDocs(q);
        const data = games.docs.map(doc => {
          const obj = doc.data();
          obj.docID = doc.id;
          return obj;
        })
        commit('setData', data);
      } 
      catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error({errorCode, errorMessage});
      }
    },

    async SEARCH_GAME({commit}, name) {
      if (typeof name !== 'string') {
        throw Error(`games.actions.SEARCH_GAME({commit}, name) name must be String`);
      }
      try {
        const reference = collection(fireStore, 'Games_Info');
        const q = query(reference, where('nameArray', 'array-contains', name));
        const found = await getDocs(q);
        const data = found.docs.map(doc => doc.data());
        commit('setSearchResult', data);
      } 
      catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error({errorCode, errorMessage});
      }
    },

    async UPDATE_PLAYED({}, payload) {
      if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
        throw Error(`games.actions.UPDATE_PLAYED({}, payload) payload must be Object`);
      }
      if (!['docID', 'played'].every(prop => Object.prototype.hasOwnProperty.call(payload, prop))) {
        throw Error(`games.actions.UPDATE_PLAYED({}, payload) payload must be Object with keys: 'docID', 'played'`);
      }
      if (typeof payload.docID !== 'string') {
        throw Error(`games.actions.UPDATE_PLAYED({}, payload) payload.docID must be String`);
      }
      if (!Number.isInteger(payload.played)) {
        throw Error(`games.actions.UPDATE_PLAYED({}, payload) payload.played must be Integer`);
      }
      try {
        const reference = doc(fireStore, 'Games_Info', payload.docID);
        await updateDoc(reference, {
          played: payload.played + 1
        })
      } 
      catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error({errorCode, errorMessage});
      }
    },

    CLEAR_SEARCH({commit}) {
      commit('setSearchResult', []);
    },
  }
}