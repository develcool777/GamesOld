<template>
  <div class="gameInfo">
    <GameInfoLoading v-if="isDataLoaded.length !== 3"/>

    <router-link v-if="isDataLoaded.length === 3" class="gameInfo__return" tag="div" :to="game.path">
      <fontAwesome icon="angle-left" class="gameInfo__return--arrow"/>
      <p>Back to Game</p>
    </router-link>

    <Info :gameName="game.name" v-on:loaded="isDataLoaded.push(0)" :isLoaded="isDataLoaded.length === 3"/>

    <Rating :gameName="game.name" v-on:loaded="isDataLoaded.push(1)" :isLoaded="isDataLoaded.length === 3"/>
    
    <Comments :gameName="game.name" v-on:loaded="isDataLoaded.push(2)" :isLoaded="isDataLoaded.length === 3"/>
  </div>
</template>

<script>
import Comments from '@/components/GameInfo/Comments'
import Rating from '@/components/GameInfo/Rating'
import Info from '@/components/GameInfo/Info'
import GameInfoLoading from '@/components/GameInfo/GameInfoLoading'
export default {
  name: 'GameInfo',
  components: {
    Comments,
    Rating,
    Info,
    GameInfoLoading
  },
  props: {
    game: Object
  },
  data() {
    return {
      isDataLoaded: [],
    }
  },
}
</script>

<style lang="scss" scoped>
.gameInfo {   
  flex: 1;

  &__return {
    @include Flex(center);
    font-size: 20px;
    cursor: pointer;
    width: 170px;
    padding: 5px 10px;
    margin: 15px 0 0 15px;
    transition-duration: .5s;
    text-decoration: none;
    color: cadetblue;
    border-radius: 5px;
    border: 1px solid cadetblue;
    &--arrow {
      transition-duration: .5s;
    }
  }

  &__return:hover {
    color: lightseagreen;
    border-color: lightseagreen;
  }

  &__return:hover &__return--arrow {
    transform: translateX(-5px);
    color: lightseagreen;
  }
}
</style>