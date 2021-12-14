<template>
  <div class="cell">
      <div v-if="cell.cellContain === 'head'" class="cell__head" :style="rotate(cell)">
        <div class="cell__face"></div>
      </div>
      <div v-if="cell.cellContain === 'body'" class="cell__body" :style="styleBody(cell)"></div>
      <div v-if="cell.cellContain === 'tail'" class="cell__tail" :style="rotate(cell)"></div>
      <div v-if="cell.cellContain === 'apple'" class="cell__food cell__food--apple"><fontAwesome icon="apple-alt"/></div>
      <div v-if="cell.cellContain === 'cookie'" class="cell__food cell__food--cookie"><fontAwesome icon="cookie"/></div>
      <div v-if="cell.cellContain === 'wall'" class="cell__wall"><fontAwesome icon="th"/></div>
      <div v-if="cell.isGuidingLine && !['head', 'body', 'tail'].includes(cell.cellContain)" class="cell__lines"></div>
  </div>
</template>

<script>
export default {
  name: 'Cell',
  props: {
    cell: Object
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

  &__body, &__tail {
    background: blue;
    @include boxShadow(0.1);
  }

  &__tail {
    border-radius: 0 25px 25px 0;
  }

  &__body::after, &__tail::after, &__lines::after {
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

  &__lines::after {
    width: 5px;
    height: 5px;
    background: chocolate;
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
</style>