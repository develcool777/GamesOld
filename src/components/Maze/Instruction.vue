<template>
  <section class="instMaze">
    <div class="instMaze__time">
      <div class="instMaze__title">Timer: {{ timeStr }}</div>
      <div class="instMaze__mainBtns">
        <div 
          class="instMaze__mainBtn" 
          @click.stop=" allowClick ? startGame() : null"
        >{{ start }}</div>
        <div
          class="instMaze__mainBtn"
          @click.stop=" !allowClick ? stopGame() : null"
          >{{ stop }}</div>
      </div>
      <div 
        class="instMaze__mainBtn" 
        @click="getIsPlaying !== undefined ? restartGame() : null"
      >Restart</div>
      <div class="instMaze__mainBtn" @click="showPath()">
        Show path: 
        <span :style="{color: getShowPath ? 'green' : 'red'}">{{getShowPath ?'ON' : 'OFF'}}</span>
      </div>
      <div class="instMaze__mainBtn" @click="showHint()">{{getShowHint ? 'Hide' : 'Show'}} hint</div>
    </div>
    <div class="instMaze__levels">
      <div class="instMaze__title">Levels</div>
      <div class="instMaze__row instMaze__row--width">
        <div class="instMaze__btn left" @click="changeLevel(-1)"></div>
         <div class="instMaze__level">Level: {{getLevel}}</div>
        <div class="instMaze__btn right" @click="changeLevel(1)"></div>
      </div>
    </div> 
    <div class="instMaze__controls">
      <div class="instMaze__title">Controls</div>
      <div class="instMaze__text">Use Arrow buttons or your keybord to control</div>
      <div class="instMaze__btns">
        <div class="instMaze__row instMaze__row--center">
          <div class="instMaze__btn up" :class="{pressed: getArrowClicked === 1}" @click="clicked('ArrowUp')"></div>
        </div>
        <div class="instMaze__row">
          <div class="instMaze__btn left" :class="{pressed: getArrowClicked === 2}" @click="clicked('ArrowLeft')"></div>
          <div class="instMaze__btn down"  :class="{pressed: getArrowClicked === 3}" @click="clicked('ArrowDown')"></div>
          <div class="instMaze__btn right" :class="{pressed: getArrowClicked === 4}" @click="clicked('ArrowRight')"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Instruction from '@/mixins/instruction'
import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapState, mapGetters } = createNamespacedHelpers('maze')
export default {
  name: 'Instruction',
  mixins: [Instruction],
  computed: {
    ...mapGetters([
      'getLevel', 'getTimer', 
      'getShowPath', 'getShowHint', 
      'getTimeForReset', 'getStopClickArrows',
      'getArrowClicked', 'getIsPlaying'
    ]),
    ...mapState([
      'gameFinished', 'level',
      'timer', 'restart'
    ]),
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
      'END_GAME', 'CHANGE_RESTART', 'CHANGE_SHOW_PATH',
      'CHANGE_SHOW_HINT'
    ]),
    clicked(arrow) {
      if (!this.getStopClickArrows) {
        this.$emit('clicked', arrow);
      }
    },
    showPath() {
      this.CHANGE_SHOW_PATH(!this.getShowPath);
    },
    showHint() {
      this.CHANGE_SHOW_HINT(!this.getShowHint);
    }
  }
}
</script>

<style lang="scss" scoped>
.instMaze {
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

.up::after {
  transform: translate(-50%, -40%) rotate(-135deg);
  -webkit-transform: translate(-50%, -40%) rotate(-135deg);
}

.down::after {
  transform: translate(-50%, -60%) rotate(45deg);
  -webkit-transform: translate(-50%, -60%) rotate(45deg);
}
.pressed {
  background: $gradient-secondary;
  transform: scale(0.9);
}
</style>