<template>
  <div class="material">
    <div class="material__lines">
      <div 
        class="material__line" 
        v-for="(num, i) in 7" 
        :key="i"
        :style="calcLines(num)"
      ></div>
    </div>

    <div class="material__mainLineWrap">
      <div class="material__mainLine" :style="styleLine"></div>
      <div class="material__ratio">{{ showRatio() }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MaterialRatio',
  props: {
    matirealRatio: Number,
    boardFlipped: Boolean
  },
  watch: {
    matirealRatio: function(newVal, OldVal) {
      if (newVal > OldVal) {
        this.calcMainLine(newVal, OldVal, 0.05);
      }
      if (newVal < OldVal) {
        this.calcMainLine(newVal, OldVal, -0.05);
      }
    }
  },
  data() {
    return {
      height: 0,
      interval: null
    }
  },
  created() {
    this.calcMainLine(0, 0, 0);
  },
  computed: {
    styleLine() {
      return this.boardFlipped ? {height: `${this.height}px`, top: 0} : {height: `${this.height}px`, bottom: 0}
    }
  },
  methods: {
    calcLines(i) {
      return {top: `${i * 78 + 30}px`}
    },

    calcMainLine(materialRatioNew, materialRatioOld, step) {
      const middle = 342;
      if (materialRatioNew === materialRatioOld && step === 0) {
        this.height = middle;
        return;
      }

      clearInterval(this.interval);
      let oldValue = materialRatioOld;
      this.interval = setInterval(() => {
        if (oldValue <= materialRatioNew && step > 0 || oldValue >= materialRatioNew && step < 0) {
          const calculation = Math.floor(middle + (oldValue * 15.6));
          this.height = calculation > 654 ? 654 : calculation < 30 ? 30 : calculation;
          oldValue += step;
        }
        else {
          clearInterval(this.interval);
        }
      });
    },

    showRatio() {
      return this.matirealRatio < 1 ? this.matirealRatio : `+${this.matirealRatio}`
    }
  }
}
</script>

<style lang="scss" scopped>
.material {
  width: 20px;
  height: calc(100% + 60px);
  background: dimgray;
  
  &__lines, &__mainLineWrap {
    position: relative;
  }

  &__line {
    position: absolute;
    width: 100%;
    height: 1px;
    background: orange;
    z-index: 5;
  }

  &__line:nth-child(4) {
    background: orangered;
  }

  &__mainLineWrap {
    height: 100%;
  }

  &__mainLine {
    position: absolute;
    width: 100%;
    z-index: 2;
    background: whitesmoke;
  }

  &__ratio {
    position: absolute;
    font-size: 20px;
    color: red;
    width: 10px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 5;
    right: -100%;
  }
}
</style>