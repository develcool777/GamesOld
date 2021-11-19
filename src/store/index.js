import { createStore } from 'vuex'
import maze from '@/store/modules/maze';
import memoji from '@/store/modules/memoji';
import rockPaperScissors from '@/store/modules/rockPaperScissors';
import chess from '@/store/modules/chess';
import games from '@/store/modules/games';
import user from '@/store/modules/user';
import comments from '@/store/modules/comments';
import gameInfo from '@/store/modules/gameInfo';

export default createStore({
  modules: {
    maze,
    memoji,
    rockPaperScissors,
    chess,
    games,
    user,
    comments,
    gameInfo
  }
})