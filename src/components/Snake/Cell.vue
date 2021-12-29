<template>
  <div class="cell">
      <div v-if="cell.cellContain === 'head'" class="cell__head" :style="rotate(cell)">
        <div class="cell__face"></div>
        <div class="cell__rightEye"><div class="cell__appleOfEye"></div></div>
        <div class="cell__leftEye"><div class="cell__appleOfEye"></div></div>
        <div class="cell__nostrilRight"></div>
        <div class="cell__nostrilLeft"></div>
        <div class="cell__wrapTongue" v-if="showTongue"><div class="cell__tongue"></div></div>
      </div>
      <div v-if="cell.cellContain === 'neck'" class="cell__body" :style="styleNeck(cell)"></div>
      <div v-if="cell.cellContain === 'body'" class="cell__body" :style="styleBody(cell)"></div>
      <div v-if="cell.cellContain === 'tail'" class="cell__tail" :style="rotate(cell)"></div>
      <div v-if="cell.cellContain === 'apple'" class="cell__food cell__food--apple"><fontAwesome icon="apple-alt"/></div>
      <div v-if="cell.cellContain === 'cookie'" class="cell__food cell__food--cookie"><fontAwesome icon="cookie"/></div>
      <div v-if="cell.cellContain === 'wall'" class="cell__wall"><fontAwesome icon="th"/></div>
      <div class="cell__lines" v-if="!['head', 'neck', 'body', 'tail'].includes(cell.cellContain)">
        <div class="cell__appleLines" v-if="cell.isAppleGuidingLine"></div>
        <div class="cell__cookieLines" v-if="cell.isCookieGuidingLine"></div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'Cell',
  props: {
    cell: Object,
    headDirection: String,
    gameStatus: String
  },
  computed: {
    showTongue() {
      return ['stop', ''].includes(this.gameStatus);
    }
  },
  methods: {
    rotate(cell) {
      return { transform: `rotate(${cell.rotationAngle}deg)` }
    },

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

    styleNeck(cell) {
      const style = this.styleBody(cell);
      if (style.borderRadius === undefined) return style; 

      switch (this.headDirection) {
        case 'left':
          return { borderRadius: `${5}px 0 0 ${5}px` }
      
        case 'right':
          return { borderRadius: `0 ${5}px ${5}px 0` }

        case 'up':
          return { borderRadius: `${5}px ${5}px 0 0` }

        case 'down':
          return { borderRadius: `0 0 ${5}px ${5}px` }
      }
    }
  }
}
</script>

<style lang="scss">
.cell {
  width: 25px;
  height: 25px;
  background: #40b381;

  &__head, &__body, &__tail, &__food, &__lines, &__wall {
    position: relative;
    width: inherit;
    height: inherit;
  } 

  &__face {
    height: inherit;
    width: inherit;
    background: tomato;
    clip-path: polygon(100% 20%, 95% 10%, 85% 0, 65% 0, 50% 10%, 25% 15%, 5% 25%, 0 40%, 0 60%, 5% 75%, 25% 85%, 50% 90%, 65% 100%, 85% 100%, 95% 90%, 100% 80%);
  }

  &__rightEye, &__leftEye {
    display: flex;
    align-items: center;
    position: absolute;
    right: 3px;
    width: 7px; 
    height: 7px; 
    border-radius: 50%;
    background: white;
  }

  &__rightEye {
    top: 4px;
  }

  &__leftEye {
    bottom: 4px;
  }

  &__appleOfEye {
    width: inherit;
    height: 3px;
    background: black;
    border-radius: 50%;
  }

  &__nostrilRight, &__nostrilLeft {
    position: absolute;
    left: 5px;
    width: 2px;
    height: 2px;
    border-radius: 50%;
    background: black;
  }

  &__nostrilRight {
    top: 7px;
  }

  &__nostrilLeft {
    bottom: 7px;
  }

  &__wrapTongue {
    position: absolute;
    right: 100%;
    top: 0;
    width: inherit;
    height: inherit;
    overflow: hidden;
  }

  &__tongue {
    background: crimson;
    width: inherit;
    height: inherit;
    clip-path: polygon(100% 55%, 70% 60%, 60% 70%, 50% 60%, 65% 50%, 50% 40%, 60% 30%, 70% 40%, 100% 45%);
    animation: tongue 1s infinite alternate;
  }

  &__body, &__tail {
    background: blue;
    @include boxShadow(0.1);
  }

  &__tail {
    border-radius: 0 25px 25px 0;
  }

  &__body::after, &__tail::after {
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

  &__appleLines, &__cookieLines {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
  }

  &__appleLines {
    width: 5px;
    height: 5px;
    background: chocolate;
    animation: appleLine .5s infinite alternate;
  }

  &__cookieLines {
    width: 10px;
    height: 10px;
    background: transparent;
    border: 2px solid yellow;
    animation: cookieLine .5s infinite alternate;
  }

  &__food {
    @include Flex(center);
    font-size: 25px;
    animation: food .5s infinite alternate;
    &--apple {
      color: red;
    }
    &--cookie {
      border-radius: 50%;
      color: goldenrod;
      background: black;
      box-shadow:
        inset 1px 1px 10px yellow,
        inset -1px -1px 10px yellow,
        1px 1px 10px goldenrod,
        -1px -1px 10px goldenrod;
    }
  }

  &__wall {
    @include Flex(center);
    color: red;
    background: whitesmoke;
    font-size: 23px;
    border-radius: 2px;
    @include boxShadow(0.1);
  }
}

@keyframes food {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.1);
  }
}

@keyframes tongue {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes appleLine {
  0% {
    background: chocolate;
  }
  100% {
    background: brown;
  }
}

@keyframes cookieLine {
  0% {
    border-color: yellow;
  }
  100% {
    border-color: gold;
  }
}
</style>