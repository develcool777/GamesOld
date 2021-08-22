<template>
  <div class="progress">
    <div class="progress__title">{{showTitle}}</div>
    <div class="progress__loading">
      <div class="progress__percentage" :style="{width: `${percentage}%`}"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Loading',
  props: {
    step: {
      type: Number
    }
  },
  data() {
    return {
      percentage: 0
    }
  },
  computed: {
    showTitle() {
      const p = this.percentage >= 100 ? 100 : parseInt(this.percentage);
      return p < 100 ? `Loading ${p}%` : `Loading complete`
    }
  },
  created() {
    const initial = setInterval(() => {
      if (this.percentage < 100) {
        this.percentage += this.step;
      } else {
        clearInterval(initial);
      }
    })
  }
}
</script>

<style lang="scss">
.progress {
  display: inline-flex;
  flex-direction: column;
  &__title {
    font-size: 30px;
    color: white;
    text-align: center;
  }
  &__loading {
    position: relative;
    width: rem(400);
    height: rem(30);
    border-radius: rem(15);
    overflow: hidden;
    border-bottom: 1px solid #ddd;
    box-shadow: inset 0 1px 2px rgba($color: #000000, $alpha: .4),
                      0 -1px 1px #fff, 0 1px 0 #fff;
  }
  &__percentage {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    height: 100%;
    // width: 10%;
    border-radius: rem(15);
    background-color: #a5df41;
    background-size: 30px 30px;
    background-image: linear-gradient(135deg, rgba($color: #fff, $alpha: .15) 25%, transparent 25%,
                                      transparent 50%, rgba($color: #fff, $alpha: .15) 50%,
                                      rgba($color: #fff, $alpha: .15) 75%, transparent 75%, transparent);
    animation: animate-stripes 1s linear infinite;
  }
}
@keyframes animate-stripes {
  0% { background-position: 0 0; }
  100% { background-position: rem(60) 0; }
}
</style>