<template>
  <div class="home">
    <Header/>
    <Maze v-if="id === 0"/>
  </div>
</template>

<script>
import Header from '@/layout/Header.vue'
import Maze from '@/layout/Maze.vue'
export default {
  name: 'Home',
  components: {
    Header,
    Maze
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