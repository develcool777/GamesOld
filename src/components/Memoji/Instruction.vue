<template>
  <section class="instMemoji">
    <div class="instMemoji__time">
      <div class="instMemoji__title">Timer: {{timer}}</div>
      <div class="instMemoji__mainBtns">
        <div class="instMemoji__mainBtn" @click="startGame()"> {{start}} </div>
        <div class="instMemoji__mainBtn" @click="stopGame()"> {{stop}} </div>
        <div class="instMemoji__mainBtn" @click="finishGame()">Finish</div>
        <div class="instMemoji__mainBtn" @click="restartGame()">Restart</div>
        <div class="instMemoji__mainBtn" @click="showHint()" :style="setFontSize()"> {{ hint }} </div>
      </div>
    </div>
    <div class="instMemoji__levels">
      <div class="instMemoji__title">Levels</div>
      <div class="instMemoji__row instMemoji__row--width">
        <div class="instMemoji__btn left" @click="changeLevel(-1)"></div>
         <div class="instMemoji__level">Level: {{getLevel}}</div>
        <div class="instMemoji__btn right" @click="changeLevel(1)"></div>
      </div>
    </div> 
  </section>
</template>
<script>
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapGetters } = createNamespacedHelpers('memoji')
export default {
  name: 'Instruction',
  props: {
    timer: String,
    attempts: Number,
    gameStatus: String 
  },
  computed: {
    ...mapGetters(['getLevel']),

    ...mapState(['level']),

    hint() {
      return this.attempts > 0 ? `Show hint(${this.attempts}/3)` : 'Run out of attempts'
    },

    start() {
      return  this.gameStatus === 'start' ? 'Started' : 'Start';
    },
    
    stop() {
      return this.gameStatus === 'pause' ? 'Stoped' : 'Stop';
    }
  },
  methods: {
    finishGame() {
      if (!['start', 'stop'].includes(this.gameStatus)) { return }
      this.$emit('finishGame');
    },

    changeLevel(step) {
      if (!['', 'finish'].includes(this.gameStatus)) { return }
      this.$emit('changeLevel', step);
    },

    showHint() {
      this.$emit('showHint');
    },

    restartGame() {
      if (!['start', 'stop'].includes(this.gameStatus)) { return }
      this.$emit('restart');
    },

    startGame() {
      if (this.gameStatus === 'start') { return }
      this.$emit('startGame');
    },

    stopGame() {
      if (this.gameStatus === 'stop') { return }
      this.$emit('stopGame');
    },

    setFontSize() {
      return this.attempts === 0 ? {fontSize: '20px'} : {};
    }
  }
}
</script>

<style lang="scss" scoped>
.instMemoji {
  @include Instruction(true, true);
}
.up, .down, .left, .right {
  position: relative;
}
.up::after, .down::after, .left::after, .right::after {
  position: absolute;
  content: '';
  top: 50%;
  left: 50%;
  width: 3px;
  height: 3px;
  border: solid $white;
  border-radius: 2px;
  border-width: 0 5px 5px 0;
  display: inline-block;
  padding: 5px;
}
.right::after {
  transform: translate(-60%, -50%) rotate(-45deg);
  -webkit-transform: translate(-60%, -50%) rotate(-45deg);
}

.left::after {
  transform: translate(-40%, -50%)  rotate(135deg);
  -webkit-transform: translate(-40%, -50%) rotate(135deg);
}
</style>