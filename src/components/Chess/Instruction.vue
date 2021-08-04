<template>
  <section class="instChess">
    <div class="instChess__mainBtns">
      <div class="instChess__mainBtn" @click="changeBtnName('start')">{{ showBtnName() }}</div>
      <div class="instChess__mainBtn" @click="clear()">Clear Board</div>
      <!-- <div class="instChess__mainBtn" @click="returnMove()">Return move</div>
      <div class="instChess__mainBtn">Analyze game</div> -->
    </div>
  </section>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapActions } = createNamespacedHelpers('chess');
export default {
  name: 'Instruction',
  computed: {
    ...mapGetters(['getGameStatus']) 
  },
  methods: {
    ...mapActions(['CHANGE_GAME_STATUS', 'CHANGE_RETURN_MOVE', 'CHANGE_CLEAR_BOARD']),

    showBtnName() {
      if (this.getGameStatus === 'start') {
        return 'Game Started';
      }
      if (this.getGameStatus === '') {
        return 'Start Game';
      }
      if (this.getGameStatus === 'finish') {
        return 'Game Finished';
      }
    },
    
    changeBtnName(name) {
      if (this.getGameStatus === 'finish') { return }
      this.CHANGE_GAME_STATUS(name);
    },

    clear() {
      this.CHANGE_CLEAR_BOARD(true);
    },

    returnMove() {
      this.CHANGE_RETURN_MOVE(true);
    }
  }
}
</script>

<style lang="scss" scoped>
.instChess {
  @include Instruction();
  &__mainBtns {
    margin-top: rem(30);
  }
}
</style>