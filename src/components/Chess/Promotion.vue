<template>
  <div class="promotion" :style="determine(index)">
    <div class="promotion__figure" v-for="(figure, i) in figures[index]" :key="i" @click="chooseFigure(figure.name)">
      <img class="promotion__img" :src="figure.url" :alt="figure.name">
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('chess');
export default {
  name: 'Promotion',
  props: {
    index: Number
  },
  created() {
    this.setFigures();
  },
  computed: {
    ...mapGetters(['getFigures'])
  },
  data() {
    return {
      figures: [
        [
          { name: 'whiteQueen', url: '' },
          { name: 'whiteRook', url: ''  },
          { name: 'whiteKnight', url: '' },
          { name: 'whiteBishop', url: '' }
        ],
        [
          { name: 'blackBishop', url: '' },
          { name: 'blackKnight', url: '' },
          { name: 'blackRook', url: '' },
          { name: 'blackQueen', url: '' },
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
    },
    setFigures() {
      this.figures.forEach((arr, i) => {
        arr.forEach((Figure, j) => {
          this.getFigures.forEach(figure => {
            if (figure.name === Figure.name) {
              this.figures[i][j].url = figure.url;
              return;
            }
          })
        })
      })
      console.log(this.figures);
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