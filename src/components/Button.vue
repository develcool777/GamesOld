<template>
  <button 
    ref="Button"
    class="button" 
    type="button" 
    @click="clickButton(Button.name)"
    :title="Title"
  >
    <fontAwesome :icon="Button.icon" />
  </button>
</template>

<script>
export default {
  name: 'Button',
  props: {
    Button: Object,
    Title: String
  },
  methods: {
    clickButton(button='') {
      this.$refs.Button.blur();
      this.$emit('buttonClicked', button);
    }
  }
}
</script>

<style lang="scss">
.button {
  background: transparent;
  border: none;
}
</style>