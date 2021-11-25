<template>
  <section class="edit">
    <fontAwesome class="edit__close" icon="arrow-circle-left" title="Back" @click="close()"/>
    <h2 class="edit__title">Edit Profile</h2>
    <form class="edit__form edit__form--single" novalidate>
      <Block 
        :block="Object.assign(username, {name: 'username'})"
        v-on:focused="focusBlock($event)"
        v-on:updatedInput="updateInput($event)"
        :style="styleblock(Object.assign(username, {name: 'username'}))"
      >
        <transition name="fade">
          <UsernameCheck v-if="focused === 'username'"/>
        </transition>

        <transition name="fade">
          <div class="edit__warning" v-if="username.warning !== ''">
            <fontAwesome icon="info-circle" class="edit__reqIcon"/>
            <p>{{ username.warning }}</p>
          </div>
        </transition>
      </Block>
      <button class="edit__btn" type="button" @click="changeUsername()">
        Update Username
        <div v-if="usernameLoading" class="edit__loading"></div>
      </button>
    </form>

    <form class="edit__form edit__form--single" novalidate>
      <Block 
        :block="Object.assign(email, {name: 'email'})"
        v-on:focused="focusBlock($event)"
        v-on:updatedInput="updateInput($event)"
        :style="styleblock(Object.assign(email, {name: 'email'}))"
      >
        <transition name="fade">
          <div class="edit__warning" v-if="email.warning !== ''">
            <fontAwesome icon="info-circle" class="edit__reqIcon"/>
            <p>{{ email.warning }}</p>
          </div>
        </transition>
      </Block>
      <button class="edit__btn" type="button" @click="changeEmail()">
        Update Email
        <div v-if="emailLoading" class="edit__loading"></div>
      </button>
    </form>

    <form class="edit__form" novalidate>
      <Block 
        v-for="(value, key, i) in password"
        :key="i"
        :block="Object.assign(value, {name: key})"
        v-on:focused="focusBlock($event)"
        v-on:updatedInput="updateInput($event)"
        v-on:eyeClicked="eyeClicked($event)"
        v-on:genPass="passwordGeneration()"
        :style="styleblock(Object.assign(value, {name: key}))"
      >
        <transition name="fade">
          <PasswordCheck :field="value.value" v-if="focused === 'newPassword' && key === focused"/>
        </transition>

        <transition name="fade">
          <div class="edit__warning" v-if="value.warning !== ''">
            <fontAwesome icon="info-circle" class="edit__reqIcon"/>
            <p>{{ value.warning }}</p>
          </div>
        </transition>
      </Block>
      <button class="edit__btn" type="button" @click="changePassword()">
        Update Password
        <div v-if="passwordLoading" class="edit__loading"></div>
      </button>
    </form>
  </section>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapGetters } = createNamespacedHelpers('user');
import Block from '@/components/User/Block'
import UsernameCheck from '@/components/User/UsernameCheck'
import PasswordCheck from '@/components/User/PasswordCheck'
export default {
  name: 'EditUser',
  components: {
    Block,
    UsernameCheck,
    PasswordCheck
  },
  created() {
    this.initValues();
  },
  data() {
    return {
      usernameLoading: false,
      emailLoading: false,
      passwordLoading: false,
      focused: '',
      username: {
        hint: 'Username',
        value: '',
        type: 'text',
        icon: 'user',
        isValid: false,
        warning: '',
        alreadyInUse: [],
        currentValue: '',
        autocomplete: 'off'
      },
      email: {
        hint: 'Email',
        value: '',
        type: 'email',
        icon: 'envelope',
        isValid: false,
        warning: '',
        alreadyInUse: [],
        currentValue: '',
        autocomplete: 'off'
      },
      password: {
        currentPassword: {
          hint: 'Current Password',
          value: '',
          type: 'password',
          icon: 'lock',
          isValid: false,
          warning: '',
          eye: true,
          autocomplete: 'off'
        },
        newPassword: {
          hint: 'New Password',
          value: '',
          type: 'password',
          icon: 'lock',
          isValid: false,
          warning: '',
          eye: true,
          generatePassword: true,
          autocomplete: 'off'
        },
        confirmPassword: {
          hint: 'Confirm Password',
          value: '',
          type: 'password',
          icon: 'lock',
          isValid: false,
          warning: '',
          eye: true,
          autocomplete: 'off'
        },
      }
    }
  },
  computed: {
    ...mapGetters(['getUser']),
  },
  methods: {
    ...mapActions([
      'UPDATE_USERNAME', 'GET_USER_DATA_BY_UID', 'UPDATE_EMAIL', 'UPDATE_PASSWORD',
      'CHECK_EQUALITY', 'CHECK_AVAILABILITY', 'GENERATE_PASSWORD'
    ]),

    initValues() {
      this.username.value = this.getUser.username;
      this.username.currentValue = this.getUser.username;
      this.email.value = this.getUser.email;
      this.email.currentValue = this.getUser.email;
    },

    close() {
      this.$emit('close');
    },

    async updateInput(obj) {
      switch (obj.key) {
        case 'username':
          const usernamePattern = /^[a-zA-Z0-9]([_-](?![_-])|[a-zA-Z0-9]){3,18}[a-zA-Z0-9]$/;
          const notInUseUsername = !this.username.alreadyInUse.includes(obj.str);
          this.username.isValid = obj.str.match(usernamePattern) !== null && notInUseUsername;
          this.username.value = obj.str;
          this.warning(this.username);
          break;

        case 'email':
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          const notInUseEmail = !this.email.alreadyInUse.includes(obj.str);
          this.email.isValid = obj.str.match(emailPattern) !== null && notInUseEmail;
          this.email.value = obj.str;
          this.warning(this.email);
          break;

        case 'currentPassword':
          this.password.currentPassword.isValid = await this.CHECK_EQUALITY(obj.str);
          this.password.currentPassword.value = obj.str;
          this.warning(this.password.currentPassword)
          break;

        case 'newPassword':
          const passwordPattern = /^(?=.*[0-9])(?=.*[a-z])(?=.*[!@#$%^&*()\\-_=+\[{}\]:;.,'"?/|`~<>]).{8,20}$/;
          this.password.newPassword.isValid = obj.str.match(passwordPattern) !== null;
          this.password.newPassword.value = obj.str;
          this.warning(this.password.newPassword);

          if (this.password.confirmPassword.value !== '') {
            const cond = this.password.confirmPassword.value === this.password.newPassword.value;
            this.password.confirmPassword.isValid = cond;
            this.warning(this.password.confirmPassword);
          }
          break;

        case 'confirmPassword':
          const cond = this.password.newPassword.value === obj.str;
          this.password.confirmPassword.isValid = cond;
          this.password.confirmPassword.value = obj.str;
          this.warning(this.password.confirmPassword);
          break;
      
        default: break;
      }
    },

    warning(obj) {
      if (obj.isValid) {
        obj.warning = ''
        return;
      }

      if (obj.value !== '' && obj.alreadyInUse?.includes(obj.value)) {
        obj.warning = `${obj.hint} already in use`;
        return;
      }

      if (obj.value !== '' && obj.hint === 'Confirm Password') {
        obj.warning = `Passwords don't match`;
        return;
      }

      if (obj.value !== '' && obj.hint === 'Current Password') {
        obj.warning = `Wrong password`;
        return;
      }

      obj.warning = obj.value === ''
        ? 'Field required'
        : `Invalid ${obj.hint}`
    },

    async changeUsername() {
      if (this.username.value === this.getUser.username || !this.username.isValid) return;
      this.usernameLoading = true;
      const isUsername = await this.CHECK_AVAILABILITY({ key: 'username', value: this.username.value })
      if (isUsername) {
        this.username.isValid = false;
        this.username.warning = `Username already in use`;
        this.username.alreadyInUse.push(this.username.value);
        this.usernameLoading = false;
        return;
      }
      await this.UPDATE_USERNAME({uid: this.getUser.uid, username: this.username.value});
      await this.GET_USER_DATA_BY_UID(this.getUser.uid);
      this.usernameLoading = false;
    },

    async changeEmail() {
      if (this.email.value === this.getUser.email || !this.email.isValid) return;
      this.emailLoading = true;
      const isEmail = await this.CHECK_AVAILABILITY({ key: 'email', value: this.email.value }) 
      if (isEmail) {
        this.email.isValid = false;
        this.email.warning = `Email already in use`;
        this.email.alreadyInUse.push(this.email.value);
        this.emailLoading = false;
        return;
      }
      await this.UPDATE_EMAIL({userData: this.getUser, newEmail: this.email.value});
      await this.GET_USER_DATA_BY_UID(this.getUser.uid);
      this.emailLoading = false;
    },

    async changePassword() {
      const isValid = Object.values(this.password).every(obj => obj.isValid);
      if (!isValid) return;
      this.passwordLoading = true;
      await this.UPDATE_PASSWORD({userData: this.getUser, newPassword: this.password.newPassword.value});
      await this.GET_USER_DATA_BY_UID(this.getUser.uid);
      this.passwordLoading = false;
      this.password.currentPassword.value = '';
      this.password.newPassword.value = '';
      this.password.confirmPassword.value = '';
    },

    eyeClicked(key) {
      this.password[key].type = this.password[key].type === 'text' ? 'password' : 'text';
    }, 

    focusBlock(block) {
      this.focused = block;
    },

    styleblock(block) {
      const cond = ['username', 'email'].includes(block.name);
      if (block.value === '' && !cond || this.focused === block.name || cond && block.currentValue === block.value) { 
        return {background: 'transparent'}
      }
      return block.isValid 
        ? {background: `rgb(${204}, ${255}, ${204})`}
        : {background: `rgb(${255}, ${204}, ${204})`}
    },

    async passwordGeneration() {
      const pass = await this.GENERATE_PASSWORD();
      this.password.newPassword.value = pass;
      this.password.newPassword.isValid = true;
      this.password.confirmPassword.value = pass;
      this.password.confirmPassword.isValid = true;
    }
  },
}
</script>

<style lang="scss" scoped>
.edit {
  position: relative;

  &__close {
    position: absolute;
    top: 10px;
    left: 10px;
    font-size: 30px;
    color: darkslategray;
    cursor: pointer;
    transition-duration: .5s;
  }

  &__close:hover {
    color: lightcoral;
  }

  &__title {
    @include Flex(center);
    height: 100px;
    font-size: 25px;
    font-weight: bold;
  }

  &__form {
    width: 350px; 
    margin: 0 auto;
    height: 280px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center; 
    &--single {
      height: 110px;
    }
  }

  &__form:not(:last-child) {
    margin-bottom: 30px; 
  }

  &__btn {
    @include Flex(center);
    background: darkslategray;
    border-radius: 5px;
    border: none;
    height: 40px;
    width: 220px;
    color: white;
    font-size: 20px;
    cursor: pointer;
    transition-duration: .5s;
  }

  &__btn:hover {
    @include boxShadow(0.3);
    background: lighten(darkslategray, 10);
  }

  &__warning {
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
</style>