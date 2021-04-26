<template>
  <div class="tictactoe">
    <section class="tictactoe__game">
      <div class="tictactoe__field">
        <div 
          class="tictactoe__cell"
          :class="{moveX: item.cell === 'x', moveO: item.cell === 'o'}"
          v-for="(item, i) in fieldForDraw" 
          :key="i"
          @click="clickCell(item.coordinates)"

        ></div>
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
import Game from '@/model/ticTacToe/game';
import Instruction from '@/components/TicTacToe/Instruction'
export default {
  name: 'TicTacToe',
  components: {
    Instruction
  },
  data() {
    return {
      game: {},
      fieldForDraw: []
    }
  },
  created() {
    this.createGame()
  },
  methods: {
    createGame() {
      this.game = new Game();
      this.draw();
    },
    clickCell(coordinates) {
      this.game.play(coordinates.x, coordinates.y);
      if (this.game.numberOfMoves > 4) {
        this.game.cheakWinner()
      }
      this.draw();
    },
    draw() {
      this.fieldForDraw = this.game.getField();
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
  &__cell {
    width: rem(200);
    height: rem(200);
    background: $white;
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
.moveX {
  position: relative;
}
.moveX::after, .moveX::before {
  position: absolute;
  content: "";
  top: 50%;
  left: 10%;
  width: rem(150);
  height: rem(10);
  background: $black;
  border-radius: rem(10);
}
.moveX::after {
  transform: rotate(45deg);
}
.moveX::before {
  transform: rotate(-45deg);
}
.moveO {
  position: relative;
}
.moveO::after {
  position: absolute;
  content: "O";
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: $black;
  font-size: rem(150);
}
</style>