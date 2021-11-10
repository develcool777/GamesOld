<template>
  <div class="login">
    <div class="login__title">Login</div>
    <form class="login__form" @submit="login($event)" novalidate>
      <div class="login__blocks">
        <Block 
          v-for="(value, key, i) in dataLog" 
          :key="i"
          :block="Object.assign(value, {name: key})"
          :style="styleblock(Object.assign(value, {name: key}))"
          v-on:focused="focusBlock($event)"
          v-on:updatedInput="updateVModel($event)"
          v-on:eyeClicked="eyeClicked($event)"
        >
          <transition name="fade">
            <div class="login__required" v-if="value.warning !== ''">
              <fontAwesome icon="info-circle" class="login__reqIcon"/>
              <p>{{ value.warning }}</p>
            </div>
          </transition>
        </Block>
      </div>
      <button class="login__submit" type="submit">
        Sign In
        <div class="login__loading" v-if="isSignInRequest"></div>
      </button>
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
      focused: '',
      isSignInRequest: false,
      dataLog: {
        email: {
          hint: 'Email',
          value: '',
          type: 'email',
          icon: 'envelope',
          isValid: false,
          warning: '',
          wrongData: []
        },
        password: {
          hint: 'Password',
          value: '',
          type: 'password',
          icon: 'lock',
          isValid: false,
          eye: true,
          warning: '',
          wrongData: []
        },
      }
    }
  },
  created() {
    this.savedValue();
  },
  methods: {
    ...mapActions(['SET_WHAT_TO_SHOW', 'SIGN_IN']),

    savedValue() {
      ['email', 'password'].forEach(key => {
        const value = sessionStorage.getItem(key);
        if (value !== null) {
          this.dataLog[key].value = value;
        }
      });
    },

    updateVModel(obj) {
      this.dataLog[obj.key].value = obj.str;
      sessionStorage.setItem(obj.key, obj.str);
      if (obj.key === 'email') {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const notFound = !this.dataLog.email.wrongData.includes(this.dataLog.email.value);
        this.dataLog.email.isValid = obj.str.match(emailPattern) !== null && notFound;
      }
      if (obj.key === 'password') {
        const notFound = !this.dataLog.password.wrongData.includes(this.dataLog.password.value);
        this.dataLog.password.isValid = obj.str !== '' && notFound;
      }
    },

    styleblock(block) {
      if (block.value === '' || this.focused === block.name) { 
        return {background: 'transparent'}
      }
      return block.isValid 
        ? {background: `rgb(${204}, ${255}, ${204})`}
        : {background: `rgb(${255}, ${204}, ${204})`}
    },

    warnings() {
      let isGood = true;
      for (let key in this.dataLog) {
        const field = this.dataLog[key];
        if (field.isValid) {
          field.warning = ''
          continue;
        }
        isGood = false

        if (field.wrongData.includes(field.value)) {
          field.warning = key === 'email' 
            ? 'User not Found'
            : 'Wrong password'
          continue;
        }

        field.warning = field.value === '' 
          ? 'Field required'
          : `Invalid ${key}`
      }
      return isGood;
    },

    async login(event) {
      this.isSignInRequest = true;
      event.preventDefault();

      if (!this.warnings()) {
        this.isSignInRequest = false;
        return;
      }

      const data = {};
      for (let key in this.dataLog) {
        data[key] = this.dataLog[key].value;
      }

      const isOK = await this.SIGN_IN(data);
      this.isSignInRequest = false;

      if (isOK.isLogined) {
        ['email', 'password'].forEach(key => sessionStorage.removeItem(key));
        return this.SET_WHAT_TO_SHOW('account');
      }

      if (isOK.errorCode === 'auth/user-not-found') {
        this.dataLog.email.wrongData.push(this.dataLog.email.value);
        this.dataLog.email.isValid = false;
        this.dataLog.email.warning = 'User not Found';
      }

      if (isOK.errorCode === 'auth/wrong-password') {
        this.dataLog.password.wrongData.push(this.dataLog.password.value);
        this.dataLog.password.isValid = false;
        this.dataLog.password.warning = 'Wrong password';
      }
    },

    signUp() {
      ['email', 'password'].forEach(key =>sessionStorage.removeItem(key));
      this.SET_WHAT_TO_SHOW('registration');
    },

    focusBlock(block) {
      this.focused = block;
      this.warnings();
    },

    eyeClicked(key) {
      this.dataLog[key].type = this.dataLog[key].type === 'text' ? 'password' : 'text';
    }, 
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
    width: 350px;
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
    @include Flex(center);
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

  &__required {
    position: absolute;
    top: 5px;
    right: 5px;
    display: flex;
    align-items: center;
    font-size: 12px;
    color: red;
  }

  &__reqIcon {
    margin-right: 5px;
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

  &__loading {
    margin-left: 5px;
    border: 5px solid #f3f3f3;
    border-radius: 50%;
    border-top: 5px solid #3498db;
    width: 25px;
    height: 25px;
    animation: spin 1s linear infinite;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>