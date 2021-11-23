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
      state.rating = rating;
    },

    setDetails(state, details) {
      state.details = details;
    },

    setCurrentUserRating(state, rating) {
      state.currentUserRating = rating;
    },

    setData(state, data) {
      state.data = data;
    }
  },
  actions: {
    async GET_DATA({state, commit, dispatch}, gameName) {
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
        console.error(error);
      }
    }, 

    async UPDATE_RATING({}, payload) {
      try {
        const reference = doc(fireStore, 'Games_Info', payload.gameName);
        await updateDoc(reference, {
          rating: payload.rating
        })
      } catch (error) {
        console.error(error);
      }
    },

    // async UPDATE_PLAYED_FIELD({}) { // param played
    //   try {
    //     const reference = doc(fireStore, 'Games_Info', payload.gameName);
    //     await updateDoc(reference, {
    //       played: payload.rating
    //     })
    //   } catch (error) {
    //     console.error(error);
    //   }
    // },

    USER_RAITING({commit, state}, userUid) {
      const userRate = state.data.find(obj => obj.uid === userUid);
      userRate && commit('setCurrentUserRating', userRate);
    },

    async POST({}, payload) {
      try {
        const reference = collection(fireStore, `Games_Info/${payload.gameName}/rating`);
        const { uid, stars } = payload;
        await addDoc(reference, { uid, stars });
      } 
      catch (error) {
        console.error(error);
      }
    }, 

    LISTENER({state, dispatch}, gameName) {
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
      commit('setData', null);
    }
  }
}