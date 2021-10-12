<template>
  <div class="chess">
    <div class="chess__game">
      <div class="chess__field">
        <div class="chess__row" v-for="(row, i) in board" :key="i">
          <div 
            :class="[chooseCellColor(cell), 'chess__cell']"  
            v-for="(cell, j) in row" 
            :key="j"
            @click="clickOnCell(cell)"
            @drop="onDrop($event, cell)"
            @dragenter="dragEnter($event, cell)"
            @dragleave="dragLeave($event)"
            @dragover.prevent
          >
            <div v-if="cell.isAvailableFor === 'move'" class="chess__move"></div>
            <div v-if="cell.isAvailableFor === 'kill'" class="chess__upRight"></div>
            <div v-if="cell.isAvailableFor === 'kill'" class="chess__upLeft"></div>
            <div v-if="cell.isAvailableFor === 'kill'" class="chess__downRight"></div>
            <div v-if="cell.isAvailableFor === 'kill'" class="chess__downLeft"></div>
            <div v-if="cell.isAvailableFor === 'castle'" class="chess__castle"></div>
            <div v-if="cell.isAvailableFor === 'enPassant'" class="chess__enPassant"></div>
            <Figure 
              :figure="createFigure(cell)"
              :cursorStyle="showCursorPointer(cell)"
              :draggable="defineDrag(cell)"
              @dragstart="startDrag($event, cell)"
            />  
            <Promotion 
              v-if="cell.isAvailableFor === 'promotion'" 
              v-on:promotion="pawnPromotion($event, i, j)"
              :index="cell.figure.color === 'white' ? 0 : 1"
              :boardFlipped="getIsBoardFlipped"
            />
          </div>
        </div>

        <div v-if="GAME.isPawnPromotion" class="chess__mask"></div>

        <div class="chess__borderLeft" v-if="navigation">
          <div class="chess__number" v-for="(num, i) in 8" :key="i">{{ getIsBoardFlipped ? num : 9 - num }}</div>
        </div>
        <div class="chess__borderDown" v-if="navigation">
          <div class="chess__letter" v-for="(num, i) in 8" :key="i">{{ String.fromCharCode( getIsBoardFlipped ? 73 - num : 64 + num) }}</div>
        </div>
        <div class="chess__borderRight" v-if="navigation">
          <div class="chess__number" v-for="(num, i) in 8" :key="i">{{ getIsBoardFlipped ? num : 9 - num }}</div>
        </div>
        <div class="chess__borderUp" v-if="navigation">
          <div class="chess__letter" v-for="(num, i) in 8" :key="i">{{ String.fromCharCode( getIsBoardFlipped ? 73 - num : 64 + num) }}</div>
        </div>
        
        <MaterialRatio 
          class="chess__material" 
          v-if="navigation" 
          :matirealRatio="getMatirealRatio"
          :boardFlipped="getIsBoardFlipped"
        />
      </div>
    </div>
    <Instruction 
      class="chess__instruction"
      :gameStatus="getGameStatus"
      :historyLen="getHistoryLength"
      :boardFlipped="getIsBoardFlipped"
      :currentIndex="getHistoryIndex"
      :result="getGameResult"
      v-on:startGame="startGame()" 
      v-on:changePosition="showHistory($event)"
      v-on:flipBoard="flipBoard()"
      v-on:returnMove="returnMove()"
      v-on:clearBoard="clearBoard()"
    />
  </div>
  <transition name="fade">
    <Loading 
      v-if="loading" 
      class="LOADING" 
      :step="0.3"  
    />
  </transition>  
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapActions, mapState } = createNamespacedHelpers('chess');
import Figure from '@/components/Chess/Figure'
import Promotion from '@/components/Chess/Promotion'
import Game from '@/model/chess/game'
import Instruction from '@/components/Chess/Instruction'
import Loading from '@/components/Loading'
import MaterialRatio from '@/components/Chess/MaterialRatio'
export default {
  name: 'Chess',
  components: {
    Figure,
    Promotion,
    Instruction,
    Loading,
    MaterialRatio
  },
  watch: {
    emitIndex: function(newVal) {
      newVal !== 0 && this.showHistory(newVal);
    },

    getHistoryLength: function(newVal) {
      if (newVal >= 0) {
        this.historyNotation.value.notation = this.GAME.getAllHistoryNotation();
        this.historyNotation.value.currentIndex = this.getHistoryIndex;
        this.historyNotation.value.gameStatus = this.getGameStatus;
      }
    },

    getHistoryIndex: function(newVal) {
      if (newVal >= 0) {
        this.historyNotation.value.currentIndex = newVal;
      }
    },

    getGameStatus: function(newVal) {
      if (newVal) {
        this.historyNotation.value.gameStatus = newVal;
      }
    }
  },
  data() {
    return {
      GAME: {},
      board: [],
      dontClick: false,
      loading: true,
      navigation: false,
      historyNotation: { value: {} },
    }
  },
  provide() {
    return {
      historyNotation: this.historyNotation
    }
  },
  async created() {
    setTimeout(() => {this.loading = false}, 2000);
    await this.init();
  },
  computed: {
    ...mapState(['emitIndex']),
    ...mapGetters(['getFigures']), 

    getMatirealRatio() {
      return this.GAME.materialRatio;
    },

    getIsBoardFlipped() {
      return this.GAME.field.isBoardFlipped;
    },

    getGameStatus() {
      return this.GAME.gameStatus;
    },

    getHistoryLength() {
      return this.GAME?.field?.historyOfMoves?.length;
    },

    getHistoryIndex() {
      return this.GAME?.field?.historyIndex
    },

    getGameResult() {
      return this.GAME.gameResult;
    }
  },
  methods: {
    ...mapActions(['SET_FIGURES', 'CHANGE_EMIT_INDEX']),

    async init() {
      this.GAME = new Game();
      this.GAME.createField();
      this.GAME.createFigures();
      await this.SET_FIGURES();
      this.CHANGE_EMIT_INDEX(0);
      this.draw();
      this.navigation = true;
    },

    startGame() {
      this.GAME.startGame();
    },

    finishGame() {
      this.GAME.finishGame();
    },

    clearBoard() {
      this.CHANGE_EMIT_INDEX(0);
      this.GAME.clearField();
      this.draw();
    },

    newGame() {
      this.clearBoard();
      this.startGame();
    },

    draw() {
      this.board = this.GAME.field.board;
    },

    createFigure(cell) {
      if (cell.figure === null) { return [] }
      const name = cell.figure.color + cell.figure.name;
      return [name, this.getFigures[name]];
    },

    clearAvailableMove() {
      this.GAME.clearAvailableMove();
      this.draw();
    },

    startDrag(event, cell) {
      if (this.GAME.gameStatus !== 'start' || this.GAME.whoMoves !== cell.figure.color) { return }
      this.clickOnCell(cell, cell.position.x, cell.position.y);
      event.dataTransfer.dropEffect = 'move';
      event.dataTransfer.effectAllowed = 'move';
    },

    onDrop(event, cell) {
      if (this.GAME.gameStatus !== 'start') { return }  
      this.clickOnCell(cell, cell.position.x, cell.position.y);
      event.target.style.background = ''
    },

    dragEnter(event, cell) {
      if ('move' === cell.isAvailableFor) {
        event.target.style.background = 'darkgreen';
      }
      if ('castle' === cell.isAvailableFor) {
        event.target.style.background = 'darkslateblue';
      }
      if ('kill' === cell.isAvailableFor) {
        event.target.style.background = 'red';
      }
      if ('enPassant' === cell.isAvailableFor) {
        event.target.style.background = 'lightpink';
      }
    },

    dragLeave(event) {
      event.target.style.background = '';
    },

    defineDrag(cell) {
      if (cell.figure === null || this.GAME.gameStatus !== 'start') { return false }
      return cell.figure.color === this.GAME.whoMoves;
    },

    clickOnCell(cell) {
      // dont click after pawn promotion
      if (this.dontClick) {
        this.dontClick = false;
        this.GAME.isGameFinished();
        return;
      }

      if (this.GAME.gameStatus === 'start') {
        this.GAME.clickOnCellForMove(cell);
        this.GAME.isGameFinished();
        this.draw();
      }
    },
    
    async pawnPromotion(figureName, x, y) {
      await this.GAME.pawnPromotion(this.board, figureName, {x, y});
      this.dontClick = true
    },

    async showHistory(index) {
      await this.GAME.showHistory(index);
      this.draw();
    },

    async returnMove() {
      await this.GAME.returnMove();
      this.draw();
    },

    flipBoard() {
      this.GAME.flipBoard();
      this.draw();
    },

    chooseCellColor(cell) {
      if (cell.isAvailableFor === 'checkMate') {
        return 'checkMate';
      }
      if (cell.isSelected) {
        return 'selected';
      }
      if (cell.isAvailableFor === 'check' && cell.figure?.color === this.GAME.whoMoves) {
        return 'check';
      }
      if (cell.showsPosition === 'oldPosition') {
        return 'lastMoveOldPosition';
      }
      if (cell.showsPosition === 'newPosition') {
        return 'lastMoveNewPosition';
      }

      return cell.color;
    },

    showCursorPointer(cell) {
      if (cell.figure === null || this.GAME.gameStatus !== 'start') { return 'default' }
      return cell.figure.color === this.GAME.whoMoves ? 'pointer' : 'default';
    }
  }
}
</script>

<style lang="scss" scopped>
.chess {
  background: #24272E;
  position: relative;
  user-select: none;
	display: flex;
  align-items: center;
  flex: 1;

  &__game {
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center; 
  }

  &__instruction {
    flex-basis: 300px;
    margin-right: 10px;
  }

  &__row {
    @include Flex(center);
  }

  &__cell, &__move, &__castle, &__enPassant {
    @include Size(78, 78);
    position: relative;
  }

  &__field {
    position: relative;
  }

  &__borderLeft, &__borderRight {
    position: absolute;
    top: -30px;
    padding-top: 30px;
    height: calc(78px * 8 + 60px);
    width: 30px;
    background: darkred;
  }

  &__borderLeft {
    left: -30px;
  }

  &__borderRight {
    right: -30px;
  }

  &__borderUp, &__borderDown {
    position: absolute;
    left: -30px;
    display: flex;
    padding-left: 30px;
    height: 30px;
    width: calc(78px * 8 + 60px);
    background: darkred;
  }

  &__borderUp {
    top: -30px;
  }

  &__borderDown {
    bottom: -30px;
  }

  &__letter, &__number {
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 20px;
  }

  &__letter {
    width: 78px;
  }

  &__number {
    height: 78px;
  }

  &__mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 5;
    background-color: rgba(0, 0, 0, 0.6);
  }

  &__move::after, &__castle::after, &__enPassant::after {
    position: absolute;
    content: "";
    z-index: 1;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: darkgreen;
    transition-duration: .5s;
  }

  &__move:hover::after, &__castle:hover::after, &__enPassant:hover:after  {
    cursor: pointer;
    width: 100%;
    height: 100%;
    border-radius: 0;
  }

  &__upRight, &__upLeft, &__downLeft, &__downRight {
    position: absolute;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 15px 15px 0;
    border-color: transparent firebrick transparent transparent;
    transition-duration: .5s;
  }

  &__upRight {
    right: 0;
  }

  &__upLeft {
    top: 0;
    transform: rotate(-90deg);   
  }

  &__downRight {
    bottom: 0;
    right: 0;
    transform: rotate(90deg);
  }

  &__downLeft {
    bottom: 0;
    transform: rotate(-180deg);
  }

  &__cell:hover &__upRight, 
  &__cell:hover &__upLeft, 
  &__cell:hover &__downRight, 
  &__cell:hover  &__downLeft {
    border-width: 0 20px 20px 0;
  }

  &__castle::after {
    background: darkslateblue;
  }

  &__enPassant::after {
    background: lightpink;
  }

  &__material {
    position: absolute;
    top: -30px;
    right: -50px;
  }
}

.check {
  background: lightcoral;
}

.checkMate {
  background: crimson;
}

.lastMoveOldPosition {
  background: olivedrab;
}

.lastMoveNewPosition {
  background: rgb(55, 78, 10);
}

.selected {
  background: lightgreen;
}

.white {
  background: #EDDAB9;
}

.black {
  background: #AE8868;
}
</style>