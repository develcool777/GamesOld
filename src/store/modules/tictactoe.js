export default {
  namespaced: true,
  state: {
    clear: false,
    returnMove: false,
    playingWithComputer: false,
    computerStarted: false,
    compSettings: {
      userSide: 'x',
      compSide: 'o',
      difficulty: 'easy',
      showStartButton: false,
    },
    winner: ''
  },
  getters: {
    getClear: state => state.clear,
    getReturnMove: state => state.returnMove,
    getPlayingWithComputer: state => state.playingWithComputer,
    getComputerStarted: state => state.computerStarted,
    getCompSettings: state => state.compSettings,
    getWinner: state => state.winner,
  },
  mutations: {
    changeClear(state, boolean) {
      state.clear = boolean;
    },
    changeReturnMove(state, boolean) {
      state.returnMove = boolean;
    },
    changeWithComputer(state, boolean) {
      state.playingWithComputer = boolean;
    },
    changeComputerStarted(state, boolean) {
      state.computerStarted = boolean;
    },
    changeCompSettings(state, obj) {
      if (obj.userSide !== undefined) {
        state.compSettings.userSide = obj.userSide;
      }
      if (obj.compSide !== undefined) {
        state.compSettings.compSide = obj.compSide;
      }
      if (obj.difficulty !== undefined) {
        state.compSettings.difficulty = obj.difficulty;
      }
      if (obj.startButton !== undefined) {
        state.compSettings.showStartButton = obj.startButton;
      }
    },
    changeWinner(state, string) {
      state.winner = string;
    },
  },
  actions: {
    INIT_STATE({commit}) {
      commit('changeClear', false);
      commit('changeReturnMove', false);
      commit('changeWithComputer', false);
      const obj = {
        userSide: 'x',
        compSide: 'o',
        difficulty: 'easy',
        startButton: false,
      }
      commit('changeCompSettings', obj);
      commit('changeWinner', '');
    },
    CHANGE_CLEAR({commit}, boolean) {
      commit('changeClear', boolean);     
    },
    CHANGE_RETURN_MOVE({commit}, boolean) {
      commit('changeReturnMove', boolean);     
    },
    CHANGE_PLAYING_WITH_COMPUTER({commit}, boolean) {
      commit('changeWithComputer', boolean);     
    },
    CHANGE_COMPUTER_SETTINGS({commit}, obj) {
      commit('changeCompSettings', obj);     
    },
    CHANGE_WINNER({commit}, string) {
      commit('changeWinner', string);     
    },
    CHANGE_COMPUTER_STARTED({commit}, boolean) {
      commit('changeComputerStarted', boolean);     
    },
  }
}