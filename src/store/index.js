import { createStore } from 'vuex'
import maze from '@/store/modules/maze';
import memoji from '@/store/modules/memoji';
import rockPaperScissors from '@/store/modules/rockPaperScissors';
import tictactoe from '@/store/modules/tictactoe';
import chess from '@/store/modules/chess';
import games from '@/store/modules/games';

export default createStore({
  // state: {
  //   aspectRatio: '',
  //   screenSize: {
  //     width: null,
  //     height: null,
  //   }
  // },
  // getters: {
  //   getAspectRatio: state => state.aspectRatio
  // },
  // mutations: {
  //   calcAspectRatio(state) {
  //     const arr16_9 = ['854x480', '1280x720', '1280x720', '1920x1080', '2560x1440', '5120x2880'];
  //     const arr16_10 = ['640x400', '1280x768', '1280x800', '1440x900', '1680x1050', '1920x1200', '2560x1600'];
  //     const screenSize = {
  //       height: screen.height,
  //       width: screen.width
  //     }
  //     let aspectRatio;
  //     arr16_9.forEach(item => {
  //       const [width, height] = item.split('x').map(Number);
  //       if (screenSize.width === width && screenSize.height === height) {
  //         aspectRatio = '16:9'
  //         return;
  //       }
  //     })
  //     arr16_10.forEach(item => {
  //       const [width, height] = item.split('x').map(Number);
  //       if (screenSize.width === width && screenSize.height === height) {
  //         aspectRatio = '16:10'
  //         return;
  //       }
  //     })
  //     state.aspectRatio = aspectRatio;
  //     state.screenSize.height = screenSize.height;
  //     state.screenSize.width = screenSize.width;
  //   },
  // },
  // actions: {
  //   INIT_ASPECT_RATIO({commit}) {
  //     commit('calcAspectRatio');
  //   }
  // },
  modules: {
    maze,
    memoji,
    rockPaperScissors,
    tictactoe,
    chess,
    games
  }
})