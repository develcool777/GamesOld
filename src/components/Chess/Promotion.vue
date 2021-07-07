<template>
  <div class="promotion" :style="determine(index)">
    <div class="promotion__figure" v-for="(name, i) in figures[index]" :key="i" @click="chooseFigure(name)">
      <img class="promotion__img" :src="require(`@/assets/chess/${name}`)" alt="">
    </div>
  </div>
</template>

<script>
export default {
  name: 'Promotion',
  props: {
    index: Number
  },
  data() {
    return {
      figures: [
        [
          'whiteQueen.png',
          'whiteRook.png',
          'whiteKnight.png',
          'whiteBishop.png'
        ], 
        [
          'blackBishop.png',
          'blackKnight.png',
          'blackRook.png',
          'blackQueen.png'
        ], 
      ]
    }
  },
  methods: {
    chooseFigure(name) {
      const figure = name.split('.')[0];
      this.$emit('promotion', figure);
    },
    determine(index) {
      if (index === 0) {
        return {top: 0};
      }
      return {bottom: 0};
    }
  }
}
</script>

<style lang="scss">
.promotion {
  position: absolute;
  left: 0;
  width: 100%;
  height: 100% * 4;
  z-index: 6;
  &__figure {
    @include Flex(center);
    width: 100%;
    height: 78px;
    background: lightslategray;
    border-radius: 50%;
    transition-duration: .3s;
  }
  &__img {
    width: 78px;
    height: 78px;
    outline: none;
    border: none;
    transition-duration: .3s;

    transform: scale(0.7);
  }
  &__figure:hover {
    border-radius: 0;
    background: lightsalmon;
  }
  &__figure:hover  &__img{
    transform: scale(1);
    cursor: pointer;
  }
}
</style>