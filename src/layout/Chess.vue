<template>
  <div class="chess">
    <div class="chess__game">
      <div class="chess__field">
        <div class="chess__row" v-for="(row, i) in board" :key="i">
          <div 
            :class="[chooseCellColor(cell, i, j), 'chess__cell']"  
            v-for="(cell, j) in row" 
            :key="j"
            @click="clickOnCellForMove(cell, i, j)"
          >
            <div v-if="cell.isAvailableFor === 'move'" class="chess__move"></div>
            <div v-if="cell.isAvailableFor === 'kill'" class="chess__upRight"></div>
            <div v-if="cell.isAvailableFor === 'kill'" class="chess__upLeft"></div>
            <div v-if="cell.isAvailableFor === 'kill'" class="chess__downRight"></div>
            <div v-if="cell.isAvailableFor === 'kill'" class="chess__downLeft"></div>
            <div v-if="cell.isAvailableFor === 'castle'" class="chess__castle"></div>  
            <Figure :figureName="createFigureName(cell)"/>
          </div>
        </div>
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
import Field from '@/model/chess/field';
// import Pawn from '@/model/chess/figures/pawn'
// import Rook from '@/model/chess/figures/rook'
// import Bishop from '@/model/chess/figures/bishop'
// import Queen from '@/model/chess/figures/queen'
// import Knight from '@/model/chess/figures/knight'
// import King from '@/model/chess/figures/king'
import Figures from '@/model/chess/figures'
import Figure from '@/components/Chess/Figure'
export default {
  name: 'Chess',
  components: {
    Figure
  },
  data() {
    return {
      field: {},
      board: [],
      selectedCell: null,
      oldPosition: null,
      newPosition: null,
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.field = new Field();
      this.field.createField();
      const f = new Figures();
      f.addFiguresToField(this.field.board);
      this.board = this.field.board;
      console.log(this.board);
    },

    createFigureName(cell) {
      // console.log(cell);
      if (cell.figure === null) { return '' }
      const name = cell.figure.color + cell.figure.name + '.png';
      return name;
    },

    clearAvailableMove() {
      this.board = this.board.map((row, ) => {
        return row.map((cell, ) => {
          cell.isAvailableFor = '';
          return cell;
        })
      })
    },

    clickOnFigure(cell) {
      this.clearAvailableMove();
      // console.log(cell);
      console.log(cell, 'why why');
      const availableMoves = cell.figure.available(this.board);
      availableMoves.forEach((moves, i) => {
        moves.forEach(move => {
          const availableFor = i === 0 ? 'move' : i === 1 ? 'kill' : 'castle'
          this.board[move.x][move.y].isAvailableFor = availableFor;
        })
      })
      this.selectedCell = cell;
    },

    clickOnCellForMove(cell, x, y) {
      if (cell.figure !== null && cell.isAvailableFor !== 'kill') {
        this.clickOnFigure(cell);
        return;
      }
      if (cell.isAvailableFor === '') { 
        this.selectedCell = null;
        this.clearAvailableMove();
        return  
      }
      const figure = this.selectedCell.figure
      this.oldPosition = Object.assign({}, figure.position);
      if (cell.isAvailableFor === 'castle') {
        console.log('here!!!!1');
        figure.makeCastle([x,y], this.board)
      } else {
        figure.makeMove([x,y], this.board);
      }
      this.newPosition = Object.assign({}, figure.position);
      this.selectedCell = null;
      this.clearAvailableMove();
    },

    chooseCellColor(cell, x, y) {
      if (cell.isAvailableFor !== '') {
        return cell.color;
      }
      if (this.oldPosition !== null && this.oldPosition.x === x && this.oldPosition.y === y) {
        return 'lastMoveOldPosition';
      }
      if (this.newPosition !== null && this.newPosition.x === x && this.newPosition.y === y) {
        return 'lastMoveNewPosition';
      }
      if (this.selectedCell !== null && this.selectedCell.position.x === x && this.selectedCell.position.y === y) {
        return 'selected';
      }

      return cell.color;
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
  &__cell:hover &__upRight, &__cell:hover &__upLeft, &__cell:hover &__downRight, &__cell:hover  &__downLeft {
    border-width: 0 20px 20px 0;
  }
  &__castle::after {
    width: 30px;
    height: 30px;
    background: darkslateblue;
  }
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