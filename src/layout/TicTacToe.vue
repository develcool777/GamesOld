<template>
  <div class="tictactoe">
    <section class="tictactoe__game">
      <Info/>
      <div class="tictactoe__field">
        <Cell 
          class="tictactoe__cell"
          v-for="(item, i) in fieldForDraw" 
          :key="i"
          :class="{win: item.winCell}"
          :style="{cursor: item.cell === '' && game.winner === '' ? 'pointer' : 'default'}"
          :whatToDraw="item.cell"
          @click="clickCell(item.coordinates)"
        />
        <div class="tictactoe__lineVertical1"></div>
        <div class="tictactoe__lineVertical2"></div>
        <div class="tictactoe__lineHorizontal1"></div>
        <div class="tictactoe__lineHorizontal2"></div>
      </div>
    </section>
    <Instruction class="tictactoe__instruction"/>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapState, mapGetters } = createNamespacedHelpers('tictactoe');
import Game from '@/model/ticTacToe/game';
import Instruction from '@/components/TicTacToe/Instruction';
import Cell from '@/components/TicTacToe/Cell';
import Info from '@/components/TicTacToe/Info';
export default {
  name: 'TicTacToe',
  components: {
    Instruction,
    Cell,
    Info
  },
  data() {
    return {
      game: {},
      fieldForDraw: []
    }
  },
  watch: {
    clear: function(newVal) {
      if (newVal) {
        this.clearField();
      }
    },
    returnMove: function(newVal) {
      if (newVal) {
        this.return();
      }
    },
    computerStarted: function(newVal) {
      if (newVal) {
        this.computerFirstMove();
      }
    }
  },
  created() {
    this.createGame()
  },
  computed: {
    ...mapState(['clear', 'returnMove', 'computerStarted']),
    ...mapGetters(['getPlayingWithComputer', 'getCompSettings', 'getWinner'])
  },
  methods: {
    ...mapActions(['CHANGE_CLEAR', 'CHANGE_RETURN_MOVE', 
      'INIT_STATE', 'CHANGE_WINNER', 'CHANGE_COMPUTER_STARTED'
    ]),
    createGame() {
      this.game = new Game();
      this.INIT_STATE();
      this.draw();
    },
    clickCell(coordinates) {
      const field = this.game.field;
      const playingWithComputer = this.getPlayingWithComputer;
      if (field[coordinates.x][coordinates.y] !== '') {
        return;
      }
      if (this.getWinner !== '') {
        return;
      }
      this.userMove(coordinates)
      if (playingWithComputer) {
        this.computerMove();
      }
      this.draw();
    },
    userMove(coordinates) {
      this.game.play(coordinates.x, coordinates.y);
      this.cheakWinner();
    },
    computerMove() {
      this.game.playWithComputer(this.getCompSettings.difficulty);
      this.cheakWinner();
    },
    cheakWinner() {
      const winner = this.game.winner
      if (winner !== '') {
        this.CHANGE_WINNER(winner);
      }
    },
    draw() {
      // this.game.log();
      this.fieldForDraw = this.game.getField();
    },
    clearField() {
      this.game.clear();
      this.draw();
      this.CHANGE_CLEAR(false);
    },
    return() {
      this.game.returnMove();
      this.draw();
      this.CHANGE_RETURN_MOVE(false);
    },
    computerFirstMove() {
      this.game.playWithComputer();
      this.draw();
    }
  }
}
</script>

<style lang="scss" scoped>
.tictactoe {
  @include BasicGrid();
  background: #41B3A3;
  &__field {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: rem(620);
    margin: 0 auto;
  }
  &__cell:nth-child(n+4):nth-child(-n+6) {
    margin: rem(10) 0;
  }
  &__lineVertical1, &__lineVertical2, &__lineHorizontal1, &__lineHorizontal2  { 
    position: absolute;
    display: block;
    background: $black;
    border-radius: rem(5);
  }
  &__lineVertical1, &__lineVertical2 {
    width: 100%;
    height: rem(10);
    top: rem(200);
  }
  &__lineVertical2 {
    top: rem(410);
  }
  &__lineHorizontal1, &__lineHorizontal2 {
    width: rem(10);
    height: 100%;
    left: rem(200);
  }
  &__lineHorizontal2 {
    left: rem(410);   
  }
}
.win {
  background: lightgreen;
}
</style>