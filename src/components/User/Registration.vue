<template>
  <div class="registration" v-if="!isRegistrationComplete">
    <div class="registration__title">Create account</div>
    <form class="registration__form" @submit="register($event)" @keypress.enter="register($event)" novalidate>
      <div class="registration__blocks" >
        <Block 
          :block="Object.assign(value, {name: key})"
          v-for="(value, key, i) in dataReg"
          :key="i"
          :style="styleblock(Object.assign(value, {name: key}))"
          v-on:updatedInput="updateVModel($event)"
          v-on:focused="focusBlock($event)"
          v-on:eyeClicked="eyeClicked($event)"
          v-on:genPass="passwordGeneration()"
        > 
          <transition name="fade">
            <PasswordCheck :field="getPasswordField" v-if="focused === 'password' && key === focused"/>
          </transition>

          <transition name="fade">
            <UsernameCheck :field="getUsernameField" v-if="focused === 'username' && key === focused"/>
          </transition>

          <transition name="fade">
            <div class="registration__required" v-if="value.warning !== ''">
              <fontAwesome icon="info-circle" class="registration__reqIcon"/>
              <p>{{ value.warning }}</p>
            </div>
          </transition>
        </Block>
      </div>
      <button class="registration__submit" type="submit">
        Sign Up
        <div class="registration__loading" v-if="isSignUpRequest"></div>
      </button>
    </form>
    <div class="registration__footer">
      <p>Already have an account?&nbsp;</p>
      <button class="registration__signIn" type="button" @click="signIn()">Sign in</button>
    </div>
  </div>
  <div class="complete" v-if="isRegistrationComplete">
    <div class="complete__title">You Successfully Registered</div>
    <button class="complete__signIn" type="button" @click="signIn()">Sign in</button>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('user');
import Block from '@/components/User/Block'
import PasswordCheck from '@/components/User/PasswordCheck'
import UsernameCheck from '@/components/User/UsernameCheck'
export default {
  name: 'Registration',
  components: {
    Block,
    PasswordCheck,
    UsernameCheck
  },
  computed: {
    getPasswordField() {
      return this.dataReg.password.value;
    },
    getUsernameField() {
      return this.dataReg.username.value;
    }
  },
  data() {
    return {
      focused: '',
      isSignUpRequest: false,
      isRegistrationComplete: false,
      dataReg: {
        username: {
          hint: 'Username',
          value: '',
          type: 'text',
          icon: 'user',
          isValid: false,
          warning: '',
        },
        email: {
          hint: 'Email',
          value: '',
          type: 'email',
          icon: 'envelope',
          isValid: false,
          warning: '',
          alredyInUse: []
        },
        password: {
          hint: 'Password',
          value: '',
          type: 'password',
          icon: 'lock',
          isValid: false,
          eye: true,
          generatePassword: true,
          warning: ''
        },
        cPassword: {
          hint: 'Confirm Password',
          value: '',
          type: 'password',
          icon: 'lock',
          isValid: false,
          eye: true,
          warning: ''
        },
      },
    }
  },
  created() {
    this.savedValue();
  },
  methods: {
    ...mapActions(['SET_WHAT_TO_SHOW', 'CREATE_ACCOUNT']),

    savedValue() {
      ['username', 'email', 'password', 'cPassword'].forEach((key, i) => {
        const userValue = sessionStorage.getItem(key);
        if (userValue !== null) {
          this.dataReg[key].value = userValue;
        }
      });
    },

    updateVModel(obj) {
      this.dataReg[obj.key].value = obj.str;
      sessionStorage.setItem(obj.key, obj.str);

      switch (obj.key) {
        case 'username': 
          const usernamePattern = /^[a-zA-Z0-9]([_-](?![_-])|[a-zA-Z0-9]){3,18}[a-zA-Z0-9]$/;
          this.dataReg.username.isValid = obj.str.match(usernamePattern) !== null;
          return;

        case 'email':
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          const notInUse = !this.dataReg.email.alredyInUse.includes(this.dataReg.email.value);
          this.dataReg.email.isValid = obj.str.match(emailPattern) !== null && notInUse;
          return;

        case 'password':                                              
          const passwordPattern = /^(?=.*[0-9])(?=.*[a-z])(?=.*[!@#$%^&*()\\-_=+\[{}\]:;.,'"?/|`~<>]).{8,20}$/;
          this.dataReg.password.isValid = obj.str.match(passwordPattern) !== null;

          if (this.dataReg.password.value !== '') {
            const cond = this.dataReg.password.value === this.dataReg.cPassword.value;
            this.dataReg.cPassword.isValid = cond;
          }
          return;

        case 'cPassword':
          const cond = this.dataReg.password.value === this.dataReg.cPassword.value;
          this.dataReg.cPassword.isValid = cond;
          return;
      
        default: return;
      }
    },

    eyeClicked(key) {
      this.dataReg[key].type = this.dataReg[key].type === 'text' ? 'password' : 'text';
    },  

    styleblock(block) {
      if (block.value === '' || this.focused === block.name) { 
        return {background: 'transparent'}
      }
      return block.isValid 
        ? {background: `rgb(${204}, ${255}, ${204})`}
        : {background: `rgb(${255}, ${204}, ${204})`}
    },

    async register(event) {
      this.isSignUpRequest = true;
      event.preventDefault();

      if (!this.warnings()) {
        this.isSignUpRequest = false;
        return;
      }

      const data = {};
      for (let key in this.dataReg) {
        data[key] = this.dataReg[key].value
      }
      const isOK = await this.CREATE_ACCOUNT(data);
      this.isSignUpRequest = false;

      if (isOK.isCreated) {
        this.isRegistrationComplete = true;
        ['username', 'email', 'password', 'cPassword'].forEach(key => sessionStorage.removeItem(key));
        return;
      }

      if (isOK.errorCode === 'auth/email-already-in-use') {
        this.dataReg.email.isValid = false;
        this.dataReg.email.warning = `Email already in use`;
        this.dataReg.email.alredyInUse.push(this.dataReg.email.value);
      }
    },

    warnings() {
      let isGood = true;
      for (let key in this.dataReg) {
        const field = this.dataReg[key];
        if (field.isValid) {
          field.warning = ''
          continue;
        }
        isGood = false;

        if (key === 'cPassword' && field.value !== '') {
          field.warning = `passwords don't match`;
          continue;
        }

        if (key === 'email' && field.value !== '' && field.alredyInUse.includes(field.value)) {
          field.warning = `Email already in use`;
          continue;
        }

        field.warning = field.value === '' 
          ? 'Field required'
          : `Invalid ${key}`
      }
      return isGood;
    },

    signIn() {
      ['username', 'email', 'password', 'cPassword'].forEach(key => sessionStorage.removeItem(key));
      this.SET_WHAT_TO_SHOW('login');
    },

    focusBlock(block) {
      this.focused = block;
      this.warnings();
    },

    passwordGeneration() {
      const pass = [];
      const randNumber = () => Math.floor(Math.random() * 10);
      const randLetter = (min, max) => String.fromCharCode(Math.floor(Math.random() * (max - min)) + min);
      const specialcharacters = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '\\', '-', '_', '=', '+', '[', '{', '}', ']', ':', ';', '.', ',', '\'', '\"', '?', '/', '|', '\`', '~', '<', '>'];
      const randSpecialCharacter = () => specialcharacters[Math.floor(Math.random() * (specialcharacters.length - 1))];
      pass.push(
        randNumber(), randNumber(), randNumber(),
        randLetter(65, 90), randLetter(65, 90), randLetter(65, 90),
        randLetter(97, 122), randLetter(97, 122), randLetter(97, 122),
        randSpecialCharacter(), randSpecialCharacter(), randSpecialCharacter()
      );
      const result = pass.sort(() => Math.random() - 0.5).join('');
      this.dataReg.password.value = result;
      this.dataReg.password.isValid = true;
    }
  },
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
    width: 350px; 
    height: 420px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  &__blocks {
    height: 320px;
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

.complete {
  &__title {
    @include Flex(center);
    height: 100px;
    font-size: 25px;
    font-weight: bold;
  }

  &__signIn {
    @include Flex(center);
    margin: 0 auto;
    background: darkslategray;
    border-radius: 5px;
    border: none;
    height: 40px;
    width: 200px;
    color: white;
    font-size: 20px;
    cursor: pointer;
    transition-duration: .5s;
  }

  &__signIn:hover {
    @include boxShadow(0.3);
    background: lighten(darkslategray, 10);
  }
}
</style>