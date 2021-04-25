<template>
  <section class="instMemoji">
    <div class="instMemoji__time">
      <div class="instMemoji__title">Timer: {{ timeStr }}</div>
      <div class="instMemoji__mainBtns">
        <div 
          class="instMemoji__mainBtn" 
          @click=" allowClick ? startGame() : null"
        >{{ start }}</div>
        <div
          class="instMemoji__mainBtn"
          @click=" !allowClick ? stopGame() : null"
          >{{ stop }}</div>
      </div>
      <div 
        class="instMemoji__mainBtn" 
        @click=" getIsPlaying !== undefined ? restartGame() : null"
      >Restart</div>
      <div 
        class="instMemoji__mainBtn" 
        @click="showHint()" 
        :style="setFontSize()"
      >{{ hint }}</div>
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
import Instruction from '@/mixins/instruction'
import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapState, mapGetters } = createNamespacedHelpers('memoji')
export default {
  name: 'Instruction',
  created() {
    this.timeForPrint(this.getTimer);
  },
  mixins: [Instruction],
  data() {
    return {
      attempts: 3
    }
  },
  watch: {
    level: function(newVal) {
      if (newVal) {
        this.timeForPrint(this.getTimer);
        this.attempts = 3;
      }
    },
    timer: function(newVal) {
      if (newVal === this.getTimeForReset) {
        this.timeForPrint(newVal);
        this.attempts = 3;
      }
    },
    restart: function(newVal) {
      if (newVal) {
        this.startGame();
        this.attempts = 3;
      }
    }
  },
  computed: {
    ...mapGetters([
      'getLevel', 'getTimer',
      'getTimeForReset', 'getIsPlaying',
      'getShowHint'
    ]),
    ...mapState([
      'gameFinished', 'level',
      'timer', 'restart'
    ]),
    hint() {
      return this.attempts > 0 ? `Show hint(${this.attempts}/3)` : 'Run out of attempts'
    },
    start() {
      return this.getIsPlaying === undefined ? 'Start' : this.getIsPlaying ? 'Started' : 'Start';
    },
    stop() {
      return this.getIsPlaying === undefined ? 'Stop' : !this.getIsPlaying ? 'Stoped' : 'Stop';
    }
  },
  methods: {
    ...mapActions([
      'CHANGE_LEVEl', 'CHANGE_TIMER', 'CHANGE_ISPLAYING',
      'END_GAME', 'CHANGE_RESTART',
      'CHANGE_SHOW_HINT', 'REMOVE_ITEMS_FOR_COMPARE'
    ]),
    showHint() {
      if (
        this.attempts === 0  
        || this.getIsPlaying !== true 
        || this.getShowHint === true
      ) { return }
      this.REMOVE_ITEMS_FOR_COMPARE();
      this.CHANGE_SHOW_HINT(true);
      if (this.attempts > 0) {
        this.attempts--;
      }
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