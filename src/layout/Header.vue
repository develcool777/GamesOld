<template>
  <header class="head">
    <router-link tag="div" class="head__logo" to="/">
      <img class="head__img" src="@/assets/header/videogame.png" alt="logo">
      Games
    </router-link>
    <nav class="head__menu" >
      <router-link tag="div" class="head__link" v-for="(item, i) in menu" :key="i" :to="item.to">{{item.name}}</router-link>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'Header',
  data() {
    return {
      menu: [
        {id: 0, name: 'Maze', to: '/maze'},
        {id: 1, name: 'Memoji', to: '/memoji'},
        {id: 2, name: 'Rock Paper Scissors', to: '/rock-paper-scissors'}
      ]
    }
  }
}
</script>

<style lang="scss">
.head {
  @include Flex(space-between);
  padding: rem(10);
  background: $black;
  color: white;
  &__img {
    width: rem(35);
    height: rem(30);
    transition-duration: .5s;
  }
  &__logo, &__link {
    font-size: rem(30);
    text-decoration: none;
    color: $white;
  }
  &__logo {
    display: flex;
    margin-right: rem(50);
  }
  &__menu {
    flex: 1;
    @include Flex(space-between);
  }
  &__link {
    font-size: rem(20);
  }
}
.head__logo:hover  .head__img{
  transform: scale(1.2, 1.2);
}
</style>