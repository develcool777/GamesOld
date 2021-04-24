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
        :class="activeClass(mode.id)" 
        @click="clickMode(mode.id)" 
      >{{ mode.name }}{{ onOff(mode.id) }}</div>
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
      activeMode: null,
      modes: [
        { id: 1, name: 'Impossible:' },
        { id: 2, name: 'Easy:' },
        { id: 3, name: 'Without draw:' },
      ]
    }
  },
  computed: {
    ...mapGetters(['getShowHistory', 'getShowAnalitics']),
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
      'RESET_MODE', 'CHANGE_IMPOSSIBLE', 'CHANGE_EASY', 
      'CHANGE_WITHOUT_DRAW', 'CHANGE_CLEAR', 'CHANGE_SHOW_HISTORY',
      'CHANGE_RESULT_OF_MOVE', 'CHANGE_SHOW_ANALITICS'
    ]),
    clickMode(modeIndex) {
      if (this.activeMode === modeIndex) {
        this.activeMode = null;
        this.RESET_MODE();
        return;
      }
      this.activeMode = modeIndex;
      this.RESET_MODE();
      if (this.activeMode === 1) {
        this.CHANGE_IMPOSSIBLE(true);
        return;
      }
      if (this.activeMode === 2) {
        this.CHANGE_EASY(true);
        return;
      } 
      if (this.activeMode === 3) {
        this.CHANGE_WITHOUT_DRAW(true);
        return;
      } 

    },
    clear() {
      this.activeMode = null;
      this.RESET_MODE();
      this.CHANGE_CLEAR(true);
      this.CHANGE_SHOW_HISTORY(false);
      this.CHANGE_RESULT_OF_MOVE(false);
      this.CHANGE_SHOW_ANALITICS(false);
    },
    showHistory() {
      this.CHANGE_SHOW_HISTORY(!this.getShowHistory);
    },
    showAnalitics() {
      this.CHANGE_SHOW_ANALITICS(!this.getShowAnalitics);
    },
    onOff(modeIndex) {
      return modeIndex === this.activeMode ? 'On' : 'Off';
    },
    activeClass(current) {
      return this.activeMode === current ? 'active' : '';
    }
  }
}
</script>

<style lang="scss">
.instRPS {
  @include Instruction();
  &__block {
    margin: rem(20) 0;
    color: $white;
  }
}
.active {
  background: green;
}
</style>