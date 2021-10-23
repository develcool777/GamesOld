<template>
  <section class="inst">
    <div class="inst__btns">
      <Button
        :ref="`main${i}`"
        class="inst__btn"
        v-for="(button, i) in mainButtons"
        :key="i"
        :Button="button"
        :Title="styleMainTitle(button.name)"
        :style="styleMainButton(button.name)"
        v-on:buttonClicked="mainButtonClicked($event, i)"
        @mouseover="hoverButton(button.name, true)"
        @mouseleave="hoverButton(button.name, false)"
      />
    </div>

    <div class="inst__chooseMode">
      <div class="inst__title" :style="styleChooseTitle('mode')">Modes</div>
      <div class="inst__modes" :style="styleModes('mode')">
        <div 
          class="inst__mode inst__mode-around" 
          title="User VS User" 
          @click="changeMode(false)" 
          :style="styleChoose('user')"
        >
          <fontAwesome icon="user"/>
          <p>VS</p>
          <fontAwesome icon="user"/>
        </div>
        <div 
          class="inst__mode inst__mode-around" 
          title="User VS Computer" 
          @click="changeMode(true)" 
          :style="styleChoose('comp')"
        >
          <fontAwesome icon="user"/>
          <p>VS</p>
          <fontAwesome icon="robot"/>
        </div>
        <div class="inst__active" :style="styleActive('mode')"></div>
      </div>
    </div>

    <div class="inst__chooseMode">
      <div class="inst__title" :style="styleChooseTitle('side')">Side</div>
      <div class="inst__modes" :style="styleModes('side')">
        <div class="inst__mode" :style="styleChoose('x')" @click="changeSide('x')">X</div>
        <div class="inst__mode" :style="styleChoose('o')" @click="changeSide('o')">O</div>
        <div class="inst__active" :style="styleActive('side')"></div>
      </div>
    </div>

    <div class="inst__chooseMode">
      <div class="inst__title" :style="styleChooseTitle('difficulty')">Difficulty</div>
      <div class="inst__modes" :style="styleModes('difficulty')">
        <div class="inst__mode" :style="styleChoose('easy')" @click="changeDifficulty('easy')">Easy</div>
        <div class="inst__mode" :style="styleChoose('hard')" @click="changeDifficulty('hard')">Hard</div>
        <div class="inst__active" :style="styleActive('difficulty')"></div>
      </div>
    </div>
  </section>
</template>

<script>
import Button from '@/components/Button'
export default {
  name: 'Instruction',
  components: {
    Button
  },
  props: {
    gameStatus: String,
    settings: Object,
    isReturnMove: Boolean
  },
  data() {
    return {
      hovered: '',
      RotationCoef: 0,
      mainButtons: [
        { icon: 'play-circle', name: 'start' },
        { icon: 'eraser', name: 'clear' },
        { icon: 'undo', name: 'return' },
      ],
    }
  },
  methods: {
    changeMode(bool) {
      if (this.gameStatus === 'start') { return }
      this.$emit('changePlayingWith', bool);
    },

    changeSide(side) {
      if (this.gameStatus === 'start' || !this.settings.playWithComputer) { return }
      this.$emit('changeSide', side);
    },

    changeDifficulty(diff) {
      if (this.gameStatus === 'start' || !this.settings.playWithComputer) { return }
      this.$emit('changeDifficulty', diff);
    },

    styleMainTitle(button='') {
      switch (button) {
        case 'start':
          return this.gameStatus === 'start' 
            ? 'Game Started' 
            : this.gameStatus === 'finish'
              ? 'Game Finished'
              : 'Start Game';

        case 'clear':
          return 'Clear Field';

        case 'return':
          return 'Return Move';

        default: return '';
      }
    },

    styleMainButton(button='') {
      switch (button) {
        case 'start':
          if (this.hovered === 'start' && this.gameStatus === '') {
            return {color: 'chocolate', cursor: 'pointer'}
          }
          return this.gameStatus === 'start' 
            ? {color: 'green', cursor: 'default'}
            : this.gameStatus === 'finish'
              ? {color: 'red', cursor: 'default'}
              : {color: 'white', cursor: 'pointer'}

        case 'clear':
          if (this.hovered === 'clear' && ['start', 'finish'].includes(this.gameStatus)) {
            return {color: 'chocolate', cursor: 'pointer'}
          }
          return ['start', 'finish'].includes(this.gameStatus)
            ? {color: 'white', cursor: 'pointer'} 
            : {color: 'gray', cursor: 'default'}

        case 'return':
          const condition = this.gameStatus === 'start' && this.isReturnMove;
          if (this.hovered === 'return' && condition) {
            return {color: 'chocolate', cursor: 'pointer', transform: `rotate(${-360 * this.RotationCoef}deg)`}
          }
          return condition
            ? {color: 'white', cursor: 'pointer', transform: `rotate(${-360 * this.RotationCoef}deg)`} 
            : {color: 'gray', cursor: 'default', transform: `rotate(${-360 * this.RotationCoef}deg)`}

        default: return '';
      }
    },

    mainButtonClicked(button='', i) {
      switch (button) {
        case 'start':
          if (this.gameStatus === 'start') { return }
          return this.$emit('start');

        case 'clear':
          if (!['start', 'finish'].includes(this.gameStatus)) { return }
          return this.$emit('finish');

        case 'return':
          if (this.gameStatus !== 'start' || !this.isReturnMove) { return }
          this.RotationCoef++;
          return this.$emit('returnMove');

        default: return;
      }
    },

    styleChooseTitle(choose='') {
      switch (choose) {
        case 'difficulty':
        case 'side':
          const decide = this.gameStatus === 'start' ? 0.5 : 1
          return this.settings.playWithComputer
            ? {color: 'white', opacity: decide} 
            : {color: 'gray', opacity: 1}
      
        case 'mode': 
          return this.gameStatus === 'start'
            ? {opacity: 0.5}
            : {opacity: 1}
        default: return;
      }
    },

    styleChoose(choose='') {
      const isComp = this.settings.playWithComputer;
      const decideCursor = this.gameStatus === 'start' ? 'default' : 'pointer';
      switch (choose) {
        case 'x':
          if (!isComp ) { return {color: 'gray', cursor: 'default'} }
          return this.settings.userSide === 'x'
            ? {color: 'lawngreen', cursor: 'default'}
            : {color: 'wheat', cursor: decideCursor}

        case 'o':
          if (!isComp ) { return {color: 'gray', cursor: 'default'} }
          return this.settings.userSide === 'o'
            ? {color: 'lawngreen', cursor: 'default'}
            : {color: 'wheat', cursor: decideCursor}

        case 'easy':
          if (!isComp) { return {color: 'gray', cursor: 'default'} }
          return this.settings.difficulty === 'easy'
            ? {color: 'lawngreen', cursor: 'default'}
            : {color: 'wheat', cursor: decideCursor}

        case 'hard':
          if (!isComp) { return {color: 'gray', cursor: 'default'} }
          return this.settings.difficulty === 'hard'
            ? {color: 'lawngreen', cursor: 'default'}
            : {color: 'wheat', cursor: decideCursor}

        case 'user':
          return !isComp
            ? {color: 'lawngreen', cursor: 'default'}
            : {color: 'wheat', cursor: decideCursor}

        case 'comp':
          return isComp
            ? {color: 'lawngreen', cursor: 'default'}
            : {color: 'wheat', cursor: decideCursor}
      
        default: return;
      }
    },

    styleModes(choose='') {
      switch (choose) {
        case 'difficulty':
        case 'side':
          return this.settings.playWithComputer
            ? {opacity: this.gameStatus === 'start' ? 0.5 : 1} 
            : {opacity: 1}
      
        case 'mode': 
          return this.gameStatus === 'start'
            ? {opacity: 0.5}
            : {opacity: 1}
        default: return;
      }
    },

    styleActive(what='') {
      switch (what) {
        case 'side':
          if (!this.settings.playWithComputer) {
            const decide = this.settings.userSide === 'x' ? 0 : 100 
            return {background: 'transparent', transform: `translateX(${decide})`} 
          }
          return this.settings.userSide === 'x'
            ? {transform: `translateX(${0})`, cursor: 'default'}
            : {transform: `translateX(${100}%)`, cursor: 'default'}
      
        case 'difficulty':
          if (!this.settings.playWithComputer) {
            const decide = this.settings.difficulty === 'easy' ? 0 : 100 
            return {background: 'transparent', transform: `translateX(${decide})`} 
          }
          return this.settings.difficulty === 'easy'
            ? {transform: `translateX(${0})`, cursor: 'default'}
            : {transform: `translateX(${100}%)`, cursor: 'default'}

        case 'mode':
          return this.settings.playWithComputer
            ? {left: `${50}%`, cursor: 'default'}
            : {left: 0, cursor: 'default'}
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

  &__btns {
    @include Flex(space-around);
    height: 49px;
    background: #302e2c;
    border-bottom: 1px solid gray;
    border-radius: 5px 5px 0 0;
  }

  &__btn {
    font-size: 25px;
    color: white;
    transition-duration: .5s;
    display: flex;
    align-items: center;
  }

  &__title {
    margin-top: 10px;
    font-size: 30px;
    color: white;
    text-align: center;
    transition-duration: .5s;
  }

  &__chooseMode {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: #302e2c;
    height: 99px;
    border-bottom: 1px solid gray;
  }

  &__modes {
    position: relative;
    @include Flex(space-between);
    height: 40px;
  }

  &__mode {
    @include Flex(center);
    width: 50%;
    font-size: 25px;
    color: wheat;
    z-index: 5;
    transition-duration: .5s;

    &-around {
      @include Flex(space-around);
    }
  }

  &__active {
    position: absolute;
    background: lightslategray;
    width: 50%;
    top: 0;
    height: inherit;
    transition-duration: .5s;
  }
}
</style>