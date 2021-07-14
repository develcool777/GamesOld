<template>
  <div class="figure" :style="{cursor: cursorStyle}">
    <img v-if="figureName !== ''" :src="require(`@/assets/chess/${figureName}`)" alt="">
  </div>
</template>

<script>
export default {
  name: 'Figure',
  props: {
    figureName: String,
    cursorStyle: String,
  }
}
</script>

<style lang="scss" scopped>
</style>