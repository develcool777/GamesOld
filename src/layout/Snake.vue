<template>
  <div class="snake">
    <div class="snake__game">
      <div 
        class="snake__cell" 
        v-for="(cell, i) in gameField.flat()"
        :key="i"
        :style="decideColor(cell)"
      ></div>
    </div>
    <button @click="start()">start</button>
    <button @click="stop()">stop</button>
  </div>
</template>

<script>
import Game from '@/model/snake/game'
export default {
  name: 'Snake',
  created() {
    this.GAME = new Game(40, 20);
    this.GAME.init();
    this.GAME.gameControl();
  },
  data() {
    return {
      GAME: {},
    }
  },
  computed: {
    gameField() {
      return this.GAME?.field;
    }
  },
  methods: {
    decideColor(cell) {
      if (cell.food) return { background: 'red' }
      if (cell.hasSnakePart) return { background: 'blue' }
      return { background: '#40b381' }
    },

    stop() {
      window.cancelAnimationFrame(this.GAME.requestID);
    },

    start() {
      this.GAME.requestID = window.requestAnimationFrame(() => this.GAME.gameLoop(Date.now()))
    }
  }
}
</script>

<style lang="scss" scoped>
.snake {
  @include Flex(center);
  flex: 1;

  &__game {
    @include Flex(center);
    flex-wrap: wrap;
    width: 800px;
  }

  &__cell {
    width: 20px;
    height: 20px;
    background: gray;
  }
}
</style>