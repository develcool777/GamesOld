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
      <div class="inst__control" title="Play" @click="start()">
        <fontAwesome icon="play-circle"/>
      </div>
      <div class="inst__control" title="Stop" @click="stop()">
        <fontAwesome icon="stop-circle"/>
      </div>
      <div class="inst__control" title="Finish" @click="finish()">
        <fontAwesome icon="flag"/>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Instruction',
  props: {
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
}
</style>