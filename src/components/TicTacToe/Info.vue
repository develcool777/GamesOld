<template>
  <section class="info">
    <div class="info__title" v-if="settings.playWithComputer">
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
export default {
  name: 'Info',
  props: {
    settings: Object,
    winner: String
  },
  data() {
    return {
      result: ''
    }
  },
  watch: {
    winner: function(newVal) {
      this.result = newVal !== '' ? this.resultOfBattle() : '';
    }
  },
  computed: {
    compSide() {
      return this.settings.compSide.toUpperCase();
    },

    userSide() {
      return this.settings.userSide.toUpperCase();
    },

    compColor() {
      return this.settings.compSide === 'o' ? {color: 'blue'} : {color: 'red'};
    },
    
    userColor() {
      return this.settings.userSide === 'o' ? {color: 'blue'} : {color: 'red'};
    },

  },
  methods: {
    resultOfBattle() {
      if (this.winner === 'draw') {
        return`It's a draw`;
      }
      if (this.settings.playWithComputer) {
        const compSide = this.settings.compSide;
        return this.winner === compSide ? 'Comp win' : 'User win';
      }
      return this.winner === 'o' ? 'User2 win' : 'User1 win';
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