<template>
  <div class="home">
    <Header/>
    <Maze v-if="id === 0"/>
    <Memoji v-if="id === 1"/>
  </div>
</template>

<script>
import Header from '@/layout/Header.vue'
import Maze from '@/layout/Maze.vue'
import Memoji from '@/layout/Memoji.vue'
export default {
  name: 'Home',
  components: {
    Header,
    Maze,
    Memoji
  },
  props: {
    id: Number
  },
  created() {
    this.dontAllowToScroll();
  },
  methods: {
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
  height: 100vh;
}
</style>