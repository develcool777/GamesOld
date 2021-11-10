<template>
  <div class="pass" >
    <div class="pass__title">Password must have:</div>
    <div class="pass__variants">
      <div 
        class="pass__variant" 
        v-for="(v, i) in passHints" 
        :key="i"
        :style="{color: v.isValid ? 'green' : 'black'}"
      >
        <fontAwesome icon="check-circle"/>
        <p class="pass__text">{{ v.text }}</p>
      </div>
    </div>
  </div> 
</template>

<script>
export default  {
  name: 'PasswordCheck',
  props: {
    field: String
  },
  watch: {
    field: function(newValue) {
      this.isPasswordValid(newValue);
      this.isValid();
    }
  },
  created() {
    this.isPasswordValid(this.field);
    this.isValid();
  },  
  data() {
    return {
      passHints: [
        {text: 'At least 8 charecters', isValid: false},
        {text: 'At least 1 lowercase letter', isValid: false},
        {text: 'At least 1 uppercase letter', isValid: false},
        {text: 'At least 1 numerical number', isValid: false},
        {text: 'At least 1 special charecter', isValid: false},
      ]
    }
  },
  methods: {
    isPasswordValid(password) {
      this.passHints[0].isValid = password.length >= 8;
      this.passHints[1].isValid = password.match(/(?=.*[a-z])/) !== null;
      this.passHints[2].isValid = password.match(/(?=.*[A-Z])/) !== null;
      this.passHints[3].isValid = password.match(/(?=.*\d)/) !== null;
      this.passHints[4].isValid = password.match(/(?=.*[a-z])(?=.*[!@#$%^&*()\\-_=+\[{}\]:;.,'"?/|`~<>])/) !== null;
    },

    isValid() {
      const isValid = this.passHints.every(obj => obj.isValid);
      this.$emit('isPasswordValid', isValid);
    }
  }
}
</script>

<style lang="scss" scoped>
.pass {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  border: 1px solid lightslategray;
  border-top-color: transparent;
  padding: 10px;
  background: whitesmoke; 
  z-index: 2;

  &__title {
    margin: 5px 0;
    font-size: 16px;
  }

  &__variants {
    width: inherit;
  }

  &__variant {
    @include Flex(flex-start);
    font-size: 12px;
    width: inherit;
    margin: 5px 0;
  }

  &__text {
    margin-left: 5px;
  }
}
</style>