<template>
  <router-link class="gBlock" tag="div" :to="block.to">
    <div class="gBlock__block">
      <div class="gBlock__container">
        <video 
          class="gBlock__video"
          ref="video" 
          :src="block.videoUrl"
          :poster="block.imgUrl"
          muted="muted"  
          loop
        />
      </div>
      <div class="gBlock__title">{{ block.name }}</div>
      <div class="gBlock__text">{{ block.text }}</div>
      <div class="gBlock__flex">
        <div class="gBlock__created">Added: {{ block.created }}</div>
        <div class="gBlock__played">Played: {{ block.played }}</div>
      </div>
    </div>
  </router-link>
</template>

<script>
export default {
  name: 'GameBlock',
  props: {
    block: Object,
    hovered: Boolean
  },
  watch: {
    hovered: function(newVal) {
      if (newVal) {
        this.$refs.video.play();
      } else {
        this.$refs.video.pause();
        this.$refs.video.currentTime = 0;
      }
    }
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
    transform: scale(1.01);
    @include boxShadow(0.7);
  }
  &__container {
    width: rem(280);
    height: rem(135);
    background: gray;
  }
  &__video {
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
    height: rem(100);
    color: $black;
    opacity: 0.7;
  }
  &__flex {
    margin-top: rem(10);
    width: 100%;
    @include Flex(space-between);
    color: darkmagenta;
  }
  &__created, &__played {
    font-size: rem(16);
  }
}
</style>