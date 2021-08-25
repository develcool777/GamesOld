import firebase from 'firebase/app';
import "firebase/firestore";

export default {
  namespaced: true,
  state: {
    level: 1,
    amountOfLevels: 0,
    arrowClicked: 0,
    showPath: false,
    showHint: false,
    data: []
  },
  getters: {
    getLevel: state => state.level,
    getAmountOfLevels: state => state.amountOfLevels,
    getArrowClicked: state => state.arrowClicked,
    getShowPath: state => state.showPath,
    getShowHint: state => state.showHint,
    getData: state => state.data
  },
  mutations: {
    changeLevel(state, level) {
      if (!Number.isInteger(level)) {
        throw Error(`maze.mutation.changeLevel level must Integer`);
      }
      state.level = level;
    },  

    changeArrowClicked(state, number) {
      if (!Number.isInteger(number)) {
        throw Error(`maze.mutation.changeArrowClicked number must Integer`);
      }
      state.arrowClicked = number;
    }, 

    changeShowPath(state, bool) {
      if (typeof bool !== 'boolean') {
        throw Error(`maze.mutation.changeShowPath bool must Boolean`);
      }
      state.showPath = bool;
    },

    changeShowHint(state, bool) {
      if (typeof bool !== 'boolean') {
        throw Error(`maze.mutation.changeShowHint bool must Boolean`);
      }
      state.showHint = bool;
    },

    setAmountOfLevels(state, levels) {
      if (!Number.isInteger(levels)) {
        throw Error(`maze.mutation.setAmountOfLevels levels must Integer`);
      }
      state.amountOfLevels = levels;
    },

    setData(state, arr=[]) {
      if (!Array.isArray(arr)) {
        throw Error(`maze.mutation.setData arr must Array`);
      }
      state.data = arr;
    },
  },

  actions: {
    INIT_STATE({commit}, payload) {
      commit('changeLevel', payload.level);
      commit('setAmountOfLevels', payload.amountOfLevels);
      commit('changeArrowClicked', 0);
      commit('changeShowHint', false);
    },

    CHANGE_LEVEl({commit}, level) {
      commit('changeLevel', level);
    },

    CHANGE_ARROW({commit}, arrow) {
      commit('changeArrowClicked', arrow);
    },

    CHANGE_SHOW_PATH({commit}, boolean) {
      commit('changeShowPath', boolean);
    },

    CHANGE_SHOW_HINT({commit}, boolean) {
      commit('changeShowHint', boolean);
    },

    async SET_DATA({commit}) {
      const DATA = [];
      const db = firebase.firestore();
      const collection = await db.collection('Maze_levels').get();
      collection.docs.forEach(doc => {
        const data = doc.data();
        data.field = data.field.map(obj => Object.values(obj).pop());
        data.level = +doc.id
        DATA.push(data)
      })
      commit('setData', DATA);
    }
  } 
}