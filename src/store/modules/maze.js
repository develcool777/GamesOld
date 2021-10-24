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

    setData(state, arr=[]) {
      if (!Array.isArray(arr)) {
        throw Error(`maze.mutation.setData arr must Array`);
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
      const reference = collection(fireStore, 'Maze_levels');
      const levels = await getDocs(reference);
      levels.docs.forEach(doc => {
        const data = doc.data();
        data.field = data.field.map(obj => Object.values(obj).pop());
        data.level = +doc.id
        DATA.push(data)
      })
      commit('setData', DATA);
    }
  } 
}