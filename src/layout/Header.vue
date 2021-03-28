<template>
  <header class="head" ref="head">
    <div class="head__logo">Games</div>
    <nav class="head__menu">
      <div class="head__link">Maze</div>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'Header',
  mounted() {
    this.getHeight();
  },
  methods: {
    getHeight() {
      let headerHeight = this.$refs.head.clientHeight;
      this.emitter.emit("headerHeight", headerHeight);
      console.log(headerHeight);
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
}
</style>