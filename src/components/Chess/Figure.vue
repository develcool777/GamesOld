<template>
  <div class="figure" :style="{cursor: cursorStyle}">
    <img v-if="check()" :src="figure.url" :alt="figure.name">
  </div>
</template>

<script>
export default {
  name: 'Figure',
  props: {
    figure: Object,
    cursorStyle: String,
  },
  methods: {
    check() {
      return Object.keys(this.figure).length === 0 ? false : true
    }
  }
}
</script>

<style lang="scss" scopped>
</style>