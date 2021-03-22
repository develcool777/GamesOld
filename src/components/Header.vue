<template>
  <header class="head">
    <div class="head__logo">Games</div>
    <nav class="head__menu">
      <div class="head__link">Maze</div>
    </nav>
  </header>
</template>

<script>
export default {

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
}
</style>