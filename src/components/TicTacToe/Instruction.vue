<template>
  <div class="instTic">
    <div class="instTic__mainBtns">
      <div class="instTic__mainBtn" @click="startGame()">{{ start }}</div>
      <div class="instTic__mainBtn" @click="clear()">Clear Field</div>
      <div class="instTic__mainBtn" @click="returnMove()">Return move</div>
      <div class="instTic__mainBtn" :class="{active: !settings.playWithComputer}" @click="changePlayer(false)">User1 VS User2</div>
      <div class="instTic__mainBtn" :class="{active: settings.playWithComputer}" @click="changePlayer(true)">User VS Comp</div>
    </div>
    <section class="" v-if="settings.playWithComputer">
      <div class="instTic__block">
        <div class="instTic__title">Users choice</div>
      </div>
      <div class="instTic__mainBtns">
        <div 
          class="instTic__mainBtn" 
          v-for="(side, i) in sides"
          :key="i"
          :class="{active: settings.compSide === side.comp}" 
          @click="changeSide(settings.compSide === side.comp)"
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
          :class="{active: settings.difficulty === diff}" 
          @click="changeDifficulty(diff)"
        >{{ diff }}</div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Instruction',
  props: {
    status: String,
    settings: Object
  },
  data() {
    return {
      allowClick: true,
      sides: [
        { comp: 'o', user: 'X' },
        { comp: 'x', user: 'O' }
      ],
      difficulties: [ 'easy', 'hard' ]
    }
  },
  computed: {
    start() {
      return this.status === 'start' ? 'Started' : 'Start';
    }
  },
  methods: {
    clear() {
      this.$emit('finish');
    },

    returnMove() {
      this.$emit('returnMove');
    },

    changePlayer(bool) {
      this.$emit('changePlayingWith', bool);
    },

    changeSide(bool) {
      this.$emit('changeSide', bool);
    },

    changeDifficulty(diff) {
      this.$emit('changeDifficulty', diff);
    },
    
    startGame() {
      this.$emit('start');
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
  &__mainBtn::first-letter {
    text-transform: uppercase;
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