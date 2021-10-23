<template>
  <section class="info">
    <div class="info__players">
      <div class="info__player" :class="active(player1)">
        <fontAwesome icon="user"/>
        <p class="info__side" :style="styleSide">{{ player1 }}</p>
      </div>
      <p class="info__vs">VS</p>
      <div class="info__player" :class="active(player2)">
        <fontAwesome :icon="settings.playWithComputer ? 'robot' : 'user'"/>
        <p class="info__side" :style="styleSide">{{ player2 }}</p>
      </div>
    </div>
    <div class="info__resWrap">
      <transition name="result">
        <div class="info__result" v-if="winner !== ''" >{{ resultOfBattle }}</div>
      </transition>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Info',
  props: {
    settings: Object,
    winner: String,
    currentPlayer: String,
    gameStatus: String
  },
  data() {
    return {
      result: ''
    }
  },
  computed: {
    player1() {
      return this.settings.playWithComputer ? this.settings.userSide : 'x';
    },

    player2() {
      return this.settings.playWithComputer ? this.settings.compSide : 'o';
    },

    resultOfBattle() {
      if (this.winner === 'draw') {
        return`It's a draw`;
      }
      if (this.settings.playWithComputer) {
        const compSide = this.settings.compSide;
        return this.winner === compSide ? 'Computer won' : 'User won';
      }
      return this.winner === 'o' ? 'User with O won' : 'User with X won';
    },

    styleSide() {
      return this.gameStatus === 'finish'
        ? {color: 'inherit'}
        : {color: 'khaki'}
    }
  },
  methods: {
    active(player) {
      if (this.gameStatus === '') { return }
      if (this.gameStatus === 'finish') {
        return this.winner === 'draw' 
          ? 'draw'
          : this.winner === player 
            ? 'winner'
            : 'loser'
      }
      return this.currentPlayer === player 
        ? 'active'
        : ''
    }
  }
}
</script>

<style lang="scss" scoped> 
.info {
  height: 80px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;

  &__players {
    @include Flex(space-between);
    width: 500px;
    height: 50px;
    background: #302e2c;
    border-radius: 0 0 40px 40px;
    border-bottom: 1px solid gray;
  }

  &__player {
    @include Flex(center);
    color: white;
    font-size: 35px;
    width: 30%;
    height: inherit;
    transition-duration: .5s;
  }

  &__player:first-child {
    border-radius: 0 0 0 40px;
  }

  &__player:last-child {
    border-radius: 0 0 40px 0;
  }

  &__side {
    margin-left: 20px;
    font-size: 30px;
    text-transform: uppercase;
  }

  &__vs {
    color: white;
    font-size: 40px;
  }

  &__resWrap {
    position: relative;
    width: inherit;
    height: 30px;
    overflow: hidden;
  }

  &__result {
    position: absolute;
    @include Flex(center);
    top: 0;
    left: 40px;
    width: 420px;
    height: 30px;
    background: dimgray;
    border-bottom: 1px solid gray;
    border-radius: 0 0 40px 40px;
    color: white;
    font-size: 30px;
  }
}

.active {
  background: lightslategray;
  color: lawngreen;
}

.winner {
  background: lightgreen;
  color: black;
}

.loser {
  background: lightcoral;
  color: black;
}

.draw {
  background: lightgrey;
  color: black;
}

.result-enter-active,
.result-leave-active {
  transition: transform .5s;
}
.result-enter-from,
.result-leave-to {
  transform: translateY(-30px);
}
</style>