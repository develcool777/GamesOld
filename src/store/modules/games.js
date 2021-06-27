import firebase from 'firebase/app';
import "firebase/firestore";
import "firebase/storage";

export default {
  namespaced: true,
  state: {
    data: [],
    parsedData: [],
    isDataLoaded: false,
  },
  getters: {
    getData: state => state.data,
    getParsedData: state => state.parsedData,
    getIsDataLoaded: state => state.isDataLoaded,   
  },
  mutations: {
    setData(state, data) {
      state.data = data;
    },
    setParsedData(state, data) {
      state.parsedData = data;
    },
    changeIsDataLoaded(state, boolean) {
      state.isDataLoaded = boolean;
    },
  },
  actions: {
    async INIT({commit, dispatch}) {
      const DATA = [];
      const getData = async () => {
        const db = firebase.firestore();
        const collection = await db.collection('Games').get();
        collection.docs.forEach(doc => {
          const data = doc.data();
          data.docID = doc.id;
          DATA.push(data)
        })
      }

      const IMGS = [];
      const getImgs = async () => {
        const storageImgs = firebase.storage().ref('gamesPreview/imgs');
        const imgNames = (await storageImgs.listAll()).items.map(i => i.name);
        const promises = imgNames.map(async name => {
          const itemRef = storageImgs.child(name);
          const imgUrl = await itemRef.getDownloadURL();
          return {name, imgUrl};
        })
        const res = await Promise.all(promises);
        res.forEach(imgUrl => IMGS.push(imgUrl))
      }

      const VIDEOS = [];
      const getVideos = async () => {
        const storageImgs = firebase.storage().ref('gamesPreview/videos');
        const videoNames = (await storageImgs.listAll()).items.map(i => i.name);
        const promises = videoNames.map(async name => {
          const itemRef = storageImgs.child(name);
          const videoUrl = await itemRef.getDownloadURL();
          return {name, videoUrl};
        })
        const res = await Promise.all(promises);
        res.forEach(videoUrl => VIDEOS.push(videoUrl))
      }

      const merge1 = () => {
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
      const merge2 = () => {
        DATA.forEach((data, i) => {
          if (VIDEOS.length === 1) {
            DATA[i].videoUrl = VIDEOS[0].videoUrl;
            return; 
          }
          VIDEOS.forEach((video, j) => {
            if (data.videoName === video.name) {
              DATA[i].videoUrl = video.videoUrl;
              VIDEOS.splice(j, 1);
              return;
            }
          })
        })
      }
      await getData();
      await getImgs();
      await getVideos();
      merge1();
      merge2();
      DATA.sort((a, b) => a.id - b.id);
      console.log(DATA);
      commit('setData', DATA);
      dispatch('PARSE_DATA');
      commit('changeIsDataLoaded', true);
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
    },
    UPDATE_PLAYED({ commit }, docId) {
      const update = async () => {
        const db = firebase.firestore();
        const doc = await db.collection('Games').doc(docId);
        const docData = await doc.get();
        await doc.update({
          played: docData.data().played + 1
        })
      }
      update();
      commit('changeIsDataLoaded', true);
    }
  }
}