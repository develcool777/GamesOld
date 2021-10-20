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

    <div class="inst__controls">
      <h3 class="inst__title">Controls</h3>
      <p class="inst__text">Use Arrow buttons or your keybord to control</p>
      <div class="inst__arrows">
        <div class="inst__row">
          <Button 
            class="inst__arrow"
            :class="{pressed: getArrowClicked === 1}"
            :style="styleArrows(getArrowClicked === 1)"
            v-on:buttonClicked="clicked($event)"
            :Button="arrowButtons[0]"
            :Title="arrowButtons[0].name"
          />
        </div>
        <div class="inst__row">
          <Button 
            class="inst__arrow"
            v-for="(button, i) in arrowButtons.slice(1)"
            :key="i"
            :class="{pressed: getArrowClicked === i + 2}"
            :style="styleArrows(getArrowClicked === i + 2)"
            v-on:buttonClicked="clicked($event)"
            :Button="button"
            :Title="button.name"
          />
        </div>
      </div>
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
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapActions } = createNamespacedHelpers('maze')
import Button from '@/components/Button';
export default {
  name: 'Instruction',
  components: {
    Button
  },
  props: {
    timer: String,
    gameStatus: String,
    currentLevel: Number,
    amountOfLevels: Number
  },
  data() {
    return {
      mainButtons: [
        { icon: 'play-circle', name: 'start' },
        { icon: 'stop-circle', name: 'stop' },
        { icon: 'flag', name: 'finish' },
        { icon: 'shoe-prints', name: 'path' },
        { icon: 'wave-square', name: 'hint' },
      ],
      arrowButtons: [
        { icon: 'arrow-up', name: 'ArrowUp' },
        { icon: 'arrow-left', name: 'ArrowLeft' },
        { icon: 'arrow-down', name: 'ArrowDown' },
        { icon: 'arrow-right', name: 'ArrowRight' },
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
  computed: {
    ...mapGetters([
      'getShowPath', 'getShowHint', 'getArrowClicked'
    ]),
  },
  methods: {
    ...mapActions(['CHANGE_SHOW_PATH', 'CHANGE_SHOW_HINT']),

    clicked(arrow) {
      if (this.gameStatus !== 'start') { return }
      this.$emit('clicked', arrow);
    },

    changeLevel(direction) {
      if (!['', 'finish'].includes(this.gameStatus)) { return }
      this.$emit('changeLevel', direction);
    },

    styleMainTitle(button='') {
      switch (button) {
        case 'start':
          return this.gameStatus === 'start' ? 'Game Started' : 'Start Game';

        case 'stop':
          return this.gameStatus === 'stop' ? 'Game Stoped' : 'Stop Game';

        case 'finish':
          return this.gameStatus === 'finish' ? 'Game Finished' : 'Finish Game';

        case 'path':
          return this.getShowPath ? 'Path Showed' : 'Show Path';

        case 'hint':
          return this.getShowHint ? 'Hint Showed' : 'Show Hint';

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
          if (this.gameStatus === '') { return {color: 'white', cursor: 'default'} }
          if (this.hovered === 'stop' && this.gameStatus !== 'stop') {
            return {color: 'chocolate', cursor: 'pointer'}
          }
          return this.gameStatus === 'stop' 
            ? {color: 'red', cursor: 'default'}
            : {color: 'white', cursor: 'pointer'}

        case 'finish':
          if (this.hovered === 'finish') {
            return {color: 'chocolate', cursor: 'pointer'}
          }
          return this.gameStatus !== '' 
            ? {cursor: 'pointer'} 
            : {cursor: 'default'}

        case 'path':
          if (this.hovered === 'path') {
            return {color: 'chocolate', cursor: 'pointer'}
          }
          return this.getShowPath 
            ? {color: 'tomato', cursor: 'pointer'}
            : {color: 'white', cursor: 'pointer'}

        case 'hint':
          if (this.hovered === 'hint') {
            return {color: 'chocolate', cursor: 'pointer'}
          }
          return this.getShowHint
            ? {color: 'tomato', cursor: 'pointer'}
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

        case 'path':
          return this.CHANGE_SHOW_PATH(!this.getShowPath);

        case 'hint':
          return this.CHANGE_SHOW_HINT(!this.getShowHint);

        default: return;
      }
    },

    styleArrows(isActive) {
      if (isActive) { return  {cursor: 'pointer', background: 'yellow'}}
      return this.gameStatus === 'start' 
        ? {cursor: 'pointer', background: 'orange'}
        : {cursor: 'default', background: 'gray'}
    },

    styleLevels(name='') {
      const condition = this.currentLevel === 1 || ['start', 'finish', 'stop'].includes(this.gameStatus);
      const condition2 = this.currentLevel === this.amountOfLevels || ['start', 'finish', 'stop'].includes(this.gameStatus);
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

  &__controls {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    background: darkslategrey;
    border-bottom: 1px solid gray;
    height: 220px;
  }

  &__title, &__text {
    color: white;
    text-align: center;
  }

  &__title {
    color: whitesmoke;
    font-size: 30px;
  }

  &__arrows {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    height: 110px;
  }

  &__arrow {
    color: white;
    font-size: 30px;
    width: 50px;
    height: 50px;
    border-radius: 5px;
    transition-duration: .5s;
  }

  &__row:nth-child(2) {
    display: flex;
    justify-content: space-between;
    width: 170px;
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

.pressed {
  color: red;
  transform: scale(0.9);
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