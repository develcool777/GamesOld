<template>
  <div class="cell">
    <div class="cell__moveO" v-if="showO">
      <div class="cell__smallCircle"></div>
      <div class="cell__bigCircle" :style="styleO"></div>
    </div>
    <div class="cell__moveX" v-if="showX">
      <div class="cell__line1" :style="styleX"></div>
      <div class="cell__line2" :style="styleX"></div>     
    </div>
  </div>
</template>

<script>
export default {
  name: 'Cell',
  props: {
    whatToDraw: String,
    whatToHover: String,
    hover: Boolean
  },
  computed: {
    showO() {
      return this.whatToDraw === 'o' || this.whatToHover === 'o' && this.hover;
    },

    showX() {
      return this.whatToDraw === 'x'|| this.whatToHover === 'x' && this.hover;
    },

    styleO() {
      return this.whatToHover === 'o' && this.hover ? {background: 'lightblue'} : {};
    },
    
    styleX() {
      return this.whatToHover === 'x' && this.hover ? {background: 'darkred'} : {};
    }
  }
}
</script>

<style lang="scss" scoped>
.cell {
  width: 150px;
  height: 150px;
  background: lightyellow; // $white

  &__moveO, &__moveX {
    position: relative;
    width: inherit;
    height: inherit;
  }

  &__smallCircle, &__bigCircle {
    position: absolute;
    content: "";
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: blue;
    border-radius: 50%;
  }

  &__bigCircle {
    width: 140px;
    height: 140px;
  }

  &__smallCircle {
    width: 125px;
    height: 125px;
    background: lightyellow;
    z-index: 2;
  }

  &__line1, &__line2 {
    position: absolute;
    content: "";
    top: 50%;
    left: 50%;
    width: 150px;
    height: 10px;
    background: red;
    border-radius: 10px;
  }

  &__line1  {
    transform: translate(-50%, -50%) rotate(45deg);
  }
  
  &__line2 {
    transform: translate(-50%, -50%) rotate(-45deg);
  }
}
</style>