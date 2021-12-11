<template>
  <div class="snake">
    <div class="snake__game">
      <div class="snake__field">
        <Cell v-for="(cell, i) in gameField" :key="i" :cell="cell"/>
      </div>
    </div>
    <Instruction 
      class="snake__instruction" 
      :score="getScore"
      v-on:start="start()"
      v-on:stop="stop()"
      v-on:finish="finish()"
    />
  </div>
</template>

<script>
import Game from '@/model/snake/game';
import Instruction from '@/components/Snake/Instruction';
import Cell from '@/components/Snake/Cell';
export default {
  name: 'Snake',
  components: {
    Instruction,
    Cell
  },
  created() {
    this.GAME = new Game(40, 25);
    this.GAME.init();
  },
  data() {
    return {
      GAME: {},
    }
  },
  computed: {
    gameField() {
      return this.GAME?.fieldForRender.flat();
    },

    getScore() {
      return this.GAME?.score;
    },
  },
  methods: {
    start() {
      this.GAME.startGame();
    },

    stop() {
      this.GAME.stopGame();
    },

    finish() {
      this.GAME.finishGame();
    }
  }
}
</script>

<style lang="scss" scoped>
.snake {
  display: flex;
  align-items: center;
  flex: 1;

  &__game {
    flex: 1;
    @include Flex(center);
  }

  &__field {
    @include Flex(center);
    flex-wrap: wrap;
    width: 1000px;
    @include boxShadow(0.2);
  }

  &__instruction {
    flex-basis: 300px;
    margin-right: 10px;
  }
}
</style>