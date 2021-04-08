import { createStore } from 'vuex'

export default createStore({
  state: {
    gameFinished: false,
    isPlaying: false,
    stopClickArrows: true,
    timer: 0,
    restart: false,
    timeForReset: 0,
    level: 1,
    amountOfLevels: 0,
    arrowClicked: 0,
    result: ''
  },
  getters: {
    getGameFinished: state => state.gameFinished,
    getIsPlaying: state => state.isPlaying,
    getStopClickArrows: state => state.stopClickArrows,
    getTimer: state => state.timer,
    getTimeForReset: state => state.timeForReset,
    getLevel: state => state.level,
    getAmountOfLevels: state => state.amountOfLevels,
    getArrowClicked: state => state.arrowClicked,
    getResult: state => state.result
  },
  mutations: {
    changeGameFinished(state, boolean) {
      state.gameFinished = boolean;
    },
    changeIsPlaying(state, boolean) {
      state.isPlaying = boolean;
    },
    changeStopClickArrows(state, boolean) {
      state.stopClickArrows = boolean;
    },
    changeTimer(state, seconds) {
      if (seconds === undefined) {
        state.timer = state.timeForReset;
      } else {
        state.timer = seconds;
      }
    },
    changeRestart(state, boolean) {
      state.restart = boolean;
    },
    changeLevel(state, level) {
      state.level = level;
    },  
    changeArrowClicked(state, number) {
      state.arrowClicked = number;
    }, 
    changeResult(state, result='') {
      state.result = result;
    }, 
    setAmountOfLevels(state, levels) {
      state.amountOfLevels = levels;
    },
    setTimeForReset(state) {
      state.timeForReset = state.timer;
    },
  },
  actions: {
    INIT_STATE({commit}, payload) {
      commit('changeLevel', payload.level);
      commit('changeTimer', payload.seconds);
      commit('setTimeForReset');
      commit('changeGameFinished', payload.isFinished);
      commit('changeIsPlaying', payload.isPlaying);
      commit('setAmountOfLevels', payload.amountOfLevels);
      commit('changeStopClickArrows', payload.stopClick);
      commit('changeArrowClicked', payload.arrowClicked);
    },
    CHANGE_LEVEl({commit}, level) {
      commit('changeLevel', level);
    },
    CHANGE_TIMER({commit}, seconds) {
      commit('changeTimer', seconds);
    },
    CHANGE_ISPLAYING({commit}, boolean) {
      commit('changeIsPlaying', boolean);
    },
    END_GAME({commit}, result) {
      commit('changeGameFinished', true);
      commit('changeIsPlaying', false);
      commit('changeResult', result);
    },
    CLEAN_GAME({commit}) {
      commit('changeGameFinished', false);
      commit('changeResult', '');
      commit('changeTimer');
    },
    CHANGE_RESTART({commit}, boolean) {
      commit('changeRestart', boolean);
    },
    CHANGE_ARROW({commit}, arrow) {
      commit('changeArrowClicked', arrow);
    },
    CHANGE_STOP_CLICK({commit}, boolean) {
      commit('changeStopClickArrows', boolean)
    }
  }
})