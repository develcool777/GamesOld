<template>
  <div class="history" ref="history" :style="{height: `${historyHeight}px`}"> 
    <div class="history__list">
      <div 
        class="history__block" 
        v-for="(moves, i) in historyNotation.value.notation" 
        :key="i" 
        :style="{height: `${blockHeight}px`}"
      >
        <div class="history__counter">{{ i + 1 }}</div>
        <div class="history__moves">
          <div 
            :ref="`Move_${move.index}`"
            class="history__move" 
            v-for="(move, j) in moves" 
            :key="j" 
            :style="styleMove(move.color, move.index)" 
            @click="showMove(move.index)"
            @mouseover="hoverMove(true, move.index)"
            @mouseleave="hoverMove(false, move.index)"
          >
            <fontAwesome v-if="move.showFigure" :icon="move.figure" class="history__figure"/>
            <p class="history__text">{{ move.move }}</p>
            <fontAwesome v-if="move.promotionFigure" :icon="move.promotionFigure" class="history__figure"/>
            <p v-if="move.isCheck">+</p>
            <p v-if="move.isCheckmate">#</p>
            <p v-if="move.isStalemate">&</p>
            <p class="history__materialRatio">{{ showMaterialRatio(move.materialRatio) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('chess');
export default {
  name: 'History',
  inject: ['historyNotation'],
  watch: {
    historyNotation: {
      handler: function (newVal) {
        newVal.value && this.scrollList();
      },
      deep: true
    }
  }, 
  data() {
    return {
      historyHeight: 450,
      blockHeight: 30
    }
  },
  methods: {
    ...mapActions(['CHANGE_EMIT_INDEX']),
    
    scrollList() {
      const movesHeight = this.blockHeight * this.historyNotation.value.notation.length;
      setTimeout(() => {
        this.$refs.history.scrollTop = movesHeight > this.historyHeight 
          ? movesHeight - this.historyHeight 
          : 0
      })
    },

    styleMove(color, moveIndex) {
      return moveIndex === this.historyNotation.value.currentIndex
        ? {color: color, cursor: 'default', background: 'teal'}
        : {color: color, cursor: 'default', background: 'transparent'}
    },

    hoverMove(isHover, moveIndex) {
      if (this.historyNotation.value.gameStatus !== 'finish') { return } 
      if (moveIndex === this.historyNotation.value.currentIndex) { return }

      this.$refs[`Move_${moveIndex}`].style.background = isHover 
        ? `lightseagreen` 
        : 'transparent' 
      this.$refs[`Move_${moveIndex}`].style.cursor = isHover 
        ? 'pointer' 
        : 'default' 
    },

    showMove(index) {
      if (this.historyNotation.value.gameStatus !== 'finish') { return } 
      this.CHANGE_EMIT_INDEX(index);
    },

    showMaterialRatio(num) {
      return num > 0 ? `+${num}` : num
    }
  }
}
</script>

<style lang="scss" scopped>
.history {
  overflow-y: scroll;
  background: darkslategrey;

  &__block, &__moves, &__move, &__counter {
    display: flex;
    align-items: center;
    height: 100%;
  }

  &__move {
    position: relative;
    width: 130px;
    padding-left: 5px;
    transition-duration: .5s;
  }

  &__materialRatio {
    position: absolute;
    top: 50%;
    right: 5%;
    transform: translateY(-50%);
    color: navajowhite;
    font-size: 14px;
  }

  &__counter {
    justify-content: center;
    font-size: 18px;
    border-right: 1px solid gray;
    color: #6b6b6b;
    background: #302e2c;
    width: 39px;
  }

  &__figure {
    font-size: 16px;
  }

  &__text {
    font-size: 18px;
  }
}
</style>