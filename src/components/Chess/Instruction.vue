<template>
  <section class="instChess">
    <div class="instChess__mainBtns">
      <div class="instChess__mainBtn" @click="startGame('start')">{{ showBtnName() }}</div>
      <div class="instChess__mainBtn" @click="clear()">Clear Board</div>
      <div class="instChess__mainBtn" v-if="['start', 'finish'].includes(gameStatus)" @click="flipBoard()">Flip Board</div>
      <div class="instChess__mainBtn" v-if="historyLen > 1" @click="returnMove()">Return Move</div>
      <History/>
      <div class="instChess__analyze" v-if="getAnalyze">

        <div class="instChess__title">Controls</div>
        <div class="instChess__analyzeBtns">
          <div class="instChess__start" title="To start position" @click="changePosition('start')"></div>
          <div class="instChess__prev" title="To previous position" @click="changePosition('prev')"></div>
          <div class="instChess__next" title="To next position" @click="changePosition('next')"></div>
          <div class="instChess__end" title="To end position" @click="changePosition('end')"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapActions } = createNamespacedHelpers('chess');
import History from '@/components/Chess/History';
export default {
  name: 'Instruction',
  components: {
    History
  },
  props: {
    gameStatus: String,
    historyLen: Number
  },
  computed: {
    ...mapGetters(['getAnalyze']) 
  },
  methods: {
    ...mapActions(['CHANGE_ANALYZE']),

    showBtnName() {
      if (this.gameStatus === 'start') {
        return 'Game Started';
      }
      if (this.gameStatus === '') {
        return 'Start Game';
      }
      if (this.gameStatus === 'finish') {
        return 'Game Finished';
      }
    },
    
    startGame() {
      if (this.gameStatus === 'finish' || this.gameStatus === 'start') { return }
      this.$emit('startGame');
    },

    clear() {
      this.$emit('clearBoard');
      this.CHANGE_ANALYZE(false);
    },

    returnMove() {
      this.$emit('returnMove');
    },

    changePosition(direction) {
      this.$emit('changePosition', direction);
    },

    flipBoard() {
      this.$emit('flipBoard');
    }
  }
}
</script>

<style lang="scss" scoped>
.instChess {
  @include Instruction();
  &__mainBtns {
    margin-top: 30px;
  }

  &__analyze {
    width: 200px;
    margin-top: 20px;
  }

  &__title {
    font-size: 20px;
    color: white;
  }

  &__analyzeBtns {
    @include Flex(space-between);
  }

  &__start, &__prev, &__next, &__end {
    position: relative;
    width: 45px;
    height: 20px;
    background: chocolate;
    border-radius: 20px;
    cursor: pointer;
    transition-duration: .5s;
  }

  &__start:hover, &__prev:hover, &__next:hover, &__end:hover {
    background: lighten(chocolate, 10%);
  }

  &__start::after, &__prev::after, &__next::after, &__end::after {
    position: absolute;
    content: '<<';
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
  }

  &__prev::after {
    content: '<';
  }

  &__next::after {
    content: '>';
  }

  &__end::after {
    content: '>>';
  }
}
</style>