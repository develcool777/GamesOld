import { createStore } from 'vuex'

export default createStore({
  state: {
    gameFinished: false,
    isPlaying: undefined,
    stopClickArrows: true,
    timer: 0,
    restart: false,
    timeForReset: 0,
    level: 1,
    amountOfLevels: 0,
    arrowClicked: 0,
    result: '',
    showPath: false,
    showHint: false
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
    getResult: state => state.result,
    getShowPath: state => state.showPath,
    getShowHint: state => state.showHint
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
    changeShowPath(state, boolean) {
      state.showPath = boolean
    },
    changeShowHint(state, boolean) {
      state.showHint = boolean
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
      commit('changeGameFinished', false);
      commit('changeIsPlaying', undefined);
      commit('setAmountOfLevels', payload.amountOfLevels);
      commit('changeStopClickArrows', true);
      commit('changeArrowClicked', 0);
      commit('changeShowHint', false);
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
      commit('changeIsPlaying', undefined);
      commit('changeShowHint', false);
    },
    CHANGE_RESTART({commit}, boolean) {
      commit('changeRestart', boolean);
    },
    CHANGE_ARROW({commit}, arrow) {
      commit('changeArrowClicked', arrow);
    },
    CHANGE_STOP_CLICK({commit}, boolean) {
      commit('changeStopClickArrows', boolean);
    },
    CHANGE_SHOW_PATH({commit}, boolean) {
      commit('changeShowPath', boolean);
    },
    CHANGE_SHOW_HINT({commit}, boolean) {
      commit('changeShowHint', boolean);
    }
  }
})