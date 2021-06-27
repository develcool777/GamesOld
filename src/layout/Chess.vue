<template>
  <div class="chess">
    <div class="chess__game">
      <div class="chess__field">
        <div class="chess__row" v-for="(row, i) in fieldForDraw" :key="i">
          <div :class="cell.color" v-for="(cell, j) in row" :key="j"></div>
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
import Pawn from '@/model/chess/figures/pawn'
import Rook from '@/model/chess/figures/rook'
import Bishop from '@/model/chess/figures/bishop'
import Queen from '@/model/chess/figures/queen'
import Knight from '@/model/chess/figures/knight'
export default {
  name: 'Chess',
  data() {
    return {
      field: {},
      fieldForDraw: []
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.field = new Field();
      this.field.createField();
      // Pawn
      const p = new Pawn('black', {x: 6, y: 0});
      const p2 = new Pawn('black', {x: 5, y: 1});
      this.field.field[p.position.x][p.position.y].figure = p;
      this.field.field[p2.position.x][p2.position.y].figure = p2;
      this.fieldForDraw = this.field.field;
      // const p2 = new Pawn('black', {x: 5, y: 1});
      // console.log(p.available(this.fieldForDraw));
      // p.move([5,1], this.fieldForDraw);
      // console.log(p.available(this.fieldForDraw));
      // console.log(p2.available(this.fieldForDraw));

      // Rook
      const r = new Rook('white', {x: 7, y: 0});
      this.field.field[r.position.x][r.position.y].figure = r;
      this.fieldForDraw = this.field.field;
     
      // console.log(this.fieldForDraw)
      // console.log(r.available(this.fieldForDraw));
      // r.move([7,5], this.fieldForDraw);
     

      // Bishop
      const b = new Bishop('black', {x: 6, y: 1});
      this.field.field[b.position.x][b.position.y].figure = b;
      this.fieldForDraw = this.field.field;
      // console.log(b.available(this.fieldForDraw))
      // b.move([7,0], this.fieldForDraw);
      // console.log(this.fieldForDraw);

      // Queen
      const q = new Queen('white', {x: 4, y: 5});
      this.field.field[q.position.x][q.position.y].figure = q;
      this.fieldForDraw = this.field.field;
      // console.log(q.available(this.fieldForDraw));
      // console.log(this.fieldForDraw);

      // knight
      const k = new Knight('white', {x: 3, y: 5});
      this.field.field[k.position.x][k.position.y].figure = k;
      this.fieldForDraw = this.field.field;
      // console.log(k.available(this.fieldForDraw));
      console.log(this.fieldForDraw);
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
}
.white {
  background: white;
  width: 50px;
  height: 50px;
}
.black {
  background: black;
  width: 50px;
  height: 50px;
}
</style>