<template>
  <img 
    v-if="check()" 
    :src="figure[1]" 
    :alt="figure[0]" 
    class="figure" 
    :style="{cursor: cursorStyle}"
  >
</template>

<script>
export default {
  name: 'Figure',
  props: {
    figure: Array,
    cursorStyle: String,
  },
  methods: {
    check() {
      return this.figure.length === 0 ? false : true;
    }
  }
}
</script>

<style lang="scss" scopped>
.figure {
  z-index: 20;
}
</style>