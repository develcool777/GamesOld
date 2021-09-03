<template>
  <div class="tictactoe">
    <section class="tictactoe__game">
      <Info
        :settings="GAME.comp"
        :winner="GAME.winner"
      />
      <div class="tictactoe__field">
        <Cell 
          class="tictactoe__cell"
          v-for="(item, i) in fieldForDraw" 
          :key="i"
          :class="{win: item.winCell}"
          :style="styleCursor(item)"
          :whatToDraw="item.cell"
          :whatToHover="item.currentPlayer"
          :hover="hoverFunction(item, i)"
          @mouseover="hovered = i"
          @mouseleave="hovered = null"
          @click="clickCell(item.coordinates)"
        />
        <div class="tictactoe__lineVertical1"></div>
        <div class="tictactoe__lineVertical2"></div>
        <div class="tictactoe__lineHorizontal1"></div>
        <div class="tictactoe__lineHorizontal2"></div>
      </div>
    </section>
    <Instruction 
      class="tictactoe__instruction"
      :status="GAME.gameStatus"
      :settings="GAME.comp"
      v-on:start="gameStarted()"
      v-on:finish="gameFinished()"
      v-on:returnMove="returnMove()"
      v-on:changePlayingWith="changePlay($event)"
      v-on:changeSide="changeSide($event)"
      v-on:changeDifficulty="changeDifficulty($event)"
    />
  </div>
  <transition name="fade">
    <Loading v-if="loading" class="LOADING" :step="0.6"/>
  </transition>
</template>

<script>
import Game from '@/model/ticTacToe/game';
import Instruction from '@/components/TicTacToe/Instruction';
import Cell from '@/components/TicTacToe/Cell';
import Info from '@/components/TicTacToe/Info';
import Loading from '@/components/Loading' 
export default {
  name: 'TicTacToe',
  components: {
    Instruction,
    Cell,
    Info,
    Loading
  },
  data() {
    return {
      GAME: {},
      fieldForDraw: [],
      hovered: null,
      loading: true,
      allowMove: true
    }
  },
  created() {
    setTimeout(() => {this.loading = false}, 1000);
    this.init();
  },
  methods: {
    init() {
      this.GAME = new Game();
      this.draw();
    },

    draw() {
      this.fieldForDraw = this.GAME.getFieldForDraw();
    },

    clickCell(coordinates) {
      if (this.GAME.gameStatus !== 'start') { return }
      const userMadeMove = this.GAME.play(coordinates.x, coordinates.y);
      this.draw();

      if (this.GAME.comp.playWithComputer && userMadeMove) {
        this.allowMove = false;
        setTimeout(() => {
          this.GAME.playWithComputer();
          this.draw();
          this.allowMove = true;
        }, 250);

      }
    },

    gameStarted() {
      this.GAME.startGame();
      if (this.GAME.comp.playWithComputer && this.GAME.comp.compSide === 'x') {
        this.draw();
      }
    },

    gameFinished() {
      this.GAME.finishGame();
      this.GAME.clear();
      this.draw();
    },

    changeSide(bool) {
      if (bool) { return }
      [this.GAME.comp.userSide, this.GAME.comp.compSide] = [this.GAME.comp.compSide, this.GAME.comp.userSide];
      this.gameFinished();
    },

    changeDifficulty(diff) {
      this.GAME.comp.difficulty = diff;
      this.gameFinished()
    },

    returnMove() {
      this.GAME.returnMove();
      this.draw();
    },

    changePlay(bool) {
      if (bool === this.GAME.comp.playWithComputer) { return }
      this.GAME.comp.playWithComputer = bool;
      this.gameFinished();
    },

    styleCursor(item) {
      const condition = item.cell === '' && this.GAME.winner === '' && this.GAME.gameStatus === 'start' && this.allowMove;
      return condition ? {cursor: 'pointer'} : {cursor: 'default'}
    },
    
    hoverFunction(item, i) {
      const game = this.GAME.gameStatus === 'start' && this.GAME.winner === '';
      return this.hovered === i && item.cell === '' && game && this.allowMove;
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
    width: rem(470);
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
    top: rem(150);
  }
  &__lineVertical2 {
    top: rem(310);
  }
  &__lineHorizontal1, &__lineHorizontal2 {
    width: rem(10);
    height: 100%;
    left: rem(150);
  }
  &__lineHorizontal2 {
    left: rem(310);   
  }
}
.win {
  background: lightgreen;
}
</style>