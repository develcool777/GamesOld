<template>
  <div class="error">
    <div class="error__title">
      Something went wrong
      <router-link class="error__home" tag="div" to="/">Go to home page</router-link>
    </div>
    <div class="error__animation">
      <div class="error__404">
        <div class="error__row" v-for="(row, i) in matrix" :key="i">
          <div 
            class="error__cell" 
            v-for="(cell, j) in row" 
            :key="j"
            :style="styleСell(cell)"
          >{{ hideNumbers ? '' : cell.num }}</div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import DATA from '@/data/notFound.js'
export default {
  name: 'NotFound',
  created() {
    this.createMatrix();
    this.merge();
    setTimeout(() => this.colorize(), 1000);
  },
  data() {
    return {
      matrix: [],
      index: 0,
      hideNumbers: false,
      intervalID: null
    }
  },
  methods: {
    createMatrix() {
      const sizeRow = 40; // 30
      const sizeCol = 20; // 10
      const maxNum = 10
      const result = [];
      for (let i = 0; i< sizeCol; i++) {
        const row = [];
        for (let j = 0; j < sizeRow; j++) {
          const rand = Math.floor(Math.random() * maxNum);
          const decideNum = rand === 4 ? 3 : rand === 0 ? 1 : rand
          row.push({num: decideNum, changeColor: false});
        }
        result.push(row);
      }

      this.matrix = result;
    },

    merge() {
      DATA.forEach(obj => {
        this.matrix[obj.x][obj.y].num = obj.value
      });
    },

    styleСell(cell) {
      const num = cell.num;
      if (!cell.changeColor) { return }

      if ([0, 4].includes(num)) {
        return {background: 'red'}
      }
      if (num === 1) {
        return {background: 'darkkhaki'}
      }
      if (num === 2) {
        return {background: 'darksalmon'}
      }
      if (num === 3) {
        return {background: 'darkseagreen'}
      }
      if (num === 5) {
        return {background: 'lightcoral'}
      }
      if (num === 6) {
        return {background: 'lightskyblue'}
      }
      if (num === 7) {
        return {background: 'lightpink'}
      }
      if (num === 8) {
        return {background: 'lightsteelblue'}
      }
      if (num === 9) {
        return {background: 'lightgreen'}
      }
      return {background: 'cornsilk'}
    },

    colorize() {
      const func = (index) => {
        this.matrix.forEach((_, i) => {
          this.matrix[i][index].changeColor = true;
        })
      }

      this.intervalID = setInterval(() => {
        func(this.index);
        const condition = this.index === this.matrix[0].length - 1
        if (condition) { 
          clearInterval(this.intervalID); 
          setTimeout(() => this.hideNumbers = true, 500)
        }
        this.index += condition ? 0 : 1;
      }, 500);
    },
  },
  beforeUnmount() {
    clearInterval(this.intervalID);
  }
}
</script>

<style lang="scss" scopped>
.error {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: slategray;

  &__title {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 50px;
    font-style: italic;
    background: darkslategray;
    color: white;
  } 

  &__home {
    display: inline-block;
    color: lightblue;
    font-size: 20px;
    text-decoration: none;
  }

  &__home:hover {
    text-decoration: underline;
  }

  &__animation {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__404 {
    display: flex;
    flex-direction: column;
    width: 800px;
  }

  &__row {
    display: flex;
    justify-content: space-between;
  }

  &__cell {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 20px;
    height: 20px;
    background: cornsilk;
    transition-duration: .5s;
  }
}
</style>