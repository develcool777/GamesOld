import { fireStore } from "@/firebase"
import { getDocs, collection, addDoc, onSnapshot, doc, updateDoc } from "firebase/firestore";

export default {
  namespaced: true,
  state: {
    rating: 0,
    details: [
      { stars: 5, quantity: 0, procent: 0, name: 'Excellent', color: 'lightgreen' },
      { stars: 4, quantity: 0, procent: 0, name: 'Good', color: 'green' },
      { stars: 3, quantity: 0, procent: 0, name: 'Average', color: `rgb(${218}, ${204}, ${18})` },
      { stars: 2, quantity: 0, procent: 0, name: 'Poor', color: 'orange' },
      { stars: 1, quantity: 0, procent: 0, name: 'Worst', color: 'red' },
    ],
    data: [],
    currentUserRating: null
  },
  getters: {
    getRating: state => state.rating,
    getDetails: state => state.details,
    getCurrentUserRating: state => state.currentUserRating,
    getData: state => state.data, 
  },
  mutations: {
    setRating(state, rating) {
      if (typeof rating !== 'number') {
        throw Error(`rating.mutation.setRating(state, rating) rating must be Number`);
      }
      state.rating = rating;
    },

    setDetails(state, details) {
      if (!Array.isArray(details)) {
        throw Error(`rating.mutation.setDetails(state, details) details must be Array`);
      }
      state.details = details;
    },

    setCurrentUserRating(state, rating) {
      state.currentUserRating = rating;
    },

    setData(state, data) {
      if (!Array.isArray(data)) {
        throw Error(`rating.mutation.setData(state, data) data must be Array`);
      }
      state.data = data;
    }
  },
  actions: {
    async GET_DATA({state, commit, dispatch}, gameName) {
      if (typeof gameName !== 'string') {
        throw Error(`rating.actions.GET_DATA({state, commit, dispatch}, gameName) gameName must be String`);
      }
      try {
        const reference = collection(fireStore, `Games_Info/${gameName}/rating`);
        const detailsSnap = await getDocs(reference);
        const data = detailsSnap.docs.map(doc => doc.data());

        if (data.length === 0) return;

        const details = data.reduce((acc, obj) => {
          if (acc.amount === undefined) {
            acc.amount = data.length;
          }
          acc[obj.stars] = acc[obj.stars] === undefined
            ? 1
            : acc[obj.stars] + 1
          return acc;
        }, {});

        // rating
        let total = 0;
        for (let key in details) {
          if (!['uids', 'amount'].includes(key)) {
            total += +key * details[key]
          }
        }
        const rating = +(total / details.amount).toFixed(1);

        // quantity, procent
        const updatedDetails = state.details.map(obj => {
          obj.quantity = details[obj.stars] || 0;
          obj.procent = Math.round(details[obj.stars] / details.amount * 100) || 0;
          return obj;
        })

        commit('setData', data);
        commit('setDetails', updatedDetails);
        commit('setRating', rating);
        await dispatch('UPDATE_RATING', { gameName, rating });
      } 
      catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error({errorCode, errorMessage});
      }
    }, 

    async UPDATE_RATING({}, payload) {
      if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
        throw Error(`rating.actions.UPDATE_RATING({}, payload) payload must be Object`);
      }
      if (!['gameName', 'rating'].every(prop => Object.prototype.hasOwnProperty.call(payload, prop))) {
        throw Error(`rating.actions.UPDATE_RATING({}, payload) payload must be Object with keys: 'gameName', 'rating'`);
      }
      if (typeof payload.gameName !== 'string') {
        throw Error(`rating.actions.UPDATE_RATING({}, payload) payload.gameName must be String`);
      }
      if (typeof payload.rating !== 'number') {
        throw Error(`rating.actions.UPDATE_RATING({}, payload) payload.rating must be Number`);
      }
      try {
        const reference = doc(fireStore, 'Games_Info', payload.gameName);
        await updateDoc(reference, {
          rating: payload.rating
        })
      } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error({errorCode, errorMessage});
      }
    },

    USER_RAITING({commit, state}, userUid) {
      if (typeof userUid !== 'string') {
        throw Error(`rating.actions.USER_RAITING({commit, state}, payload) userUid must be String`);
      }
      const userRate = state.data.find(obj => obj.uid === userUid);
      userRate && commit('setCurrentUserRating', userRate);
    },

    async POST({}, payload) {
      if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
        throw Error(`rating.actions.POST({}, payload) payload must be Object`);
      }
      if (!['gameName', 'uid', 'stars'].every(prop => Object.prototype.hasOwnProperty.call(payload, prop))) {
        throw Error(`rating.actions.POST({}, payload) payload must be Object with keys: 'gameName', 'uid', 'stars'`);
      }
      if (typeof payload.gameName !== 'string') {
        throw Error(`rating.actions.POST({}, payload) payload.gameName must be String`);
      }
      if (typeof payload.uid !== 'string') {
        throw Error(`rating.actions.POST({}, payload) payload.uid must be String`);
      }
      if (!Number.isInteger(payload.stars)) {
        throw Error(`rating.actions.POST({}, payload) payload.stars must be Integer`);
      }
      try {
        const reference = collection(fireStore, `Games_Info/${payload.gameName}/rating`);
        const { uid, stars } = payload;
        await addDoc(reference, { uid, stars });
      } 
      catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error({errorCode, errorMessage});
      }
    }, 

    LISTENER({state, dispatch}, gameName) {
      if (typeof gameName !== 'string') {
        throw Error(`rating.actions.LISTENER({state, dispatch}, gameName) gameName must be String`);
      }
      const reference = collection(fireStore, `Games_Info/${gameName}/rating`);
      let firstTime = true;
      const unsubscribe = onSnapshot(reference, async snap => {
        if (firstTime) {
          firstTime = false;
          return;
        }

        if (snap.size !== state.details?.amount) {
          await dispatch('GET_DATA', gameName);
        }
      })
      return unsubscribe;
    },

    SET_CURRENT_USER_RATING({commit}) {
      commit('setCurrentUserRating', null)
    },

    CLEAR_STATE({commit}) {
      commit('setRating', 0);
      commit('setDetails', [
        { stars: 5, quantity: 0, procent: 0, name: 'Excellent', color: 'lightgreen' },
        { stars: 4, quantity: 0, procent: 0, name: 'Good', color: 'green' },
        { stars: 3, quantity: 0, procent: 0, name: 'Average', color: `rgb(${218}, ${204}, ${18})` },
        { stars: 2, quantity: 0, procent: 0, name: 'Poor', color: 'orange' },
        { stars: 1, quantity: 0, procent: 0, name: 'Worst', color: 'red' },
      ]);
      commit('setCurrentUserRating', null);
      commit('setData', []);
    }
  }
}