<template>
  <div class="updated">
    <div class="updated__flex">
      <h3 class="updated__title">{{ what }} updated</h3>
      <fontAwesome icon="times" class="updated__close" title="Close" @click="close()"/>
    </div>
    <div class="updated__line">
      <div class="updated__activeLine" :style="{ width: `${percentage}%` }"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InformationUpdated',
  props: {
    what: String
  },
  data() {
    return {
      percentage: 100,
      step: 0.1
    }
  },
  created() {
    const initial = setInterval(() => {
      if (this.percentage > 0) {
        this.percentage = Math.floor(this.percentage - this.step);
      } else {
        clearInterval(initial);
        this.close();
      }
    }, 50);
  },
  methods: {
    close() {
      this.$emit('closePopup');
    }
  }
}
</script>

<style lang="scss" scoped>
.updated {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  top: 0;
  right: 0;
  width: 250px;
  height: 40px;
  background: darkslategray;
  @include boxShadow(0.3);

  &__flex {
    margin-top: 5px;
    width: 100%;
    @include Flex(space-around);
  }

  &__close {
    font-size: 20px;
    color: white;
    transition-duration: .5s;
    cursor: pointer;
  }

  &__close:hover {
    color: lightsalmon;
  }

  &__title {
    font-size: 20px;
    color: white;
  }

  &__line {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    height: 5px;
    background: aliceblue;
  }

  &__activeLine {
    height: 100%;
    background: lime; 
  }
}
</style>