<template>
  <div class="figure">
    <img v-if="figureName !== ''" :src="require(`@/assets/chess/${figureName}`)" alt="">
  </div>
</template>

<script>
export default {
  name: 'Figure',
  props: {
    figureName: String
  },
}
</script>

<style lang="scss" scopped>
.figure {
  cursor: pointer;
}
</style>