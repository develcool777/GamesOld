export default {
  namespaced: true,
  state: {
    showUser: false,
    whatToShow: 'registration'
  },
  getters: {
    getShowUser: state => state.showUser,
    getWhatToShow: state => state.whatToShow,
  },
  mutations: {
    setShowUser(state, value) {
      if (typeof value !== 'boolean') {
        throw Error(`user.mutation.setShowUser value must Boolean`);
      }
      state.showUser = value;
    },

    setWhatToShow(state, value) {
      if (typeof value !== 'string') {
        throw Error(`user.mutation.setWhatToShow value must String`);
      }
      if (!['registration', 'login', 'account'].includes(value)) {
        throw Error(`user.mutation.setWhatToShow value must 'registration' or 'login' or 'account'`);
      }
      state.whatToShow = value;
    }
  },
  actions: {
    SET_SHOW_USER({commit}, value) {
      commit('setShowUser', value);
    },

    SET_WHAT_TO_SHOW({commit}, value) {
      commit('setWhatToShow', value);
    }
  }
}