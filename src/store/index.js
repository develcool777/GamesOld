import { createStore } from 'vuex'
import maze from '@/store/modules/maze';
import memoji from '@/store/modules/memoji';
import rockPaperScissors from '@/store/modules/rockPaperScissors';
import chess from '@/store/modules/chess';
import games from '@/store/modules/games';
import user from '@/store/modules/user';

export default createStore({
  modules: {
    maze,
    memoji,
    rockPaperScissors,
    chess,
    games,
    user
  }
})