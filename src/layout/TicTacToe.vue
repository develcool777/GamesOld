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
          :style="{cursor: item.cell === '' && game.winner === '' && getIsPlaying ? 'pointer' : 'default'}"
          :whatToDraw="item.cell"
          :whatToHover="item.currentPlayer"
          :hover="hovered === i && item.cell === '' && getIsPlaying"
          @mouseover="hovered = i;"
          @mouseleave="hovered = null"
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
      fieldForDraw: [],
      hovered: null,
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
    isPlaying: function (newVal) {
      if (newVal && this.getPlayingWithComputer && this.getCompSettings.compSide === 'x') {
        this.computerMove();
      }
    }
  },
  created() {
    this.createGame()
  },
  computed: {
    ...mapState([
      'clear', 'returnMove',
      'playingWithComputer', 'isPlaying'
    ]),
    ...mapGetters([
      'getPlayingWithComputer', 'getCompSettings', 
      'getWinner', 'getIsPlaying'
    ])
  },
  methods: {
    ...mapActions([
      'CHANGE_CLEAR', 'CHANGE_RETURN_MOVE', 
      'INIT_STATE', 'CHANGE_WINNER',
      'CHANGE_IS_PLAYING'
    ]),
    createGame() {
      this.game = new Game();
      this.INIT_STATE();
      this.draw();
    },
    clickCell(coordinates) {
      if (this.getIsPlaying !== true) { return }
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
        setTimeout(() => this.computerMove(), 250);
      }
    },
    userMove(coordinates) {
      this.game.play(coordinates.x, coordinates.y);
      this.cheakWinner();
      this.draw();
    },
    computerMove() {
      this.game.playWithComputer(this.getCompSettings.difficulty);
      this.cheakWinner();
      this.draw()
    },
    cheakWinner() {
      const winner = this.game.winner
      if (winner !== '') {
        this.CHANGE_WINNER(winner);
        this.CHANGE_IS_PLAYING(false);
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
      this.game.returnMove(this.getPlayingWithComputer, this.getCompSettings.compSide === 'x');
      this.draw();
      this.CHANGE_RETURN_MOVE(false);
    },
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