<template>
  <section class="inst">
    <div class="inst__score">
      <fontAwesome 
        icon="apple-alt"
        class="inst__apple"
        title="Score"
      />
      {{ score }}
    </div>

    <div class="inst__controls">
      <div class="inst__control" title="Play" @click="start()">
        <fontAwesome icon="play-circle"/>
      </div>
      <div class="inst__control" title="Stop" @click="stop()">
        <fontAwesome icon="stop-circle"/>
      </div>
      <div class="inst__control" title="Finish" @click="finish()">
        <fontAwesome icon="flag"/>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Instruction',
  props: {
    score: Number
  },
  methods: {
    start() {
      this.$emit('start');
    },

    stop() {
      this.$emit('stop');
    },

    finish() {
      this.$emit('finish');
    }
  }
}
</script>

<style lang="scss" scoped>
.inst {
  user-select: none;
  background: #302e2c;
  border-radius: 5px 5px 0 0;

  &__score {
    @include Flex(center);
    height: 40px;
    color: white;
    border-bottom: 1px solid gray;
    font-size: 30px;
  }

  &__apple {
    color: red;
    font-size: 23px;
    margin-right: 10px;
  }

  &__controls {
    @include Flex(space-around);
    height: 40px;
    border-bottom: 1px solid gray;
  }

  &__control {
    font-size: 25px;
    color: white;
  }
}
</style>