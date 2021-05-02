import firebase from 'firebase/app';
import "firebase/firestore";
import "firebase/storage";

export default {
  namespaced: true,
  state: {
    data: [],
    parsedData: []
  },
  getters: {
    getData: state => state.data,
    getParsedData: state => state.parsedData
  },
  mutations: {
    setData(state, data) {
      state.data = data;
    },
    setParsedData(state, data) {
      state.parsedData = data;
    },
  },
  actions: {
    async INIT({commit, dispatch}) {
      const DATA = [];
      const getData = async () => {
        const db = firebase.firestore();
        const collection = await db.collection('Games').get();
        collection.docs.forEach(doc => {
          DATA.push(doc.data())
        })
      }

      const IMGS = [];
      const getImgs = async () => {
        const storageImgs = firebase.storage().ref('gamesPreview');
        const imgNames = (await storageImgs.listAll()).items.map(i => i.name);
        const promises = imgNames.map(async name => {
          const itemRef = storageImgs.child(name);
          const imgUrl = await itemRef.getDownloadURL();
          return {name, imgUrl};
        })
        const res = await Promise.all(promises);
        res.forEach(imgUrl => IMGS.push(imgUrl))
      }

      const merge = () => {
        DATA.forEach((data, i) => {
          if (IMGS.length === 1) {
            DATA[i].imgUrl = IMGS[0].imgUrl;
            return; 
          }
          IMGS.forEach((img, j) => {
            if (data.imgName === img.name) {
              DATA[i].imgUrl = img.imgUrl;
              IMGS.splice(j, 1);
              return;
            }
          })
        })
      }

      await getData();
      await getImgs();
      merge();
      DATA.sort((a, b) => a.id - b.id);
      
      commit('setData', DATA);
      dispatch('PARSE_DATA');
    },
    PARSE_DATA({commit, state}) {
      const DATA = state.data;
      const parsedData = DATA.map(data => {
        const obj = {};
        obj.id = data.id;
        obj.name = data.name;
        return obj;
      })

      commit('setParsedData', parsedData)
    }
  }
}