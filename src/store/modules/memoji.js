export default {
  namespaced: true,
  state: {
    gameFinished: false,
    isPlaying: false,
    level: null,
    amountOfLevels: null,
    // amountOfClicks: 0,
    timer: null,
    timeForReset: null,
    itemsForCompare: []
  },
  getters: {
    getGameFinished: state => state.gameFinished,
    getIsPlaying: state => state.isPlaying,
    getLevel: state => state.level,
    getAmountOfLevels: state => state.amountOfLevels,
    // getAmountOfClicks: state => state.amountOfClicks,
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
    changeLevel(state, level) {
      state.level = level;
    },
    setAmountOfLevels(state, levels) {
      state.amountOfLevels = levels;
    },
    // changeAmountOfClicks(state, number) {
    //   state.amountOfClicks = number;
    // },
    changeTimer(state, seconds) {
      state.timer = seconds;
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
      // commit('changeAmountOfClicks', 0);
      commit('changeIsPlaying', false);
      commit('changeGameFinished', false);
      commit('removeItemsForCompare');
    },
    // CHANGE_AMOUNT_OF_CLICKS({commit}, number) {
    //   commit('changeAmountOfClicks', number);
    // },
    ADD_ITEMS_FOR_COMPARE({commit}, item) {
      commit('AddItemsForCompare', item);
    },
    REMOVE_ITEMS_FOR_COMPARE({commit}) {
      commit('removeItemsForCompare');
    }
  } 
}