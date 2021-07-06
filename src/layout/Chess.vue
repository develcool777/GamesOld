<template>
  <div class="chess">
    <div class="chess__game">
      <div class="chess__field">
        <div class="chess__row" v-for="(row, i) in fieldForDraw" :key="i">
          <div 
            :class="[cell.color, 'chess__cell']"  
            v-for="(cell, j) in row" 
            :key="j"
            @click="clickOnCell(cell, i, j)"
          >
            <div v-if="cell.isAvailableFor === 'move'" class="chess__move"></div>
            <div v-if="cell.isAvailableFor === 'kill'" class="chess__kill"></div>
            <Figure 
              @click="clickOnFigure(cell.figure)" 
              :figureName="createFigureName(cell)"
            />

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
  </div>
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
      fieldForDraw: [],
      selectedFigure: null
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
      f.addFiguresToField(this.field.field);
      this.fieldForDraw = this.field.field;

      // Pawn
      // const p = new Pawn('black', {x: 6, y: 0});
      // const p2 = new Pawn('black', {x: 5, y: 1});
      // this.field.field[p.position.x][p.position.y].figure = p;
      // this.field.field[p2.position.x][p2.position.y].figure = p2;
      // this.fieldForDraw = this.field.field;
      // const p2 = new Pawn('black', {x: 5, y: 1});
      // console.log(p.available(this.fieldForDraw));
      // p.move([5,1], this.fieldForDraw);
      // console.log(p.available(this.fieldForDraw));
      // console.log(p2.available(this.fieldForDraw));

      // Rook
      // const r = new Rook('white', {x: 7, y: 0});
      // this.field.field[r.position.x][r.position.y].figure = r;
      // this.fieldForDraw = this.field.field;
     
      // console.log(this.fieldForDraw)
      // console.log(r.available(this.fieldForDraw));
      // r.move([7,5], this.fieldForDraw);
     

      // Bishop
      // const b = new Bishop('white', {x: 4, y: 5});
      // this.field.field[b.position.x][b.position.y].figure = b;
      // this.fieldForDraw = this.field.field;
      // console.log(b.available(this.fieldForDraw))
      // b.move([7,0], this.fieldForDraw);
      // console.log(this.fieldForDraw);

      // Queen
      // const q = new Queen('white', {x: 2, y: 3});
      // this.field.field[q.position.x][q.position.y].figure = q;
      // this.fieldForDraw = this.field.field;
      // console.log(q.available(this.fieldForDraw));
      // console.log(this.fieldForDraw);

      // knight
      // const k = new Knight('white', {x: 3, y: 5});
      // this.field.field[k.position.x][k.position.y].figure = k;
      // this.fieldForDraw = this.field.field;
      // console.log(k.available(this.fieldForDraw));
      // console.log(this.fieldForDraw);

      // king
      // const K = new King('black', {x: 5, y: 5});
      // this.field.field[K.position.x][K.position.y].figure = K;
      // this.fieldForDraw = this.field.field;
      // console.log(K.available(this.fieldForDraw));
      // console.log(this.fieldForDraw);
    },

    createFigureName(cell) {
      // console.log(cell);
      if (cell.figure === null) { return '' }
      const name = cell.figure.color + cell.figure.name + '.png';
      // console.log(name);
      return name;
    },

    clearAvailableMove() {
      this.fieldForDraw = this.fieldForDraw.map((row, ) => {
        return row.map((cell, ) => {
          cell.isAvailableFor = '';
          return cell;
        })
      })
    },

    clickOnFigure(figure) {
      this.clearAvailableMove();
      this.selectedFigure = figure;
      const availableMoves = figure.available(this.fieldForDraw);
      availableMoves.forEach((moves, i) => {
        moves.forEach(move => {
          this.fieldForDraw[move.x][move.y].isAvailableFor = i === 0 ? 'move' : 'kill'
        })
      })
      console.log(this.fieldForDraw);
    },

    clickOnCell(cell, x, y) {
      if (cell.isAvailableFor === '') { return }
      this.selectedFigure.move([x,y], this.fieldForDraw);
      this.selectedFigure = null;
      this.clearAvailableMove();
      // console.log(cell);
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
  &__cell {
    @include Size(78, 78);
  }
  &__move {
    @include Size(78, 78);
    position: relative;
  }
  &__kill {
    // @include Size(78, 78);
    position: relative;
  }
  &__move::after, &__kill::after {
    position: absolute;
    content: "";
    z-index: 1;
  }
  &__move::after {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: darkgreen;

  }
  &__kill::after {
    top: 0;
    // left: 50%;
    // transform: translate(-50%, -50%);
    width: 72px;
    height: 72px;
    border: 3px solid darkred;
    background: transparent;
  }
}
.available {
  background: lightblue;
}
.white {
  background: #EDDAB9;
}
.black {
  background: #AE8868;
}
</style>