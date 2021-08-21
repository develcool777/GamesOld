import firebase from 'firebase/app';
import "firebase/firestore";

export default {
  namespaced: true,
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
    result: '',
    showPath: false,
    showHint: false,
    data: []
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
    getShowHint: state => state.showHint,
    getData: state => state.data
  },
  mutations: {
    changeGameFinished(state, bool) {
      if (typeof bool !== 'boolean') {
        throw Error(`maze.mutation.changeGameFinished bool must Boolean`);
      }
      state.gameFinished = bool;
    },

    changeIsPlaying(state, bool) {
      if (typeof bool !== 'boolean') {
        throw Error(`maze.mutation.changeIsPlaying bool must Boolean`);
      }
      state.isPlaying = bool;
    },

    changeStopClickArrows(state, bool) {
      if (typeof bool !== 'boolean') {
        throw Error(`maze.mutation.changeStopClickArrows bool must Boolean`);
      }
      state.stopClickArrows = bool;
    },

    changeTimer(state, seconds) {
      if (seconds === undefined) {
        state.timer = state.timeForReset;
      } else {
        state.timer = seconds;
      }
    },

    changeRestart(state, bool) {
      if (typeof bool !== 'boolean') {
        throw Error(`maze.mutation.changeRestart bool must Boolean`);
      }
      state.restart = bool;
    },

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

    changeResult(state, result='') {
      if (typeof result !== 'string') {
        throw Error(`maze.mutation.changeResult result must String`);
      }
      state.result = result;
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

    setTimeForReset(state) {
      state.timeForReset = state.timer;
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
      commit('changeTimer', payload.seconds);
      commit('setTimeForReset');
      commit('changeGameFinished', false);
      commit('changeIsPlaying', false);
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
      commit('changeIsPlaying', false);
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
      console.log(DATA)
      commit('setData', DATA);
    }
  } 
}