import firebase from 'firebase/app';
import "firebase/firestore";

export default {
  namespaced: true,
  state: {
    data: []
  },
  getters: {
    getData: state => state.data
  },
  mutations: {
    setData(state, arr=[]) {
      if (!Array.isArray(arr)) {
        throw Error(`memoji.mutation.setData arr must Array`);
      }
      state.data = arr;
    }
  },
  actions: {
    async GET_DATA({commit}) {
      const DATA = [];
      const db = firebase.firestore();
      const collection = await db.collection('Memoji_levels').get();
      collection.docs.forEach(doc => {
        const data = doc.data();
        data.level = +doc.id;
        DATA.push(data)
      })
      commit('setData', DATA);
    }
  } 
}