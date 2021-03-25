<template>
  <Header/>
  <Maze/>
</template>

<script>
import Header from '@/layout/Header.vue'
import Maze from '@/layout/Maze.vue'
export default {
  name: 'Home',
  components: {
    Header,
    Maze
  }
}
</script>
