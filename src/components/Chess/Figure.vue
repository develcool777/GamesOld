<template>
  <div class="figure" :style="{cursor: cursorStyle}">
    <img v-if="figureName !== ''" :src="figure.url" :alt="figure.name">
  </div>
</template>

<script>
export default {
  name: 'Figure',
  props: {
    figure: Object,
    cursorStyle: String,
  }
}
</script>

<style lang="scss" scopped>
</style>