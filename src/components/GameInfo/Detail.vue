<template>
  <div class="detail" :style="styleBackground">
    <div class="detail__h4" :style="styleColor">{{ detail.name }}</div>
    <div class="detail__lineContainer">
      <div 
        class="detail__line" 
        :style="styleLine" 
        @mouseover="isHover = true" 
        @mouseleave="isHover = false"
      ></div>
      <p v-if="isHover" class="detail__amount" :style="styleQuantity"><b>{{ detail.quantity }}</b></p>
    </div>
    <div class="detail__procent" :style="styleColor">{{ detail.procent }}%</div>
  </div>
</template>

<script>
export default {
  name: 'Detail',
  props: {
    detail: Object,
    active: Boolean
  },
  data() {
    return {
      isHover: false
    }
  },
  computed: {
    styleLine() {
      const w = Math.floor(400 * this.detail.procent / 100);
      const line = {background: this.detail.color, width: `${w}px`};
      return line;
    },

    styleQuantity() {
      const w = Math.floor(400 * this.detail.procent / 100);
      const amountOfDigits = `${this.detail.quantity}`.length
      const center = 200;
      return w < center
        ? { left: `${w + 3}px` }
        : { left: `${w - (amountOfDigits * 10)}px` }
    },

    styleBackground() {
      return this.active
        ? { background: 'cadetblue' }
        : { background: 'transparent' }
    },

    styleColor() {
      return this.active
        ? { color: 'white' }
        : { color: 'dimgray' }
    }
  }
}
</script>

<style lang="scss" scoped>
.detail {
  @include Flex(space-between);
  width: 580px;
  padding: 5px 15px;

  &__h4 {
    font-size: 20px;
    width: 80px;
  }

  &__lineContainer {
    position: relative;
    display: flex;
    justify-content: flex-start;
    width: 400px;
    height: 20px;
    background: lightgray;
  }

  &__line {
    height: inherit;
    transition-duration: .5s;
  }

  &__amount {
    position: absolute;
    top: 5%;
  }

  &__procent {
    font-size: 20px;
    width: 50px;
  }
}
</style>