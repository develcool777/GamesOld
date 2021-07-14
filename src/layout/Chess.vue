<template>
  <div class="chess">
    <div class="chess__game">
      <div class="chess__field">
        <div class="chess__row" v-for="(row, i) in board" :key="i">
          <div 
            :class="[chooseCellColor(cell, i, j), 'chess__cell']"  
            v-for="(cell, j) in row" 
            :key="j"
            @click="clickOnCell(cell, i, j)"
          >
            <div v-if="cell.isAvailableFor === 'move'" class="chess__move"></div>
            <div v-if="cell.isAvailableFor === 'kill'" class="chess__upRight"></div>
            <div v-if="cell.isAvailableFor === 'kill'" class="chess__upLeft"></div>
            <div v-if="cell.isAvailableFor === 'kill'" class="chess__downRight"></div>
            <div v-if="cell.isAvailableFor === 'kill'" class="chess__downLeft"></div>
            <div v-if="cell.isAvailableFor === 'castle'" class="chess__castle"></div>  
            <Figure 
              :figureName="createFigureName(cell)"
              :cursorStyle="showCursorPointer(cell)"
            />
            <Promotion 
              v-if="cell.isAvailableFor === 'promotion'" 
              v-on:promotion="pawnPromotion($event, i, j)"
              :index="cell.figure.color === 'white' ? 0 : 1"
            />
          </div>
        </div>
        <div v-if="GAME.isPawnPromotion" class="chess__mask"></div>
      </div>
    </div>
  </div>
  <!-- <Instruction 
    class="maze__instruction" 
    v-on:changeLevel="changeLevel($event)"
    v-on:clicked="actOfUser($event)"
    v-on:restart="restartGame()"
  /> -->

</template>

<script>
import Figure from '@/components/Chess/Figure'
import Promotion from '@/components/Chess/Promotion'
import Game from '@/model/chess/game';
export default {
  name: 'Chess',
  components: {
    Figure,
    Promotion
  },
  data() {
    return {
      GAME: {},
      board: [],
      dontClick: false,
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.GAME = new Game();
      this.GAME.createField();
      this.GAME.createFigures();
      this.draw();
    },

    draw() {
      this.board = this.GAME.field.board;
    },

    createFigureName(cell) {
      if (cell.figure === null) { return '' }
      const name = cell.figure.color + cell.figure.name + '.png';
      return name;
    },

    clearAvailableMove() {
      this.GAME.clearAvailableMove();
      this.draw();
    },

    clickOnCell(cell, x, y) {
      // dont click after pawn promotion
      if (this.dontClick) {
        this.dontClick = false;
        return;
      }

      this.GAME.clickOnCellForMove(cell, x, y);
      this.draw();
    }, 

    pawnPromotion(figureName, x, y) {
      this.GAME.pawnPromotion(this.board, figureName, {x, y});
      this.dontClick = true
    },

    chooseCellColor(cell, x, y) {
      if (cell.isAvailableFor === 'check') {
        console.log('here');
        return 'check';
      }
      if (this.GAME.oldPosition !== null && this.GAME.oldPosition.x === x && this.GAME.oldPosition.y === y) {
        return 'lastMoveOldPosition';
      }
      if (this.GAME.newPosition !== null && this.GAME.newPosition.x === x && this.GAME.newPosition.y === y) {
        return 'lastMoveNewPosition';
      }
      if (this.GAME.selectedCell !== null && this.GAME.selectedCell.position.x === x && this.GAME.selectedCell.position.y === y) {
        return 'selected';
      }
      return cell.color;
    },

    showCursorPointer(cell) {
      if (cell.figure === null) { return 'default' }
      return cell.figure.color === this.GAME.whoMoves ? 'pointer' : 'default';
    }
  }
}
</script>

<style lang="scss" scopped>
.chess {
  @include BasicGrid();
  &__row {
    @include Flex(center);
  }
  &__cell, &__move, &__castle {
    @include Size(78, 78);
    position: relative;
  }
  &__field {
    position: relative;
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
  &__move::after, &__castle::after {
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
  &__move:hover::after, &__castle:hover::after {
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
    width: 30px;
    height: 30px;
    background: darkslateblue;
  }
}
.check {
  background: darkred;
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