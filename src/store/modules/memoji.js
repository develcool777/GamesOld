import { fireStore } from "@/firebase"
import { collection, getDocs } from "firebase/firestore";

export default {
  namespaced: true,
  state: {
    data: []
  },
  getters: {
    getData: state => state.data
  },
  mutations: {
    setData(state, arr=[]) {
      if (!Array.isArray(arr)) {
        throw Error(`memoji.mutation.setData(state, arr=[]) arr must Array`);
      }
      state.data = arr;
    }
  },
  actions: {
    async GET_DATA({commit}) {
      try {
        const reference = collection(fireStore, 'Memoji_levels');
        const levels = await getDocs(reference);
        const data = levels.docs.map(doc => {
          const obj = doc.data();
          obj.level = +doc.id;
          return obj;
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
    }
  } 
}