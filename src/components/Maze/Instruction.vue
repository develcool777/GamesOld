<template>
  <section class="instruction">
    <div class="instruction__time">
      <div class="instruction__title">Timer: {{ timeStr }}</div>
      <div class="instruction__mainBtns">
        <div 
          class="instruction__mainBtn green" 
          @click.stop=" allowClick ? startGame() : null"
        >{{ isPlaying === undefined ? 'Start' : isPlaying ? 'Started' : 'Start'}}</div>
        <div
          class="instruction__mainBtn red"
          @click.stop=" !allowClick ? stopGame() : null"
          >{{ isPlaying === undefined ? 'Stop' : !isPlaying ? 'Stoped' : 'Stop'}}</div>
      </div>
      <div class="instruction__mainBtn" @click="restartGame()">Restart</div>
      <div class="instruction__mainBtn" @click="showPath()">
        Show path: <span :style="{color: getShowPath ? 'green' : 'red'}">{{getShowPath ?'ON' : 'OFF'}}</span>
      </div>
      <div class="instruction__mainBtn" @click="showHint()">{{getShowHint ? 'Hide' : 'Show'}} hint</div>
    </div>
    <div class="instruction__levels">
      <div class="instruction__title">Levels</div>
      <div class="instruction__row instruction__row--width">
        <div class="instruction__btn left" @click="changeLevel(-1)"></div>
         <div class="instruction__">Level: {{getLevel}}</div>
        <div class="instruction__btn right" @click="changeLevel(1)"></div>
      </div>
    </div> 
    <div class="instruction__controls">
      <div class="instruction__title">Controls</div>
      <div class="instruction__text">Use Arrow buttons or your keybord to control</div>
      <div class="instruction__btns">
        <div class="instruction__row instruction__row--center">
          <div class="instruction__btn up" :class="{pressed: arrowClicked === 1}" @click="clicked('ArrowUp')"></div>
        </div>
        <div class="instruction__row">
          <div class="instruction__btn left" :class="{pressed: arrowClicked === 2}" @click="clicked('ArrowLeft')"></div>
          <div class="instruction__btn down"  :class="{pressed: arrowClicked === 3}" @click="clicked('ArrowDown')"></div>
          <div class="instruction__btn right" :class="{pressed: arrowClicked === 4}" @click="clicked('ArrowRight')"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'
export default {
  name: 'Instruction',
  created() {
    this.timeForPrint(this.getTimer);
  },
  data() {
    return {
      timeStr: '',
      idInterval: 0,
      allowClick: true
    }
  },
  watch: {
    gameFinished: function(newValue) {
      if (newValue) {
        this.stopGame();
      }
    },
    level: function(newVal) {
      if (newVal) {
        this.timeForPrint(this.getTimer);
      }
    },
    timer: function(newVal) {
      if (newVal === this.timeForReset) {
        this.timeForPrint(newVal);
      }
    },
    restart: function(newVal) {
      if (newVal) {
        this.startGame();
      }
    }
  },
  computed: {
    ...mapGetters([
      'getLevel', 'getTimer', 
      'getShowPath', 'getShowHint'
    ]),
    ...mapState([
      'gameFinished', 'level', 'timer', 'timeForReset', 
      'isPlaying', 'restart', 'arrowClicked', 'stopClickArrows'
    ])
  },
  methods: {
    ...mapActions([
      'CHANGE_LEVEl', 'CHANGE_TIMER', 'CHANGE_ISPLAYING',
      'END_GAME', 'CHANGE_RESTART', 'CHANGE_SHOW_PATH',
      'CHANGE_SHOW_HINT'
    ]),
    changeLevel(step) {
      if (this.allowClick) {
        this.$emit('changeLevel', step);
        this.timeForPrint(this.getTimer);
      }
    },
    startGame() {
      if (this.restart) {
        this.CHANGE_RESTART(false);
      }
      this.CHANGE_ISPLAYING(true);
      this.allowClick = false;
      this.idInterval = setInterval(() => {
        const check = this.getTimer - 1
        if (check >= 0) {
          this.CHANGE_TIMER(check);
          this.timeForPrint(check);
        } else {
          this.finishGame();
        }
      }, 1000)
    },
    stopGame() {
      this.allowClick = true;
      this.CHANGE_ISPLAYING(false);
      clearInterval(this.idInterval);
    },
    finishGame() {
      clearInterval(this.idInterval);
      this.END_GAME('Lose');
    },
    timeForPrint(time) {
      let minutes = parseInt(time / 60, 10);
      let seconds = parseInt(time % 60, 10);
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;
      this.timeStr = `${minutes}:${seconds}`;
    },
    clicked(arrow) {
      if (!this.stopClickArrows) {
        this.$emit('clicked', arrow);
      }
    },
    restartGame() {
      clearInterval(this.idInterval);
      this.$emit('restart');
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

<style lang="scss">
.instruction {
  width: rem(300);
  height: 100%;
  padding: 0 rem(10);
  &__mainBtns  {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  &__controls, &__time, &__levels {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: rem(10) 0;
  }
  &__title {
    margin-bottom: rem(10);
    font-size: rem(30);
    text-align: center;
  }
  &__text {
    font-size: rem(15);
    text-align: center;
    margin-bottom: rem(20);
  }
  &__mainBtn:nth-child(n+2) {
    margin-top: rem(15);
  }
  &__mainBtn {
    font-size: rem(25);
    width: rem(200);
    padding: rem(10) 0;
    text-align: center;
    background: $gradient-primary;
    color: $white;
    cursor: pointer;
    border-radius: rem(10);
    transition-duration: .2s;
  }
  &__mainBtn:hover {
    transform: scale(0.98);
  }
  &__btns {
    width: rem(170);
    height: rem(110);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  &__row {
    @include Flex(space-between);
    &--center {
      justify-content: center;
    }
    &--width {
      width: rem(200);
    }
  }
  &__btn {
    width: rem(50);
    height: rem(50);
    background: $gradient-primary;
    cursor: pointer;
    border-radius: rem(10);
    transition-duration: .2s;
  }
  &__btn:hover {
    background: $gradient-secondary;
    transform: scale(0.9);
  }
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
.green {
  background: green;
}
.red {
  background: red;
}
</style>