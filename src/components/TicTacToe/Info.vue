<template>
  <section class="info">
    <div class="info__title" v-if="getPlayingWithComputer">
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
    <div class="info__result">{{ result }}</div>
  </section>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapState } = createNamespacedHelpers('tictactoe');
export default {
  name: 'Info',
  data() {
    return {
      result: ''
    }
  },
  watch: {
    winner: function(newVal) {
      if (newVal !== '') {
        this.resultOfBattle();
      }
      if (newVal === '') {
        this.result = '';
      }
    }
  },
  computed: {
    ...mapState(['winner']),
    ...mapGetters(['getPlayingWithComputer', 'getCompSettings', 'getWinner']),
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

  },
  methods: {
    resultOfBattle() {
      const winner = this.getWinner;
      if (this.getPlayingWithComputer) {
        const compSide = this.getCompSettings.compSide;
        const userSide = this.getCompSettings.userSide;
        this.result = winner === compSide ? 'Comp win' : winner === userSide ? 'User win' : `It's a draw`;
        return;
      }
      this.result = winner === 'o' ? 'User2 win' : winner === 'x' ? 'User1 win' : `It's a draw`;
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