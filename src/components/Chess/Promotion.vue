<template>
  <div class="promotion" :style="determine">
    <div class="promotion__figure" v-for="(figure, i) in getFigures" :key="i" @click="chooseFigure(figure.name)">
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
    index: Number,
    boardFlipped: Boolean
  },
  computed: {
    ...mapGetters(['getFigures']),

    getFigures() {
      const figures = JSON.parse(JSON.stringify(this.figures[this.index]));
      return this.boardFlipped ? figures.reverse() : figures;
    },

    determine() {
      if (this.boardFlipped) {
        return this.index === 0 ? {bottom: 0} : {top: 0};
      }
      return this.index === 0  ? {top: 0} : {bottom: 0};
    }
  },
  data() {
    return {
      figures: [
        [
          { name: 'whiteQueen', url: 'https://firebasestorage.googleapis.com/v0/b/games-65e21.appspot.com/o/chessFigures%2FwhiteQueen.png?alt=media&token=d22a2d58-cebd-4c06-b172-7303fee9fc76' },
          { name: 'whiteRook', url: 'https://firebasestorage.googleapis.com/v0/b/games-65e21.appspot.com/o/chessFigures%2FwhiteRook.png?alt=media&token=fe2fd69b-f37a-42a4-a7e5-5158532697f9'  },
          { name: 'whiteKnight', url: 'https://firebasestorage.googleapis.com/v0/b/games-65e21.appspot.com/o/chessFigures%2FwhiteKnight.png?alt=media&token=9905a666-40bd-4b81-89c8-a567a68c6366' },
          { name: 'whiteBishop', url: 'https://firebasestorage.googleapis.com/v0/b/games-65e21.appspot.com/o/chessFigures%2FwhiteBishop.png?alt=media&token=bed63402-db6a-4e64-813c-e780bc2dae50' }
        ],
        [
          { name: 'blackBishop', url: 'https://firebasestorage.googleapis.com/v0/b/games-65e21.appspot.com/o/chessFigures%2FblackBishop.png?alt=media&token=7ffdee9b-722f-4e88-a4cb-35e652a7cc3d' },
          { name: 'blackKnight', url: 'https://firebasestorage.googleapis.com/v0/b/games-65e21.appspot.com/o/chessFigures%2FblackKnight.png?alt=media&token=ac4ccd11-6808-42ee-a97e-f0476ee4897f' },
          { name: 'blackRook', url: 'https://firebasestorage.googleapis.com/v0/b/games-65e21.appspot.com/o/chessFigures%2FblackRook.png?alt=media&token=5c9ebb89-8037-45ed-b476-31620e53f48a' },
          { name: 'blackQueen', url: 'https://firebasestorage.googleapis.com/v0/b/games-65e21.appspot.com/o/chessFigures%2FblackQueen.png?alt=media&token=46103654-a690-4fd7-88db-5d747ac46dcc' },
        ], 
      ]
    }
  },
  methods: {
    chooseFigure(name) {
      const figure = name.split('.')[0];
      this.$emit('promotion', figure);
    }
  }
}
</script>

<style lang="scss" scopped>
.promotion {
  position: absolute;
  left: 0;
  width: 100%;
  height: calc(100% * 4);
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