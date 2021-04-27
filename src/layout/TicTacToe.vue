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
  },
  created() {
    this.createGame()
  },
  computed: {
    ...mapState(['clear', 'returnMove', 'withComputer']),
    ...mapGetters(['getWithComputer', 'getCompSettings']),
    compSide() {
      return this.getCompSettings.compSide === 'o' ? 'O' : 'X';
    },
    userSide() {
      return this.getCompSettings.userSide === 'o' ? 'O' : 'X';
    },
    compColor() {
      return this.getCompSettings.compSide === 'o' ? {color: 'blue'} : {color: 'red'};
    },
    userColor() {
      return this.getCompSettings.userSide === 'o' ? {color: 'blue'} : {color: 'red'};
    },
    resultOfBattle() {
      const winner = this.game.winner;
      if (winner === '') {
        return '';
      }
      if (this.getWithComputer) {
        const compSide = this.getCompSettings.compSide;
        const userSide = this.getCompSettings.userSide;
        return winner === compSide ? 'Comp win' : winner === userSide ? 'User win' : `It's a draw`;
      }
      console.log(winner);
      return winner === 'o' ? 'User2 win' : winner === 'x' ? 'User1 win' : `It's a draw`;
    }
  },
  methods: {
    ...mapActions(['CHANGE_CLEAR', 'CHANGE_RETURN_MOVE', 'INIT_STATE', 'CHANGE_WINNER']),
    createGame() {
      this.game = new Game();
      this.INIT_STATE();
      this.draw();
    },
    clickCell(coordinates) {
      this.game.play(coordinates.x, coordinates.y);
      if (this.getWithComputer) {
        this.game.playWithComputer();
      }
      if (this.game.winner !== '') {
        this.CHANGE_WINNER(this.game.winner);
      }
      this.draw();
    },
    draw() {
      this.game.log();
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