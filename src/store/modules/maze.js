import { fireStore } from "@/firebase"
import { collection, getDocs } from "firebase/firestore";

export default {
  namespaced: true,
  state: {
    arrowClicked: 0,
    showPath: false,
    showHint: false,
    data: []
  },
  getters: {
    getArrowClicked: state => state.arrowClicked,
    getShowPath: state => state.showPath,
    getShowHint: state => state.showHint,
    getData: state => state.data
  },
  mutations: {  
    changeArrowClicked(state, number) {
      if (!Number.isInteger(number)) {
        throw Error(`maze.mutation.changeArrowClicked(state, number) number must Integer`);
      }
      state.arrowClicked = number;
    }, 

    changeShowPath(state, bool) {
      if (typeof bool !== 'boolean') {
        throw Error(`maze.mutation.changeShowPath(state, bool) bool must Boolean`);
      }
      state.showPath = bool;
    },

    changeShowHint(state, bool) {
      if (typeof bool !== 'boolean') {
        throw Error(`maze.mutation.changeShowHint(state, bool) bool must Boolean`);
      }
      state.showHint = bool;
    },

    setData(state, arr=[]) {
      if (!Array.isArray(arr)) {
        throw Error(`maze.mutation.setData(state, arr=[]) arr must Array`);
      }
      state.data = arr;
    },
  },

  actions: {
    INIT_STATE({commit}) {
      commit('changeArrowClicked', 0);
      commit('changeShowHint', false);
    },

    CHANGE_ARROW({commit}, arrow) {
      if (!Number.isInteger(arrow)) {
        throw Error(`maze.actions.CHANGE_ARROW({commit}, arrow) arrow must Integer`);
      }
      commit('changeArrowClicked', arrow);
    },

    CHANGE_SHOW_PATH({commit}, bool) {
      if (typeof bool !== 'boolean') {
        throw Error(`maze.actions.CHANGE_SHOW_PATH({commit}, bool) bool must Boolean`);
      }
      commit('changeShowPath', bool);
    },

    CHANGE_SHOW_HINT({commit}, bool) {
      if (typeof bool !== 'boolean') {
        throw Error(`maze.actions.CHANGE_SHOW_HINT({commit}, bool) bool must Boolean`);
      }
      commit('changeShowHint', bool);
    },

    async SET_DATA({commit}) {
      try {
        const reference = collection(fireStore, 'Maze_levels');
        const levels = await getDocs(reference);
        const data = levels.docs.map(doc => {
          const object = doc.data();
          object.field = object.field.map(obj => Object.values(obj).pop());
          object.level = +doc.id;
          return object;
        })
        commit('setData', data);
      } 
      catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error({errorCode, errorMessage});
      }
    },

    CLEAR_STATE({commit}) {
      commit('setData', []);
      commit('changeArrowClicked', 0);
      commit('changeShowPath', false);
      commit('changeShowHint', false);
    }
  } 
}