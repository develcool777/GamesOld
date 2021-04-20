export default {
  namespaced: true,
  state: {
    gameFinished: false,
    isPlaying: undefined,
    restart: false,
    showHint: false,
    level: null,
    amountOfLevels: null,
    timer: null,
    timeForReset: null,
    itemsForCompare: []
  },
  getters: {
    getGameFinished: state => state.gameFinished,
    getIsPlaying: state => state.isPlaying,
    getShowHint: state => state.showHint,
    getLevel: state => state.level,
    getAmountOfLevels: state => state.amountOfLevels,
    getTimer: state => state.timer,
    getTimeForReset: state => state.timeForReset,
    getItemsForCompare: state => state.itemsForCompare
  },
  mutations: {
    changeGameFinished(state, boolean) {
      state.gameFinished = boolean;
    },
    changeIsPlaying(state, boolean) {
      state.isPlaying = boolean;
    },
    changeRestart(state, boolean) {
      state.restart = boolean;
    },
    changeShowHint(state, boolean) {
      state.showHint = boolean;
    },
    changeLevel(state, level) {
      state.level = level;
    },
    setAmountOfLevels(state, levels) {
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
      state.timeForReset = seconds;
    },
    AddItemsForCompare(state, item) {
      state.itemsForCompare.push(item);
    },
    removeItemsForCompare(state) {
      state.itemsForCompare.splice(0);
    }
  },
  actions: {
    INIT_STATE({commit}, payload) {
      commit('setTimeForReset', payload.time);
      commit('changeTimer', payload.time);
      commit('changeLevel', payload.level);
      commit('setAmountOfLevels', payload.levels);
      commit('changeIsPlaying', undefined);
      commit('changeGameFinished', false);
      commit('removeItemsForCompare');
    },
    ADD_ITEMS_FOR_COMPARE({commit}, item) {
      commit('AddItemsForCompare', item);
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
      commit('changeIsPlaying', undefined);
      // commit('changeResult', '');
      commit('changeTimer');
      commit('changeShowHint', false);
    },
    CHANGE_SHOW_HINT({commit}, boolean) {
      commit('changeShowHint', boolean);
    }
  } 
}