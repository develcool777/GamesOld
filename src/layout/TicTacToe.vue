<template>
  <div class="tictactoe">
    <section class="tictactoe__game">
      <Info
        :settings="GAME.comp"
        :winner="GAME.winner"
        :currentPlayer="getCurrentPlayer"
        :gameStatus="GAME.gameStatus"
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
      :gameStatus="GAME.gameStatus"
      :settings="GAME.comp"
      :isReturnMove="isReturnMoveAvailable"
      v-on:start="gameStarted()"
      v-on:finish="gameFinished()"
      v-on:returnMove="returnMove()"
      v-on:changePlayingWith="changePlay($event)"
      v-on:changeSide="changeSide($event)"
      v-on:changeDifficulty="changeDifficulty($event)"
    />
    <CommentButton :path="{ name: 'Comments', params: { name: 'tic-tac-toe' }}"/>
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
import CommentButton from '@/components/CommentButton'
export default {
  name: 'TicTacToe',
  components: {
    Instruction,
    Cell,
    Info,
    Loading,
    CommentButton
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
  computed: {
    isReturnMoveAvailable() {
      const condition1 = this.GAME.moves.length === 0 || this.GAME.winner !== '';
      const condition2 = this.GAME.comp.compSide === 'x' && this.GAME.moves.length <= 2;
      return !(condition1 || condition2)
    },

    getCurrentPlayer() {
      return this.GAME.currentPlayer;
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
      const isComp = this.GAME.comp.playWithComputer;
      const compSide = this.GAME.comp.compSide === 'x';
      const diff = this.GAME.comp.difficulty;

      if (isComp && compSide && diff === 'easy') {
        this.GAME.playWithComputer();
        return this.draw();
      } 

      if (isComp && compSide && diff === 'hard') {
        setTimeout(() => {
          this.GAME.playWithComputer();
          this.draw();
        }, 500) // because of recursion there
      }
    },

    gameFinished() {
      this.GAME.finishGame();
      this.GAME.clear();
      this.draw();
    },

    changeSide(side) {
      if (this.GAME.comp.userSide === side) { return }
      [this.GAME.comp.compSide, this.GAME.comp.userSide] = [this.GAME.comp.userSide, side];
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
  position: relative;
	display: flex;
  align-items: center;
  flex: 1;
  background: darkslategray; 

  &__game {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center; 
  }

  &__instruction {
    flex-basis: 300px;
    margin-right: 10px;
  }

  &__field {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 470px;
    margin: 0 auto;
  }

  &__cell:nth-child(n+4):nth-child(-n+6) {
    margin: 10px 0;
  }

  &__lineVertical1, &__lineVertical2, &__lineHorizontal1, &__lineHorizontal2  { 
    position: absolute;
    display: block;
    background: $black;
    border-radius: 5px;
  }

  &__lineVertical1, &__lineVertical2 {
    width: 100%;
    height: 10px;
    top: 150px;
  }

  &__lineVertical2 {
    top: 310px;
  }
  
  &__lineHorizontal1, &__lineHorizontal2 {
    width: 10px;
    height: 100%;
    left: 150px;
  }

  &__lineHorizontal2 {
    left: 310px;   
  }
}

.win {
  background: lightgreen;
}
</style>