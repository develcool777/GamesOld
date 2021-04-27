<template>
  <div class="instTic">
    <div class="instTic__mainBtns">
      <div class="instTic__mainBtn" @click="clear()">Clear</div>
      <div class="instTic__mainBtn" @click="returnMove()">Return move</div>
      <div class="instTic__mainBtn" :class="{active: !getWithComputer}" @click="changePlayer()">User VS User</div>
      <div class="instTic__mainBtn" :class="{active: getWithComputer}" @click="changePlayer()">User VS Comp</div>
      <div class="instTic__mainBtn" @click="start()" v-if="userChoice === 'o' && getWithComputer">Start Comp</div>
    </div>
    <section class="" v-if="getWithComputer">
      <div class="instTic__block">
        <div class="instTic__title">Users choice</div>
      </div>
      <div class="instTic__mainBtns">
        <div class="instTic__mainBtn" :class="{active: userChoice === 'x'}" @click="changeSide('x')">X</div>
        <div class="instTic__mainBtn" :class="{active: userChoice === 'o'}" @click="changeSide('o')">O</div>
      </div>
     <div class="instTic__block">
        <div class="instTic__title">Difficulty</div>
      </div>
      <div class="instTic__mainBtns">
        <div class="instTic__mainBtn" :class="{active: difficulty === 'easy'}" @click="changeDifficulty('easy')">Easy</div>
        <div class="instTic__mainBtn" :class="{active: difficulty === 'hard'}" @click="changeDifficulty('hard')">Hard</div>
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
      userChoice: 'x',
      difficulty: 'easy'
    }
  },
  computed: {
    ...mapGetters(['getWithComputer'])
  },
  methods: {
    ...mapActions(['CHANGE_CLEAR', 'CHANGE_RETURN_MOVE', 'CHANGE_WITH_COMPUTER']),
    clear() {
      this.CHANGE_CLEAR(true);
    },
    returnMove() {
      this.CHANGE_RETURN_MOVE(true);
    },
    changePlayer() {
      this.CHANGE_WITH_COMPUTER(!this.getWithComputer);
      this.clear();
    },
    changeSide(move) {
      this.userChoice = move;
    },
    changeDifficulty(diff) {
      this.difficulty = diff;
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