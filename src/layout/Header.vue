<template>
  <header class="head">
    <div class="head__logo">Games</div>
    <nav class="head__menu">
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
        {id: 1, name: 'Memoji', to: '/memoji'}
      ]
    }
  }
}
</script>

<style lang="scss">
.head {
  background: $black;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: rem(10);
  &__logo {
    font-size: rem(30);
  }
  &__menu {
    width: rem(200);
    @include Flex(space-between);
  }
  &__link {
    font-size: rem(20);
    color: $white;
    text-decoration: none;
  }
}
</style>