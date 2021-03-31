<template>
  <section class="instruction">
    <div class="instruction__time">
      <div class="instruction__title">Timer: {{timeStr}}</div>
      <div class="instruction__mainBtns">
        <div class="instruction__mainBtn" @click="startEmit()">Start</div>
        <div class="instruction__mainBtn" @click="stopEmit(false)">Stop</div>
      </div>
    </div>
    <div class="instruction__levels">
      <div class="instruction__title">Levels</div>
      <div class="instruction__row instruction__row--width">
        <div class="instruction__btn left" @click="changeLevel(-1)"></div>
         <div class="instruction__">Level: {{level}}</div>
        <div class="instruction__btn right" @click="changeLevel(1)"></div>
      </div>
    </div> 
    <div class="instruction__controls">
      <div class="instruction__title">Controls</div>
      <div class="instruction__text">Use Arrow buttons or your keybord to control</div>
      <div class="instruction__btns">
        <div class="instruction__row instruction__row--center">
          <div class="instruction__btn up" :class="{pressed: arrow === 1}" @click="clicked('ArrowUp')"></div>
        </div>
        <div class="instruction__row">
          <div class="instruction__btn left" :class="{pressed: arrow === 2}" @click="clicked('ArrowLeft')"></div>
          <div class="instruction__btn down"  :class="{pressed: arrow === 3}" @click="clicked('ArrowDown')"></div>
          <div class="instruction__btn right" :class="{pressed: arrow === 4}" @click="clicked('ArrowRight')"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Instruction',
  props: {
    arrow: Number,
    stopClick: Boolean,
    triger: Boolean,
    restart: Boolean,
    level: Number,
    time: Number
  },
  watch: {
    triger: function(newVal) {
      if (newVal === true) {
        console.log('stop Timer');
        this.seconds = this.time;
        this.initTimer();
        this.stop();
      } 
      if (this.restart) {
        this.start();
      }
    },
    time: function(newVal) {
      this.seconds = newVal;
      this.initTimer();
    },
  },
  created() {
    this.initTimer();
  },
  data() {
    return {
      timeStr: '',
      seconds: this.time,
      idInterval: 0
    }
  },
  methods: {
    initTimer() {
      this.timeForPrint(this.seconds);
      this.seconds--;
    },
    timeForPrint(time) {
      console.log(this.seconds);
      let minutes = parseInt(time / 60, 10);
      let seconds = parseInt(time % 60, 10);
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;
      this.timeStr = minutes + ":" + seconds;
    },
    runTimer(duration) {
      let timer = duration;
      this.idInterval = setInterval( () => {
        this.timeForPrint(timer);
        if (timer <= 0) {
          this.stopEmit(true);
        }
        timer--;
        this.seconds = timer;
      }, 1000);
    },
    clicked(arrow) {
      if (!this.stopClick) {
        this.$emit('click', arrow);
      }
    },
    changeLevel(step) {
      if (this.stopClick) {
        this.$emit('changeLevel', step);
      }
    },
    start() {
      this.runTimer(this.seconds);
      this.$emit('changeRestart', false);
    },
    stop() {
      clearInterval(this.idInterval);
    },
    startEmit() {
      this.runTimer(this.seconds);
      this.$emit('startGame');
    },
    stopEmit(isFinished) {
      clearInterval(this.idInterval);
      this.$emit('stopGame', isFinished);
    }
  }
}
</script>

<style lang="scss">
.instruction {
  width: rem(300);
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
    padding: rem(20) 0;
  }
  &__title {
    margin-bottom: rem(20);
    font-size: rem(30);
    text-align: center;
  }
  &__text {
    font-size: rem(15);
    text-align: center;
    margin-bottom: rem(30);
  }
  &__mainBtn:nth-child(2) {
    margin-top: rem(15);
  }
  &__mainBtn {
    font-size: rem(25);
    width: rem(200);
    padding: rem(20) 0;
    text-align: center;
    background: $gradient-primary;
    color: $white;
    cursor: pointer;
    border-radius: rem(10);
    transition-duration: .2s;
  }
  &__mainBtn:hover {
    background: $gradient-secondary;
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
</style>