<template>
  <section class="info">
    <div class="info__title" v-if="getWithComputer">
      <div>
        User:
        <span :style="userColor">{{ userSide }}</span> 
      </div>
      <div >
        <span :style="{color: 'red'}">V</span>
        <span :style="{color: 'blue'}">S</span>
      </div>
      <div>
        Comp: 
        <span :style="compColor">{{ compSide }}</span> 
      </div>
    </div>
    <div class="info__title" v-else>
      <div>
        User1: 
        <span :style="{color: 'red'}">X</span> 
      </div>
      <div>
        <span :style="{color: 'red'}">V</span>
        <span :style="{color: 'blue'}">S</span>
      </div>
      <div>
        User2: 
        <span :style="{color: 'blue'}">O</span> 
      </div>
    </div>
    <div class="info__result">{{ resultOfBattle }}</div>
  </section>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('tictactoe');
export default {
  name: 'Info',
  computed: {
    ...mapGetters(['getWithComputer', 'getCompSettings', 'getWinner']),
    compSide() {
      return this.getCompSettings.compSide === 'o' ? 'O' : 'X';
    },
    userSide() {
      return this.getCompSettings.userSide === 'o' ? 'O' : 'X';
    },
    compColor() {
      return this.getCompSettings.compSide === 'o' ? {color: 'blue'} : {color: 'red'};
    },
    userColor() {
      return this.getCompSettings.userSide === 'o' ? {color: 'blue'} : {color: 'red'};
    },
    resultOfBattle() {
      const winner = this.getWinner;
      console.log({winner});
      if (winner === '') {
        return '';
      }
      if (this.getWithComputer) {
        const compSide = this.getCompSettings.compSide;
        const userSide = this.getCompSettings.userSide;
        console.log({compSide, userSide});
        return winner === compSide ? 'Comp win' : winner === userSide ? 'User win' : `It's a draw`;
      }
      return winner === 'o' ? 'User2 win' : winner === 'x' ? 'User1 win' : `It's a draw`;
    }
  }
}
</script>

<style lang="scss" scoped> 
.info {
  &__title {
    color: $white;
    font-size: rem(50);
    width: rem(600);
    @include Flex(space-between);
  }
  &__result {
    height: rem(50);
    width: rem(600);
    color: $white;
    font-size: rem(30);
    text-align: center;
  }
}
</style>