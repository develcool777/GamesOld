<template>
  <header>
    <div class="head">
      <router-link tag="div" class="head__logo" to="/">
        <img class="head__img" src="@/assets/header/videogame.png" alt="logo">
        Games
      </router-link>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Header'
}
</script>

<style lang="scss" scopped>
.head {
  @include Flex(center);
  width: 100%;
  height: 55px;
  background: $black;
  color: white;

  &__img {
    width: 35px;
    height: 30px;
    transition-duration: .5s;
  }

  &__logo, &__link {
    font-size: 30px;
    text-decoration: none;
    color: $white;
  }

  &__logo {
    display: flex;
  }

  &__link {
    font-size: 20px;
  }
}

.head__logo:hover  .head__img{
  transform: scale(1.2, 1.2);
}
</style>