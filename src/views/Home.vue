<template>
  <div class="home">
    <Header class="home__header"/>
    <HomePage v-if="id === null"/>
    <Maze v-if="id === 0"/>
    <Memoji v-if="id === 1"/>
    <RockPaperScissors v-if="id === 2"/>
    <TicTacToe v-if="id === 3"/>
    <Chess v-if="id === 4"/>

    <transition name="user">
      <User class="home__user" v-if="getShowUser"/>
    </transition>
    <transition name="fade">
      <div class="home__mask" v-if="getShowUser" @click="hideUser()"></div>
    </transition>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapActions } = createNamespacedHelpers('user');
import Header from '@/layout/Header.vue'
import HomePage from '@/layout/HomePage.vue'
import Maze from '@/layout/Maze.vue'
import Memoji from '@/layout/Memoji.vue'
import RockPaperScissors from '@/layout/RockPaperScissors.vue'
import TicTacToe from '@/layout/TicTacToe.vue'
import Chess from '@/layout/Chess.vue'
import User from '@/layout/User.vue'
export default {
  name: 'Home',
  components: {
    Header,
    HomePage,
    Maze,
    Memoji,
    RockPaperScissors,
    TicTacToe,
    Chess,
    User
  },
  props: {
    id: Number
  },
  computed: {
    ...mapGetters(['getShowUser'])
  },
  created() {
    this.SURVIVE_PAGE_RELOAD();
  },
  methods: {
    ...mapActions(['SET_SHOW_USER', 'SURVIVE_PAGE_RELOAD']),

    hideUser() {
      this.SET_SHOW_USER(!this.getShowUser);
    }
  }
}
</script>
<style lang="scss">
.home {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100vh;

  &__header {
    position: sticky;
    top: 0;
    z-index: 10;
  }

  &__user {
    position: fixed;
    top: 55px;
    right: 0;
    width: 400px;
    height: 100%;
    z-index: 15;
  }

  &__mask {
    position: fixed;
    top: 55px;
    width: 100vw;
    height: calc(100% - 55px);
    background: rgba(0, 0, 0, 0.6);
    z-index: 10;
  }
}

// transition
.user-enter-active, .user-leave-active {
  transition: transform .5s;
}

.user-enter-from, .user-leave-to {
  transform: translateX(400px);
}
</style>