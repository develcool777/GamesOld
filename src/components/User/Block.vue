<template>
  <div class="block" :class="{focused: isFocused}">
    <div class="block__hint">
      <div 
        class="block__hintIcon"
        v-if="showEye"
        :title="chooseHintTitle"
        @click="clickEye()"
      >
        <fontAwesome :icon="chooseEye"/>
      </div>
      <p :style="styleHintText">{{ showHint }}</p>
    </div>
    <label class="block__field">
      <div class="block__wrapperDiv">
        <fontAwesome :icon="block.icon" />
      </div>
      <div class="block__wrapperInput">
        <input 
          :type="block.type" 
          class="block__input" 
          :placeholder="block.hint"
          maxlength="40"
          @focus="focusInput(true)"
          @blur="focusInput(false)"
          v-model="string"
          :autocomplete="block.autocomplete"
        >
        <fontAwesome 
          v-if="string !== ''"
          icon="backspace" 
          class="block__backspace"
          @click="deleteString()"
          title="Clear field"
        />
        <fontAwesome 
          v-if="string === '' && block.generatePassword"
          icon="key" 
          class="block__backspace"
          @click="genPass()"
          title="Generate Password"
        />
      </div>
    </label>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Block',
  props: {
    block: Object
  },
  created() {
    this.string = this.block.value !== '' ? this.block.value : '';
  },
  watch: {
    string: function(newVal) {
      const obj = {
        key: this.block.name,
        str: newVal,
      }
      this.$emit('updatedInput', obj);
    },
    getBlockValue: function(newVal) {
      this.string = newVal;
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
    chooseEye() {
      return this.block.type === 'password' ? 'eye' : 'eye-slash';
    },
    showEye() {
      return this.block.eye !== undefined && this.string !== '';
    },
    chooseHintTitle() {
      return this.block.type === 'password' ? 'Show password' : 'Hide password'
    },
    styleHintText() {
      if (this.block.eye === undefined) {
        return {paddingLeft: `${30}px`}
      }
      return {paddingLeft: `${10}px`};
    },
    getBlockValue() {
      return this.block.value;
    }
  },
  methods: {
    focusInput(isFocus) {
      this.isFocused = isFocus;
      this.$emit('focused', this.isFocused ? this.block.name : '');
    },
    deleteString() {
      this.string = '';
    },
    clickEye() {
      this.$emit('eyeClicked', this.block.name);
    },
    genPass() {
      this.$emit('genPass');
    }
  }
}
</script>

<style lang="scss" scoped>
.block {
  position: relative;
  width: 350px;
  height: 60px;
  padding: 5px;
  border-bottom: 1px solid lightslategray;
  transition-duration: .5s;
  &__hint {
    @include Flex(flex-start);
    height: 20px;
    font-size: 16px;
    color: gray;
    user-select: none;
  }
  &__hintIcon {
    width: 20px;
    @include Flex(center);
    color: darkslategray;
    cursor: pointer;
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