<template>
  <Header/>
  <Maze/>
</template>

<script>
import Header from '@/components/Header.vue'
import Maze from '@/components/Maze.vue'
export default {
  name: 'Home',
  components: {
    Header,
    Maze
  }
}
</script>
