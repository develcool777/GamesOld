import firebase from 'firebase/app';
import "firebase/firestore";

export default {
  namespaced: true,
  state: {
    level: null,
    amountOfLevels: null,
    data: []
  },
  getters: {
    getLevel: state => state.level,
    getAmountOfLevels: state => state.amountOfLevels,
    getData: state => state.data
  },
  mutations: {
    changeLevel(state, level) {
      if (!Number.isInteger(level)) {
        throw Error(`memoji.mutation.changeLevel level must Integer`);
      }
      state.level = level;
    },

    setAmountOfLevels(state, levels) {
      if (!Number.isInteger(levels)) {
        throw Error(`memoji.mutation.setAmountOfLevels levels must Integer`);
      }
      state.amountOfLevels = levels;
    },

    setData(state, arr=[]) {
      if (!Array.isArray(arr)) {
        throw Error(`memoji.mutation.setData arr must Array`);
      }
      state.data = arr;
    }
  },
  actions: {
    INIT_STATE({commit}, payload) {
      commit('changeLevel', payload.level);
      commit('setAmountOfLevels', payload.levels);
    },

    CHANGE_LEVEl({commit}, level) {
      commit('changeLevel', level);
    },
    
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