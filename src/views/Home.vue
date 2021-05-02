<template>
  <div class="home">
    <Header/>
    <HomePage v-if="id === null"/>
    <Maze v-if="id === 0"/>
    <Memoji v-if="id === 1"/>
    <RockPaperScissors v-if="id === 2"/>
    <TicTacToe v-if="id === 3"/>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import Header from '@/layout/Header.vue'
import HomePage from '@/layout/HomePage.vue'
import Maze from '@/layout/Maze.vue'
import Memoji from '@/layout/Memoji.vue'
import RockPaperScissors from '@/layout/RockPaperScissors.vue'
import TicTacToe from '@/layout/TicTacToe.vue'
export default {
  name: 'Home',
  components: {
    Header,
    HomePage,
    Maze,
    Memoji,
    RockPaperScissors,
    TicTacToe
  },
  props: {
    id: Number
  },
  created() {
    this.dontAllowToScroll();
    this.INIT_ASPECT_RATIO();
  },
  methods: {
    ...mapActions(['INIT_ASPECT_RATIO']),
    dontAllowToScroll() {
      window.addEventListener('keydown', function(e) {
        if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.key) > -1) {
          e.preventDefault();
        }
      }, false);
    }
  }
}
</script>
<style lang="scss">
.home {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
</style>