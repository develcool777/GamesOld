<template>
  <div class="instTic">
    <div class="instTic__mainBtns">
      <div class="instTic__mainBtn" @click="clear()">Clear</div>
      <div class="instTic__mainBtn" @click="returnMove()">Return move</div>
      <div class="instTic__mainBtn" :class="{active: !getWithComputer}" @click="changePlayer()">User1 VS User2</div>
      <div class="instTic__mainBtn" :class="{active: getWithComputer}" @click="changePlayer()">User VS Comp</div>
      <div class="instTic__mainBtn" @click="startComputer()" v-if="getCompSettings.showStartButton && getWithComputer">Start Comp</div>
    </div>
    <section class="" v-if="getWithComputer">
      <div class="instTic__block">
        <div class="instTic__title">Users choice</div>
      </div>
      <div class="instTic__mainBtns">
        <div 
          class="instTic__mainBtn" 
          v-for="(side, i) in sides"
          :key="i"
          :class="{active: getCompSettings.compSide === side.comp}" 
          @click="changeSide(side.comp)"
        >{{ side.user }}</div> 
      </div>
     <div class="instTic__block">
        <div class="instTic__title">Difficulty</div>
      </div>
      <div class="instTic__mainBtns">
        <div 
          class="instTic__mainBtn" 
          v-for="(diff, i) in difficulties"
          :key="i"
          :class="{active: getCompSettings.difficulty === diff.comp}" 
          @click="changeDifficulty(diff.comp)"
        >{{ diff.display }}</div>
      </div>
    </section>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapGetters } = createNamespacedHelpers('tictactoe');
export default {
  name: 'Instruction',
  data() {
    return {
      sides: [
        { comp: 'o', user: 'X' },
        { comp: 'x', user: 'O' }
      ],
      difficulties: [
        { comp: 'easy', display: 'Easy' },
        { comp: 'hard', display: 'Hard' }
      ]
    }
  },
  computed: {
    ...mapGetters(['getWithComputer', 'getCompSettings'])
  },
  methods: {
    ...mapActions([
      'CHANGE_CLEAR', 'CHANGE_RETURN_MOVE', 
      'CHANGE_WITH_COMPUTER', 'CHANGE_COMPUTER_SETTINGS',
      'CHANGE_WINNER'
    ]),
    clear() {
      this.CHANGE_CLEAR(true);
      this.CHANGE_WINNER('');
    },
    returnMove() {
      this.CHANGE_RETURN_MOVE(true);
    },
    changePlayer() {
      this.CHANGE_WITH_COMPUTER(!this.getWithComputer);
      this.clear();
    },
    changeSide(move) {
      const obj = {
        compSide: move,
        userSide: move === 'x' ? 'o' : 'x',
        startButton: move === 'x' ? true : false
      }
      this.CHANGE_COMPUTER_SETTINGS(obj);
    },
    changeDifficulty(diff) {
      const obj = {
        difficulty: diff
      }
      this.CHANGE_COMPUTER_SETTINGS(obj)
    },
    startComputer() {
      const obj = {
        isStarted: true
      }
      this.CHANGE_COMPUTER_SETTINGS(obj);
    }
  }
}
</script>

<style lang="scss" scoped>
.instTic {
  @include Instruction();
  &__mainBtns {
    margin-top: rem(30);
  }
  &__block {
    margin: rem(20) 0;
    color: $white;
  }
}
.active {
  background: darkgreen;
}
</style>