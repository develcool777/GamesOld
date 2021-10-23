<template>
  <div class="instRPS">
    <div class="instRPS__block">
      <div class="instRPS__title">Modes</div>
    </div>
    <div class="instRPS__mainBtns">
      <div 
        class="instRPS__mainBtn"
        v-for="(mode, i) in modes"
        :key="i"
        :class="activeClass(mode.mode)" 
        @click="clickMode(mode.mode)" 
      >{{ mode.name }}{{ onOff(mode.mode) }}</div>
    </div>
    <div class="instRPS__block">
      <div class="instRPS__title">Settings</div>
    </div>
    <div class="instRPS__mainBtns">
      <div class="instRPS__mainBtn" @click="clear()">Clear</div>
      <div class="instRPS__mainBtn" @click="showHistory()" :class="historyActive">{{ history }}</div>
      <div class="instRPS__mainBtn" @click="showAnalitics()" :class="analiticsActive">{{ analitics }}</div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapGetters } = createNamespacedHelpers('rockPaperScissors');
export default {
  name: 'Instruction',
  data() {
    return {
      modes: [
        { name: 'Impossible:', mode: 'impossible' },
        { name: 'Easy:', mode: 'easy' },
        { name: 'Without draw:', mode: 'withoutDraw' },
      ]
    }
  },
  computed: {
    ...mapGetters(['getShowHistory', 'getShowAnalitics', 'getMode']),

    history() {
      return this.getShowHistory ? 'Hide history' : 'Show history';
    },

    historyActive() {
      return this.getShowHistory ? 'active' : '';
    },

    analitics() {
      return this.getShowAnalitics ? 'Hide analitics' : 'Show analitics';
    },

    analiticsActive() {
      return this.getShowAnalitics ? 'active' : '';
    }
  },
  methods: {
    ...mapActions([
      'CHANGE_SHOW_HISTORY', 'CHANGE_SHOW_ANALITICS', 'SET_MODE'
    ]),

    clickMode(mode) {
      mode === this.getMode ? this.SET_MODE('') : this.SET_MODE(mode);
    },

    clear() {
      this.SET_MODE('');
      this.CHANGE_SHOW_HISTORY(false);
      this.CHANGE_SHOW_ANALITICS(false);
      this.$emit('clear');
    },

    showHistory() {
      this.CHANGE_SHOW_HISTORY(!this.getShowHistory);
    },

    showAnalitics() {
      this.CHANGE_SHOW_ANALITICS(!this.getShowAnalitics);
    },

    onOff(mode) {
      return this.getMode  === mode ? 'On' : 'Off';
    },

    activeClass(mode) {
      return this.getMode  === mode ? 'active' : '';
    }
  }
}
</script>

<style lang="scss" scoped>
.instRPS {
  padding: 0 rem(10);

  &__mainBtns  {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  &__title {
    margin-bottom: rem(10);
    font-size: rem(30);
    text-align: center;
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
    user-select: none;
  }

  &__mainBtn:hover {
    transform: scale(0.98);
  }

  &__block {
    margin: 20px 0;
    color: $white;
  }
}

.active {
  background: green;
}
</style>