export default {
  namespaced: true,
  state: {
    isPlaying: false,
    clear: false,
    returnMove: false,
    playingWithComputer: false,
    compSettings: {
      userSide: 'x',
      compSide: 'o',
      difficulty: 'easy',
    },
    winner: ''
  },
  getters: {
    getIsPlaying: state => state.isPlaying,
    getClear: state => state.clear,
    getReturnMove: state => state.returnMove,
    getPlayingWithComputer: state => state.playingWithComputer,
    getCompSettings: state => state.compSettings,
    getWinner: state => state.winner,
  },
  mutations: {
    changeIsPlaying(state, bool) {
      if (typeof bool !== 'boolean') {
        throw Error(`ticTacToe.mutation.changeIsPlaying bool must Boolean`);
      }
      state.isPlaying = bool;
    },

    changeClear(state, bool) {
      if (typeof bool !== 'boolean') {
        throw Error(`ticTacToe.mutation.changeClear bool must Boolean`);
      }
      state.clear = bool;
    },

    changeReturnMove(state, bool) {
      if (typeof bool !== 'boolean') {
        throw Error(`ticTacToe.mutation.changeReturnMove bool must Boolean`);
      }
      state.returnMove = bool;
    },

    changeWithComputer(state, bool) {
      if (typeof bool !== 'boolean') {
        throw Error(`ticTacToe.mutation.changeWithComputer bool must Boolean`);
      }
      state.playingWithComputer = bool;
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
    },

    changeWinner(state, str) {
      if (typeof str !== 'string') {
        throw Error(`ticTacToe.mutation.changeWinner str must String`);
      }
      state.winner = str;
    },
  },
  actions: {
    INIT_STATE({commit}) {
      commit('changeIsPlaying', false);
      commit('changeClear', false);
      commit('changeReturnMove', false);
      commit('changeWithComputer', false);
      const obj = {
        userSide: 'x',
        compSide: 'o',
        difficulty: 'easy',
      }
      commit('changeCompSettings', obj);
      commit('changeWinner', '');
    },

    CHANGE_IS_PLAYING({commit}, boolean) {
      commit('changeIsPlaying', boolean);     
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
    }
  }
}
