<template>
  <div class="registration">
    <div class="registration__title">Create account</div>
    <form class="registration__form">
      <div class="registration__blocks">
        <Block 
          v-for="(obj, i) in dataReg" 
          :key="i"
          :block="obj"
          :vModel="vModel"
          v-on:updatedInput="updateVModel($event)"
        />
      </div>
      <button class="registration__submit" type="submit" @click="register()">Sign Up</button>
    </form>
    <div class="registration__footer">
      <p>Already have an account?&nbsp;</p>
      <button class="registration__signIn" type="button" @click="signIn()">Sign in</button>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('user');
import Block from '@/components/User/Block'
export default {
  name: 'Registration',
  components: {
    Block
  },
  data() {
    return {
      dataReg: [
        { id: 0, hint: 'Username', type: 'text', icon: 'user', vmodel: 'login', isValid: false} ,
        { id: 1, hint: 'Email', type: 'email', icon: 'envelope', vmodel: 'email', isValid: false },
        { id: 2, hint: 'Password', type: 'password', icon: 'lock', vmodel: 'password', isValid: false },
        { id: 3, hint: 'Confirm Password', type: 'password', icon: 'lock', vmodel: 'cPassword', isValid: false },
      ],
      vModel: {
        login: '',
        email: '',
        password: '',
        cPassword: ''
      }
    }
  },
  methods: {
    ...mapActions(['SET_WHAT_TO_SHOW']),

    updateVModel(obj) {
      this.vModel[obj.key] = obj.str;
      this.dataReg[obj.id].isValid = true;
      console.log(this.vModel);
    },

    register() {
      // todo VALIDATION
    },

    signIn() {
      this.SET_WHAT_TO_SHOW('login');
    }
  }
}
</script>

<style lang="scss" scoped>
.registration {
  &__title {
    @include Flex(center);
    height: 100px;
    font-size: 25px;
    font-weight: bold;
  }

  &__form {
    width: 250px;
    height: 350px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  &__blocks {
    height: 280px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  &__submit {
    background: darkslategray;
    border-radius: 5px;
    border: none;
    height: 40px;
    color: white;
    font-size: 20px;
    cursor: pointer;
    transition-duration: .5s;
  }

  &__submit:hover {
    @include boxShadow(0.3);
    background: lighten(darkslategray, 10);
  }

  &__footer {
    margin-top: 30px;
    display: flex;
    justify-content: center;
    font-size: 16px;
  }

  &__signIn {
    background: transparent;
    color: darkslategray;
    font-weight: bold;
    border: none;
    cursor: pointer;
    font-size: 16px;
  }

  &__signIn:hover {
    color: lighten(darkslategray, 10);
  }
}
</style>