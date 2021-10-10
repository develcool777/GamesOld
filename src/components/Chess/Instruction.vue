<template>
  <section class="instChess">
    <div class="instChess__options">
      <div 
        ref="Play"
        class="instChess__wrapperDiv"
        :style="stylePlay"
        @mouseover="hoverPlay(true)"
        @mouseleave="hoverPlay(false)"
        @click="startGame('start')"
      >
        <fontAwesome icon="play" :title="stylePlayTitle"/>
      </div>

      <div 
        ref="ClearBoard"
        class="instChess__wrapperDiv"
        :style="styleClearBoard"
        @mouseover="hoverClearBoard(true)"
        @mouseleave="hoverClearBoard(false)"
        @click="clear()"
      >
        <fontAwesome icon="chess-board" title="Clear board"/>
      </div>

      <div 
        ref="FlipBoard"
        class="instChess__wrapperDiv"
        :style="styleFlipBoard"
        @click="flipBoard()"
        @mouseover="hoverFlipBoard(true)"
        @mouseleave="hoverFlipBoard(false)"
      >
        <fontAwesome icon="retweet" title="Flip board"/>
      </div>

      <div 
        class="instChess__wrapperDiv"
        ref="ReturnMove" 
        :style="styleReturnMove"
        @mouseover="hoverReturnMove(true)"
        @mouseleave="hoverReturnMove(false)"
        @click="returnMove()"
      >
        <fontAwesome icon="undo" title="Return move"/>
      </div>
    </div>

    <div class="instChess__result" v-if="result !== ''">{{ result }}</div>

    <History/>

    <div class="instChess__options">
      <div 
        ref="DoublePrev"
        class="instChess__wrapperDiv"
        :style="stylePrev"
        @click="changePosition('start')"
        @mouseover="hoverControls(true, 'DoublePrev')"
        @mouseleave="hoverControls(false, 'DoublePrev')"
      >
        <fontAwesome icon="angle-double-left" title="To start position"/>
      </div>

      <div 
        ref="Prev"
        class="instChess__wrapperDiv"
        :style="stylePrev"
        @click="changePosition('prev')"
        @mouseover="hoverControls(true, 'Prev')"
        @mouseleave="hoverControls(false, 'Prev')"
      >
        <fontAwesome icon="angle-left" title="To previous position"/>
      </div>

      <div 
        ref="Next"
        class="instChess__wrapperDiv"
        @click="changePosition('next')"
        :style="styleNext"
        @mouseover="hoverControls(true, 'Next')"
        @mouseleave="hoverControls(false, 'Next')"
      >
        <fontAwesome icon="angle-right" title="To next position"/>
      </div>

      <div 
        ref="DoubleNext"
        class="instChess__wrapperDiv"
        @click="changePosition('end')"
        :style="styleNext"
        @mouseover="hoverControls(true, 'DoubleNext')"
        @mouseleave="hoverControls(false, 'DoubleNext')"
      >
        <fontAwesome icon="angle-double-right" title="To end position"/>
      </div>
    </div>
  </section>
</template>

<script>
import History from '@/components/Chess/History';
export default {
  name: 'Instruction',
  components: {
    History
  },
  props: {
    gameStatus: String,
    historyLen: Number,
    boardFlipped: Boolean,
    currentIndex: Number,
    result: String
  },
  computed: {
    styleFlipBoard() {
      return this.boardFlipped 
        ? {color: 'tomato', cursor: 'pointer', transform: `rotate(${180}deg)`}
        : {color: 'white', cursor: 'pointer', transform: `rotate(${-180}deg)`}
    },

    styleReturnMove() {
      return this.historyLen <= 1 || this.gameStatus === 'finish'
        ? {color: 'darkgrey', cursor: 'default'} 
        : {color: 'white', cursor: 'pointer'}
    },

    styleClearBoard() {
      return this.gameStatus !== ''
        ? {color: 'white', cursor: 'pointer'} 
        : {color: 'darkgrey', cursor: 'default'}
    },

    stylePlay() {
      return  this.gameStatus === ''
        ? {color: 'white', cursor: 'pointer'} 
        : this.gameStatus === 'start'
          ? {color: 'green', cursor: 'default'} 
          : {color: 'darkred', cursor: 'default'} 
    },

    stylePlayTitle() {
      return this.gameStatus === ''
        ? 'Start game'
        : this.gameStatus === 'start'
          ? 'Game started'
          : 'Game finished'
    },

    stylePrev() {
      if (this.gameStatus !== 'finish') { return {color: 'gray', cursor: 'default'} }
      return this.currentIndex === 0
        ? {color: 'gray', cursor: 'default'}
        : {color: 'white', cursor: 'pointer'}
    },

    styleNext() {
      if (this.gameStatus !== 'finish') { return {color: 'gray', cursor: 'default'} }
      return this.currentIndex === this.historyLen - 1
        ? {color: 'gray', cursor: 'default'}
        : {color: 'white', cursor: 'pointer'}
    }
  },
  methods: {
    startGame() {
      if (this.gameStatus !== '') { return }
      this.$emit('startGame');
    },

    clear() {
      if (this.gameStatus === '') { return }
      this.$emit('clearBoard');
    },

    returnMove() {
      if (this.historyLen <= 1 || this.gameStatus === 'finish') { return }

      const decideDeg = this.$refs.ReturnMove.style.transform === '' 
        ? -360
        : parseInt(this.$refs.ReturnMove.style.transform.substring(7)) - 360;
      this.$refs.ReturnMove.style.transform = `rotate(${decideDeg}deg)`;

      this.$emit('returnMove');
    },

    hoverReturnMove(isHover) {
      if (this.historyLen <= 1 || this.gameStatus === 'finish') { return }
      this.$refs.ReturnMove.style.color = isHover ? 'chocolate' : 'white';
    },

    hoverClearBoard(isHover) {
      if (this.gameStatus === '') { return }
      this.$refs.ClearBoard.style.color = isHover ? 'chocolate' : 'white';
    },

    hoverFlipBoard(isHover) {
      this.$refs.FlipBoard.style.color = isHover 
        ? 'chocolate' 
        : this.boardFlipped
          ? 'tomato'
          : 'white'
    },    

    hoverPlay(isHover) {
      if (this.gameStatus !== '') { return }
      this.$refs.Play.style.color = isHover 
        ? 'chocolate' 
        : 'white'
    },

    hoverControls(isHover, ref) {
      if (this.gameStatus !== 'finish') { return }

      if (ref === 'DoublePrev' && this.currentIndex !== 0) {
        this.$refs.DoublePrev.style.color = isHover ? 'chocolate' : 'white'
      }
      if (ref === 'Prev' && this.currentIndex !== 0) {
        this.$refs.Prev.style.color = isHover ? 'chocolate' : 'white'
      }
      if (ref === 'Next' && this.currentIndex !== this.historyLen - 1) {
        this.$refs.Next.style.color = isHover ? 'chocolate' : 'white'
      }
      if (ref === 'DoubleNext' && this.currentIndex !== this.historyLen - 1) {
        this.$refs.DoubleNext.style.color = isHover ? 'chocolate' : 'white'
      }
    },

    changePosition(direction) {
      if (this.gameStatus !== 'finish') { return }

      let index;
      if (direction === 'start') {
        index = 0;
      }
      if (direction === 'prev') {
        index = this.currentIndex === 0 
          ? 0 
          : this.currentIndex - 1;
      }
      if (direction === 'next') {
        index = this.currentIndex === this.historyLen - 1 
          ? this.historyLen - 1 
          : this.currentIndex + 1;
      }
      if (direction === 'end') {
        index = this.historyLen - 1;
      }
      index !== undefined && this.$emit('changePosition', index);
    },

    flipBoard() {
      this.$emit('flipBoard');
    }
  }
}
</script>

<style lang="scss" scoped>
.instChess {
  &__options {
    @include Flex(space-around);
    height: 49px;
    background: #302e2c;
  }

  &__options:first-child {
    border-bottom: 1px solid gray;
    border-radius: 5px 5px 0 0;
  }

  &__options:last-child {
    border-top: 1px solid gray;
    border-radius: 0 0 5px 5px;
  }

  &__wrapperDiv {
    transition-duration: .5s;
    font-size: 25px;
  }

  &__result {
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 20px;
    height: 69px;
    border-bottom: 1px solid gray;
    background: #302e2c;
  }
}
</style>