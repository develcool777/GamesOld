import { fireStore } from "@/firebase"
import { collection, getDocs, getDoc, doc, updateDoc } from "firebase/firestore";

export default {
  namespaced: true,
  state: {
    data: [],
    parsedData: [],
    isDataLoaded: false,
  },
  getters: {
    getData: state => state.data,
    getParsedData: state => state.parsedData,
    getIsDataLoaded: state => state.isDataLoaded,   
  },
  mutations: {
    setData(state, data) {
      state.data = data;
    },
    setParsedData(state, data) {
      state.parsedData = data;
    },
    changeIsDataLoaded(state, boolean) {
      state.isDataLoaded = boolean;
    },
  },
  actions: {
    async INIT({commit, dispatch}) {
      const DATA = [];
      const reference = collection(fireStore, 'Games');
      const games = await getDocs(reference);
      games.docs.forEach(doc => {
        const data = doc.data();
        data.docID = doc.id;
        DATA.push(data);
      })

      DATA.sort((a, b) => a.id - b.id);

      commit('setData', DATA);
      dispatch('PARSE_DATA');
      commit('changeIsDataLoaded', true);
    },

    PARSE_DATA({commit, state}) {
      const DATA = state.data;
      const parsedData = DATA.map(data => {
        const obj = {};
        obj.id = data.id;
        obj.name = data.name;
        return obj;
      })

      commit('setParsedData', parsedData)
    },

    async UPDATE_PLAYED({ commit }, docId) {
      const reference = doc(fireStore, 'Games', docId);
      const document = await getDoc(reference);
      await updateDoc(reference, {
        played: document.data().played + 1
      })
      
      commit('changeIsDataLoaded', true);
    }
  }
}