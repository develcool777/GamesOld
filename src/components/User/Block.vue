<template>
  <div class="block" :class="{focused: isFocused}" :style="styleblock">
    <div class="block__hint">{{ showHint }}</div>
    <label class="block__field">
      <div class="block__wrapperDiv">
        <fontAwesome :icon="block.icon" />
      </div>
      <div class="block__wrapperInput">
        <input 
          :type="block.type" 
          class="block__input" 
          :placeholder="block.hint"
          maxlength="20"
          minlength="3"
          @focus="focusInput(true)"
          @blur="focusInput(false)"
          v-model="string"
        >
        <fontAwesome 
          v-if="string !== ''"
          icon="backspace" 
          class="block__backspace"
          @click="deleteString()"
          title="Clear field"
        />
      </div>
    </label>
  </div>
</template>

<script>
export default {
  name: 'Block',
  props: {
    block: Object,
    vModel: Object
  },
  watch: {
    string: function(newVal) {
      const obj = {
        id: this.block.id,
        str: newVal,
        key: this.block.vmodel
      }
      this.$emit('updatedInput', obj);
    }
  },
  data() {
    return {
      isFocused: false,
      string: ''
    }
  },
  computed: {
    showHint() {
      return this.string !== '' ? this.block.hint : '';
    },

    styleblock() {
      if (this.string === '') { 
        return {background: 'transparent'}
      }
      return this.block.isValid 
        ? {background: `rgb(${204}, ${255}, ${204})`}
        : {background: `rgb(${255}, ${204}, ${204})`}
    }
  },
  methods: {
    focusInput(isFocus) {
      this.isFocused = isFocus;
    },

    deleteString() {
      this.string = '';
    }
  }
}
</script>

<style lang="scss" scoped>
.block {
  width: 250px;
  height: 60px;
  padding: 5px;
  border-bottom: 1px solid lightslategray;
  transition-duration: .5s;

  &__hint {
    padding-left: 30px;
    height: 20px;
    font-size: 16px;
    color: gray;
  }

  &__field {
    @include Flex(flex-start);
    height: 30px;
  }

  &__wrapperDiv {
    display: flex;
    align-items: center;
    width: 30px;
    height: 100%;
    font-size: 20px;
    color: darkslategray;
  }

  &__wrapperInput {
    flex: 1;
    position: relative;
    height: 100%;
    padding-right: 30px;
  }

  &__input {
    width: 100%;
    height: 100%;
    outline: none;
    border: none;
    background: transparent;
    color: darkslategray;
    font-size: 20px;
  }

  &__backspace {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 0;
    font-size: 20px;
    color: gray;
    cursor: pointer;
    transition-duration: .5s;
  }

  &__backspace:hover {
    color: darkslategray
  }
}

.block:hover {
  @include boxShadow(0.3);
}

.focused {
  @include boxShadow(0.3);
}
</style>