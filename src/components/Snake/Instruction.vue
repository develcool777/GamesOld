<template>
  <section class="inst">
    <div class="inst__section">
      <fontAwesome 
        icon="stroopwafel"
        class="inst__icon inst__icon--score"
        title="Score"
      />
      {{ score }}
    </div>

    <div class="inst__section" v-if="showCookieBar">
      <fontAwesome 
        icon="cookie"
        class="inst__icon inst__icon--cookie"
        title="Cookie"
      />
      <div class="inst__points" v-if="showPoints">+{{ cookieScore }}</div>
      <div class="inst__line" v-else>
        <div class="inst__activeLine" :style="{ width: `${cookieScore}%` }"></div>
      </div>

    </div>

    <div class="inst__section inst__section--controls">
      <div class="inst__control" title="Play" @click="start()" :style="styleStart()">
        <fontAwesome icon="play-circle"/>
      </div>
      <div class="inst__control" title="Stop" @click="stop()" :style="styleStop()">
        <fontAwesome icon="stop-circle"/>
      </div>
      <div class="inst__control" title="Finish" @click="finish()">
        <fontAwesome icon="flag"/>
      </div>
    </div>

    <!-- <div class="inst__controls">
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
    </div> -->
  </section>
</template>

<script>
// import Button from '@/components/Button';
export default {
  name: 'Instruction',
  components: {
    // Button
  },
  props: {
    gameStatus: String,
    score: Number,
    cookieScore: Number,
    isCookieExist: Boolean,
  },
  watch: {
    isCookieExist: function(newValue) {
      if (newValue) {
        this.showCookieBar = true;
        return;
      } 
      this.showPoints = true;
      setTimeout(() => {
        this.showPoints = false;
        this.showCookieBar = false;
      }, 2000);
    }
  },
  data() {
    return {
      showCookieBar: false,
      showPoints: false,
      arrowButtons: [
        { icon: 'arrow-up', name: 'ArrowUp' },
        { icon: 'arrow-left', name: 'ArrowLeft' },
        { icon: 'arrow-down', name: 'ArrowDown' },
        { icon: 'arrow-right', name: 'ArrowRight' },
      ],
    }
  },
  methods: {
    start() {
      this.$emit('start');
    },

    stop() {
      this.$emit('stop');
    },

    finish() {
      this.$emit('finish');
    },

    // clicked(arrow) {
    //   if (this.gameStatus !== 'start') { return }
    //   this.$emit('clicked', arrow);
    // },

    styleStart() {
      return this.gameStatus === 'start'
        ? { color: 'green', cursor: 'default' }
        : { color: 'white', cursor: 'cursor' }
    },

    styleStop() {
      return this.gameStatus === 'stop'
        ? { color: 'red', cursor: 'default' }
        : { color: 'white', cursor: 'cursor' }
    },

    styleArrows(isActive) {
      if (isActive) return {cursor: 'pointer', background: 'yellow'}
      return this.gameStatus === 'start' 
        ? { cursor: 'pointer', background: 'orange' }
        : { cursor: 'default', background: 'gray' }
    }
  }
}
</script>

<style lang="scss" scoped>
.inst {
  user-select: none;
  background: #302e2c;
  border-radius: 5px 5px 0 0;

  &__section {    
    @include Flex(center);
    height: 40px;
    color: white;
    border-bottom: 1px solid gray;
    font-size: 30px;
    &--controls {
      @include Flex(space-around);
    }
  }

  &__icon {
    border-radius: 50%;
    font-size: 25px;
    margin-right: 10px;
    &--score {
      color: darkorange;
      background: whitesmoke;
    }
    &--cookie {
      color: goldenrod;
      background: black;
    }
  }

  &__points {
    font-size: 30px;
    color: yellow;
  }

  &__line {
    @include Flex(flex-start);
    height: 20px;
    width: 200px;
    background: lightgray;
  }

  &__activeLine {
    height: 100%;
    background: limegreen;
  }

  &__control {
    font-size: 25px;
    color: white;
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
}

.pressed {
  color: red;
  transform: scale(0.9);
}
</style>