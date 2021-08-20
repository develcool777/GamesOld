import firebase from 'firebase/app';
import "firebase/firestore";

export default {
  namespaced: true,
  state: {
    gameFinished: false,
    isPlaying: false,
    restart: false,
    showHint: false,
    level: null,
    amountOfLevels: null,
    timer: null,
    timeForReset: null,
    itemsForCompare: [],
    result: '',
    data: []
  },
  getters: {
    getGameFinished: state => state.gameFinished,
    getIsPlaying: state => state.isPlaying,
    getRestart: state => state.restart,
    getShowHint: state => state.showHint,
    getLevel: state => state.level,
    getAmountOfLevels: state => state.amountOfLevels,
    getTimer: state => state.timer,
    getTimeForReset: state => state.timeForReset,
    getItemsForCompare: state => state.itemsForCompare,
    getResult: state => state.result,
    getData: state => state.data
  },
  mutations: {
    changeGameFinished(state, bool) {
      if (typeof bool !== 'boolean') {
        throw Error(`memoji.mutation.changeGameFinished bool must Boolean`);
      }
      state.gameFinished = bool;
    },
    changeIsPlaying(state, bool) {
      if (typeof bool !== 'boolean') {
        throw Error(`memoji.mutation.changeIsPlaying bool must Boolean`);
      }
      state.isPlaying = bool;
    },
    changeRestart(state, bool) {
      if (typeof bool !== 'boolean') {
        throw Error(`memoji.mutation.changeRestart bool must Boolean`);
      }
      state.restart = bool;
    },
    changeShowHint(state, bool) {
      if (typeof bool !== 'boolean') {
        throw Error(`memoji.mutation.changeShowHint bool must Boolean`);
      }
      state.showHint = bool;
    },
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
    changeTimer(state, seconds) {
      if (seconds === undefined) {
        state.timer = state.timeForReset;
      } else {
        state.timer = seconds;
      }
    },
    setTimeForReset(state, seconds) {
      if (!Number.isInteger(seconds)) {
        throw Error(`memoji.mutation.setTimeForReset seconds must Integer`);
      }
      state.timeForReset = seconds;
    },
    addItemsForCompare(state, item) {
      if (typeof item !== 'object' && item !== null) {
        throw Error(`memoji.mutation.addItemsForCompare item must Object`);
      }
      state.itemsForCompare.push(item);
    },
    removeItemsForCompare(state) {
      state.itemsForCompare.splice(0);
    },
    changeResult(state, result='') {
      if (typeof result !== 'string') {
        throw Error(`memoji.mutation.changeResult result must String`);
      }
      state.result = result;
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
      commit('setTimeForReset', payload.time);
      commit('changeTimer', payload.time);
      commit('changeLevel', payload.level);
      commit('setAmountOfLevels', payload.levels);
      commit('changeIsPlaying', false);
      commit('changeGameFinished', false);
      commit('removeItemsForCompare');
    },
    ADD_ITEMS_FOR_COMPARE({commit}, item) {
      commit('addItemsForCompare', item);
    },
    REMOVE_ITEMS_FOR_COMPARE({commit}) {
      commit('removeItemsForCompare');
    },
    CHANGE_RESTART({commit}, boolean) {
      commit('changeRestart', boolean);
    },
    CHANGE_TIMER({commit}, seconds) {
      commit('changeTimer', seconds);
    },
    CHANGE_ISPLAYING({commit}, boolean) {
      commit('changeIsPlaying', boolean);
    },
    CHANGE_LEVEl({commit}, level) {
      commit('changeLevel', level);
    },
    CLEAN_GAME({commit}) {
      commit('changeGameFinished', false);
      commit('changeIsPlaying', false)
      commit('changeResult', '');
      commit('changeTimer');
      commit('changeShowHint', false);
    },
    END_GAME({commit}, result) {
      commit('changeGameFinished', true);
      commit('changeIsPlaying', false);
      commit('changeResult', result);
    },
    CHANGE_SHOW_HINT({commit}, boolean) {
      commit('changeShowHint', boolean);
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