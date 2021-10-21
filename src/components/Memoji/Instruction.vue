<template>
  <section class="inst">
    <div class="inst__timer">
        <fontAwesome 
          icon="stopwatch" 
          title="Timer" 
          class="inst__iconTimer"
          :class="{animateTimer: gameStatus === 'start'}"
        />
      {{ timer }}  
    </div>

    <div class="inst__btns">
      <Button
        class="inst__btn"
        v-for="(button, i) in mainButtons"
        :key="i"
        :Button="button"
        :Title="styleMainTitle(button.name)"
        :style="styleMainButton(button.name)"
        v-on:buttonClicked="mainButtonClicked($event)"
        @mouseover="hoverButton(button.name, true)"
        @mouseleave="hoverButton(button.name, false)"
      />
    </div>

    <div class="inst__levels">
      <h3 class="inst__title">Levels</h3>
      <div class="inst__navigation">
        <Button
          class="inst__lbtn"
          v-for="(lbtn, i) in levelButtons"
          :key="i"
          :Button="lbtn"
          :Title="lbtn.title"
          :style="styleLevels(lbtn.name)"
          v-on:buttonClicked="changeLevel($event)"
          @mouseover="hoverButton(lbtn.name, true)"
          @mouseleave="hoverButton(lbtn.name, false)"
        />
        <div class="inst__level">Level: {{ currentLevel }}</div>
      </div>
    </div> 
  </section>
</template>
<script>
import Button from '@/components/Button'
export default {
  name: 'Instruction',
  props: {
    timer: String,
    attempts: Number,
    isHint: Boolean,
    gameStatus: String,
    currentLevel: Number,
    amountOfLevels: Number 
  },
  components: {
    Button
  },
  data() {
    return {
      mainButtons: [
        { icon: 'play-circle', name: 'start' },
        { icon: 'stop-circle', name: 'stop' },
        { icon: 'flag', name: 'finish' },
        { icon: 'lightbulb', name: 'hint' },
      ],
      levelButtons: [
        { icon: 'angle-double-left', name: 'First', title: 'To first level' },
        { icon: 'angle-left', name: 'Prev', title: 'To previous level' },
        { icon: 'angle-right', name: 'Next', title: 'To next level' },
        { icon: 'angle-double-right', name: 'Last', title: 'To last level' },
      ],
      hovered: ''
    }
  },
  methods: {
    changeLevel(step) {
      if (!['', 'finish'].includes(this.gameStatus)) { return }
      this.$emit('changeLevel', step);
    },

    styleMainTitle(button='') {
      switch (button) {
        case 'start':
          return this.gameStatus === 'start' ? 'Game Started' : 'Start Game';

        case 'stop':
          return this.gameStatus === 'stop' ? 'Game Stoped' : 'Stop Game';

        case 'finish':
          return this.gameStatus === 'finish' ? 'Game Finished' : 'Finish Game';

        case 'hint':
          return this.attempts > 0 
            ? `Show hint(${this.attempts} attempts left)` 
            : 'Run out of attempts';

        default: return '';
      }
    },

    styleMainButton(button='') {
      switch (button) {
        case 'start':
          if (this.hovered === 'start' && this.gameStatus !== 'start') {
            return {color: 'chocolate', cursor: 'pointer'}
          }
          return this.gameStatus === 'start' 
            ? {color: 'green', cursor: 'default'}
            : {color: 'white', cursor: 'pointer'}

        case 'stop':
          if (['', 'finish'].includes(this.gameStatus)) { return {color: 'gray', cursor: 'default'} }
          if (this.hovered === 'stop' && this.gameStatus !== 'stop') {
            return {color: 'chocolate', cursor: 'pointer'}
          }
          return this.gameStatus === 'stop' 
            ? {color: 'red', cursor: 'default'}
            : {color: 'white', cursor: 'pointer'}

        case 'finish':
          if (this.hovered === 'finish' && !['', 'finish'].includes(this.gameStatus)) {
            return {color: 'chocolate', cursor: 'pointer'}
          }
          return this.gameStatus !== '' 
            ? {color: 'white', cursor: 'pointer'} 
            : {color: 'gray', cursor: 'default'}

        case 'hint':
          if (['', 'finish', 'stop'].includes(this.gameStatus) || this.attempts === 0) {
             return {color: 'gray', cursor: 'default'} 
          }
          if (this.hovered === 'hint' && this.gameStatus === 'start' && !this.isHint) {
            return {color: 'chocolate', cursor: 'pointer'}
          }
          return this.isHint
            ? {color: 'yellow', cursor: 'default'}
            : {color: 'white', cursor: 'pointer'}

        default: return '';
      }
    },

    mainButtonClicked(button='') {
      switch (button) {
        case 'start':
          if (this.gameStatus === 'start') { return }
          return this.$emit('startGame');

        case 'stop':
          if (['', 'stop'].includes(this.gameStatus)) { return }
          return this.$emit('stopGame');

        case 'finish':
          if (!['start', 'stop'].includes(this.gameStatus)) { return }
          return this.$emit('finishGame');

        case 'hint':
          return this.$emit('showHint');

        default: return;
      }
    },

    styleLevels(name='') {
      const status = ['start', 'finish', 'stop'].includes(this.gameStatus);
      const condition = this.currentLevel === 1 || status;
      const condition2 = this.currentLevel === this.amountOfLevels || status;
      const whatToReturn = cond => cond 
        ? {color: 'gray', cursor: 'default'} 
        : {color: 'white', cursor: 'pointer'}
      
      switch (name) {
        case 'First':
          if (this.hovered === 'First' && !condition) {
            return {color: 'chocolate', cursor: 'pointer'}
          }
          return whatToReturn(condition);

        case 'Prev':
          if (this.hovered === 'Prev' && !condition) {
            return {color: 'chocolate', cursor: 'pointer'}
          }
          return whatToReturn(condition);

        case 'Next':
          if (this.hovered === 'Next' && !condition2) {
            return {color: 'chocolate', cursor: 'pointer'}
          }
          return whatToReturn(condition2);

        case 'Last':
          if (this.hovered === 'Last' && !condition2) {
            return {color: 'chocolate', cursor: 'pointer'}
          }
          return whatToReturn(condition2);

        default: return;
      }
    },

    hoverButton(button='', isHovered) {
      this.hovered = isHovered ? button : '';
    },
  }
}
</script>

<style lang="scss" scoped>
.inst {
  user-select: none;

  &__timer {
    @include Flex(center);
    height: 49px;
    font-size: 30px;
    background: #302e2c;
    color: white;
    border-bottom: 1px solid gray;
    border-radius: 5px 5px 0 0;
  }

  &__iconTimer {
    margin-right: 10px;
  }

  &__btns {
    @include Flex(space-around);
    height: 49px;
    background: #302e2c;
    border-bottom: 1px solid gray;
  }

  &__btn {
    font-size: 25px;
    color: white;
    transition-duration: .5s;
  }

  &__title {
    color: whitesmoke;
    font-size: 30px;
    text-align: center;
  }

  &__navigation {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  &__levels {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    background: #302e2c;
    border-bottom: 1px solid gray;
    border-radius: 0 0 5px 5px;
    height: 70px;
  }

  &__lbtn {
    border: none;
    background: transparent;
    color: white;
    font-size: 25px;
    transition-duration: .5s;
  }

  &__lbtn:nth-child(1) {
    order: 1;
  }

  &__lbtn:nth-child(2) {
    order: 2;
  }

  &__lbtn:nth-child(3) {
    order: 4;
  }

  &__lbtn:nth-child(4) {
    order: 5;
  }

  &__level {
    order: 3;
    color: white;
    font-size: 20px;
  }
}

.animateTimer {
  animation: timer infinite 1s ease-in-out;
}

@keyframes timer {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
    color: tomato;
  }

  100% {
    transform: scale(1);
  }
}
</style>