import { createStore } from 'vuex'
import maze from '@/store/modules/maze';
import memoji from '@/store/modules/memoji';
import rockPaperScissors from '@/store/modules/rockPaperScissors';
import tictactoe from '@/store/modules/tictactoe';
export default createStore({
  modules: {
    maze,
    memoji,
    rockPaperScissors,
    tictactoe
  }
})