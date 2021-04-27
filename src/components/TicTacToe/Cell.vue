<template>
  <div class="cell">
    <div class="cell__moveO" v-if="whatToDraw === 'o'"></div>
    <div class="cell__moveX" v-if="whatToDraw === 'x'"></div>
  </div>
</template>

<script>
export default {
  name: 'Cell',
  props: {
    whatToDraw: String
  }
}
</script>

<style lang="scss" scoped>
.cell {
  width: rem(200);
  height: rem(200);
  background: $white;
  &__moveO, &__moveX {
    position: relative;
    width: inherit;
    height: inherit;
  }
  &__moveO::after, &__moveO::before {
    position: absolute;
    content: "";
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: $black;
    border-radius: 50%;
  }
  &__moveO::after {
    width: rem(140);
    height: rem(140);
    animation: drawCircle 3s linear 1s;
  }
  &__moveO::before {
    width: rem(125);
    height: rem(125);
    background: $white;
    z-index: 2;
  }
  &__moveX::after, &__moveX::before {
    position: absolute;
    content: "";
    top: 50%;
    left: 50%;
    width: rem(150);
    height: rem(10);
    background: $black;
    border-radius: rem(10);
  }
  &__moveX::after  {
    transform: translate(-50%, -50%) rotate(45deg);
  }
  &__moveX::before {
    transform: translate(-50%, -50%) rotate(-45deg);
  }
}
</style>