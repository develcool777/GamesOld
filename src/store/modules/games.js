import firebase from 'firebase/app';
import "firebase/firestore";
import "firebase/storage";

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
      const getData = async () => {
        const db = firebase.firestore();
        const collection = await db.collection('Games').get();
        collection.docs.forEach(doc => {
          const data = doc.data();
          data.docID = doc.id;
          DATA.push(data)
        })
      }

      await getData();

      DATA.sort((a, b) => a.id - b.id);
      console.log(DATA);
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
    UPDATE_PLAYED({ commit }, docId) {
      const update = async () => {
        const db = firebase.firestore();
        const doc = await db.collection('Games').doc(docId);
        const docData = await doc.get();
        await doc.update({
          played: docData.data().played + 1
        })
      }
      update();
      commit('changeIsDataLoaded', true);
    }
  }
}