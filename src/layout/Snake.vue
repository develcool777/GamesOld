<template>
  <div class="snake">
    <div class="snake__game">
      <div 
        class="snake__cell" 
        v-for="(cell, i) in gameField"
        :key="i"
      >
        <div v-if="cell.cellContain === 'head'" class="snake__head" :style="rotateHead">
          <div class="snake__face"></div>
        </div>
        <div v-if="cell.cellContain === 'body'" class="snake__body" :style="styleBody(cell)"></div>
        <div v-if="cell.cellContain === 'tail'" class="snake__tail" :style="rotateTail"></div>
        <div v-if="cell.cellContain === 'food'" class="snake__food"><fontAwesome icon="apple-alt"/></div>
        <div v-if="cell.cellContain === 'wall'" class="snake__wall"><fontAwesome icon="th"/></div>
        <div v-if="cell.isGuidingLine && !['head', 'body', 'tail'].includes(cell.cellContain)" class="snake__lines"></div>
      </div>
    </div>
    <button @click="start()">start</button>
    <button @click="stop()">stop</button>
    <div class="snake__score">{{ getScore }}</div>
  </div>
</template>

<script>
import Game from '@/model/snake/game'
export default {
  name: 'Snake',
  created() {
    this.GAME = new Game(40, 25);
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
      return this.GAME?.fieldForRender.flat();
    },

    getScore() {
      return this.GAME?.score;
    },

    rotateHead() {
      const angle = this.GAME?.snakeInstance.rotateHead();
      return { transform: `rotate(${angle}deg)` }
    },

    rotateTail() {
      const angle = this.GAME?.snakeInstance.rotateTail();
      return { transform: `rotate(${angle}deg)` }
    }
  },
  methods: {
    styleBody(cell) {
      switch (cell.adjustSnakeBodyOnTurn) {
        case 'top-left':
          return { borderTopLeftRadius: `${20}px` }

        case 'top-right':
          return { borderTopRightRadius: `${20}px` }

        case 'bottom-left':
          return { borderBottomLeftRadius: `${20}px` }

        case 'bottom-right':
          return { borderBottomRightRadius: `${20}px` }

        default: return { borderRadius: 0 }
      }
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
    width: 1000px;
  }

  &__cell {
    width: 25px;
    height: 25px;
    background: #40b381;
  }

  &__body,  &__food, &__head, &__tail, &__lines {
    width: inherit;
    height: inherit;
  }

  &__body {
    position: relative;
    background: blue;
    @include boxShadow(0.1);
  }

  &__body::after {
    position: absolute;
    content: '';
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 8px; 
    height: 8px;
    background: white;
    border-radius: 50%;
  }

  &__food {
    @include Flex(center);
    color: red;
    font-size: 25px;
    animation: food .5s infinite alternate;
    z-index: 1;
  }

  &__wall {
    @include Flex(center);
    color: red;
    background: whitesmoke;
    font-size: 25px;
    border-radius: 2px;
    @include boxShadow(0.1);
  }

  &__head {
    position: relative;
  }

  &__face {
    border-top: 5px solid transparent;
    border-right: 25px solid tomato;
    border-bottom: 5px solid transparent; 
    height: inherit;
    width: 0;
  }

  &__head::before, &__head::after {
    position: absolute;
    right: 7px;
    content: '';
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: white;
    transform: translateY(-50%);
  }

  &__head::before {
    top: 8px;
  }

  &__head::after {
    top: 16px;
  }

  &__tail {
    position: relative;
    background: blue;
    border-radius: 0 25px 25px 0;
    @include boxShadow(0.1);
  }

  &__tail::after {
    position: absolute;
    content: '';
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 8px; 
    height: 8px;
    background: white;
    border-radius: 50%;
  }

  &__lines {
    position: relative;
  }

  &__lines::after {
    position: absolute;
    content: '';
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 5px;
    height: 5px;
    background: chocolate;
    border-radius: 50%;
  }
}

@keyframes food {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.2);
  }
}
</style>