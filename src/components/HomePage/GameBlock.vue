<template>
  <router-link class="gBlock" tag="div" :to="block.to">
    <div class="gBlock__block">
      <div class="gBlock__container">
        <img 
          class="gBlock__img"
          :src="require(`@/assets/gamesPreview/${block.img}`)"
          :alt="block.name"
        >
      </div>
      <div class="gBlock__title">{{ block.name }}</div>
      <div class="gBlock__text">{{ block.text }}</div>
      <div class="gBlock__created">Added: {{ block.created }}</div>
    </div>
  </router-link>
</template>

<script>
export default {
  name: 'GameBlock',
  props: {
    block: Object
  }
}
</script>

<style lang="scss" scoped>
.gBlock {
  text-decoration: none;
  &__block {
    @include FlexColumn(space-between, center);
    @include boxShadow(0.3);
    width: rem(300);
    padding: rem(10);
    border-radius: rem(10);
    border: 1px solid $black;
    transition-duration: .5s;
  }
  &__block:hover {
    background: $color-primary-1;
    transform: scale(1.05);
    @include boxShadow(0.7);
  }
  &__container {
    width: rem(280);
  }
  &__img {
    width: 100%;
    height: 100%;
  }
  &__title, &__text {
    font-size: rem(20);
    color: $black
  }
  &__title {
    font-size: rem(30);
    margin: rem(20) 0;
  }
  &__text {
    height: rem(75);
    overflow: scroll;
    color: $black;
    opacity: 0.7;
  }
  &__created {
    font-size: (20);
    color: darkslateblue;
  }
}
</style>