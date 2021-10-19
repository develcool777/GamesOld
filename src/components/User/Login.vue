<template>
  <div class="login">
    <div class="login__title">Login</div>
    <form class="login__form">
      <div class="login__blocks">
        <Block 
          v-for="(obj, i) in dataLog" 
          :key="i"
          :block="obj"
          :vModel="vModel"
          v-on:updatedInput="updateVModel($event)"
        />
      </div>
      <button class="login__submit" type="submit" @click="login()">Sign In</button>
    </form>
    <div class="login__footer">
      <p>Don't have an account?&nbsp;</p>
      <button class="login__signUp" type="button" @click="signUp()">Sign Up</button>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('user');
import Block from '@/components/User/Block'
export default {
  name: 'Login',
  components: {
    Block
  },
  data() {
    return {
      dataLog: [
        { id: 0, hint: 'Username', type: 'text', icon: 'user', vmodel: 'login', isValid: false} ,
        { id: 1, hint: 'Password', type: 'password', icon: 'lock', vmodel: 'password', isValid: false },
      ],
      vModel: {
        login: '',
        password: '',
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

    login() {
      // todo VALIDATION
    },

    signUp() {
      this.SET_WHAT_TO_SHOW('registration');
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  &__title {
    @include Flex(center);
    height: 100px;
    font-size: 25px;
    font-weight: bold;
  }

  &__form {
    width: 250px;
    height: 200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  &__blocks {
    height: 130px;
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

  &__signUp {
    background: transparent;
    color: darkslategray;
    font-weight: bold;
    border: none;
    cursor: pointer;
    font-size: 16px;
  }

  &__signUp:hover {
    color: lighten(darkslategray, 10);
  }
}
</style>