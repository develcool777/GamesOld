<template>
  <section class="edit">
    <transition name="fade">
      <InformationUpdated v-if="updated !== ''" :what="updated" v-on:closePopup="updated = ''"/>
    </transition>
    <fontAwesome class="edit__close" icon="arrow-circle-left" title="Back" @click="close()"/>
    <h2 class="edit__title">Edit Profile</h2>
    <form class="edit__form" novalidate>
      <Block 
        class="edit__order"
        v-for="(obj, i) in groupedData"
        :key="i"
        :block="obj"
        v-on:focused="focusBlock($event)"
        v-on:updatedInput="updateInput($event)"
        v-on:eyeClicked="eyeClicked($event)"
        v-on:genPass="passwordGeneration()"
        :style="styleblock(obj)"
      >
        <transition name="fade">
          <UsernameCheck v-if="focused === 'username' && obj.name === focused"/>
        </transition>

        <transition name="fade">
          <PasswordCheck :field="obj.value" v-if="focused === 'newPassword' && obj.name === focused"/>
        </transition>

        <transition name="fade">
          <div class="edit__warning" v-if="obj.warning !== ''">
            <fontAwesome icon="info-circle" class="edit__reqIcon"/>
            <p>{{ obj.warning }}</p>
          </div>
        </transition>
      </Block>

      <button 
        class="edit__btn edit__order" 
        type="button" 
        v-for="(obj, i) in buttons"
        :key="i"
        :style="styleButton(obj.key)"
        @click="clickButton(obj.key)"

      >
        {{ obj.name }}
        <div v-if="buttonClicked === obj.key" class="edit__loading"></div>
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
import InformationUpdated from '@/components/User/InformationUpdated'
export default {
  name: 'EditUser',
  components: {
    Block,
    UsernameCheck,
    PasswordCheck,
    InformationUpdated
  },
  created() {
    this.initValues();
  },
  data() {
    return {
      buttonClicked: '',
      updated: '',
      focused: '',
      username: {
        hint: 'Username',
        value: '',
        type: 'text',
        icon: 'user',
        isValid: false,
        warning: '',
        alreadyInUse: [],
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
        autocomplete: 'off'
      },
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
      buttons: [
        {name: 'Update Username', key: 'username'},
        {name: 'Update Email', key: 'email'},
        {name: 'Update Password', key: 'password'},
      ]
    }
  },
  computed: {
    ...mapGetters(['getUser']),

    groupedData() {
      const func = (object, name, obj={}) => Object.assign(obj, object, {name});
      return [
        func(this.username, 'username'),       
        func(this.email, 'email'), 
        func(this.currentPassword, 'currentPassword'),
        func(this.newPassword, 'newPassword'), 
        func(this.confirmPassword, 'confirmPassword'),
      ]
    },
  },
  methods: {
    ...mapActions([
      'UPDATE_USERNAME', 'UPDATE_EMAIL', 'UPDATE_PASSWORD',
      'CHECK_EQUALITY', 'CHECK_AVAILABILITY', 'GENERATE_PASSWORD'
    ]),

    initValues() {
      this.username.value = this.getUser.username;
      this.email.value = this.getUser.email;
    },

    close() {
      this.$emit('close');
    },

    async clickButton(key) {
      if (this.buttonClicked !== '') return;
      this.buttonClicked = key;

      switch (this.buttonClicked) {
        case 'username':
          await this.changeUsername();
          break;

        case 'email':
          await this.changeEmail();
          break;

        case 'password':
          await this.changePassword();
          break;

        default: break;
      }
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
          this.currentPassword.isValid = await this.CHECK_EQUALITY(obj.str);
          this.currentPassword.value = obj.str;
          this.updated !== 'Password' && this.warning(this.currentPassword);
          break;

        case 'newPassword':
          const passwordPattern = /^(?=.*[0-9])(?=.*[a-z])(?=.*[!@#$%^&*()\\-_=+\[{}\]:;.,'"?/|`~<>]).{8,20}$/;
          this.newPassword.isValid = obj.str.match(passwordPattern) !== null;
          this.newPassword.value = obj.str;
          this.updated !== 'Password' && this.warning(this.newPassword);

          if (this.confirmPassword.value !== '') {
            const cond = this.confirmPassword.value === this.newPassword.value;
            this.confirmPassword.isValid = cond;
            this.warning(this.confirmPassword);
          }
          break;

        case 'confirmPassword':
          const cond = this.newPassword.value === obj.str;
          this.confirmPassword.isValid = cond;
          this.confirmPassword.value = obj.str;
          this.warning(this.confirmPassword);
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
      if (this.username.value === this.getUser.username || !this.username.isValid || this.updated !== '') {
        this.buttonClicked = '';
        return;
      }

      const isUsername = await this.CHECK_AVAILABILITY({ key: 'username', value: this.username.value })
      if (isUsername) {
        this.username.isValid = false;
        this.username.warning = `Username already in use`;
        this.username.alreadyInUse.push(this.username.value);
        this.buttonClicked = '';
        return;
      }
      await this.UPDATE_USERNAME({uid: this.getUser.uid, username: this.username.value});
      this.buttonClicked = '';
      this.updated = 'Username';
    },

    async changeEmail() {
      if (this.email.value === this.getUser.email || !this.email.isValid || this.updated !== '') {
        this.buttonClicked = '';
        return;
      }
      const isEmail = await this.CHECK_AVAILABILITY({ key: 'email', value: this.email.value }) 
      if (isEmail) {
        this.email.isValid = false;
        this.email.warning = `Email already in use`;
        this.email.alreadyInUse.push(this.email.value);
        this.buttonClicked = '';
        return;
      }
      await this.UPDATE_EMAIL({userData: this.getUser, newEmail: this.email.value});
      this.buttonClicked = '';
      this.updated = 'Email';
    },

    async changePassword() {
      const isValid = this.currentPassword.isValid && this.newPassword.isValid && this.confirmPassword.isValid && this.updated === '';
      if (!isValid) {
        this.buttonClicked = '';
        return;
      }
      await this.UPDATE_PASSWORD({userData: this.getUser, newPassword: this.newPassword.value});
      this.currentPassword.value = '';
      this.newPassword.value = '';
      this.confirmPassword.value = '';
      this.updated = 'Password';
      this.buttonClicked = '';
    },

    eyeClicked(key) {
      this[key].type = this[key].type === 'text' ? 'password' : 'text';
    }, 

    focusBlock(block) {
      this.focused = block;
    },

    styleblock(block) {
      const cond = ['username', 'email'].includes(block.name);
      if (block.value === '' && !cond || this.focused === block.name || cond && this.getUser[block.name] === block.value) { 
        return { background: 'transparent' }
      }
      return block.isValid 
        ? { background: `rgb(${204}, ${255}, ${204})` }
        : { background: `rgb(${255}, ${204}, ${204})` }
    },

    styleButton(key) {
      const username = (this.username.value === this.getUser.username || !this.username.isValid) && key === 'username';
      const email = (this.email.value === this.getUser.email || !this.email.isValid) && key === 'email';
      const password = !(this.currentPassword.isValid && this.newPassword.isValid && this.confirmPassword.isValid) && key === 'password';
      if (this.buttonClicked !== key && this.buttonClicked !== '' || username || email || password || this.updated !== '') {
        return { background: 'darkgray', cursor: 'default' }
      }
      if (this.buttonClicked === key) {
        return { cursor: 'default' } 
      }
    },

    async passwordGeneration() {
      const pass = await this.GENERATE_PASSWORD();
      this.newPassword.value = pass;
      this.newPassword.isValid = true;
      this.confirmPassword.value = pass;
      this.confirmPassword.isValid = true;
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
    height: 600px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center; 
  }

  &__order:first-child {
    order: 1;
  }

  &__order:nth-child(2) {
    order: 3;
  }

  &__order:nth-child(3) {
    order: 5;
  }

  &__order:nth-child(4) {
    order: 6;
  }

  &__order:nth-child(5) {
    order: 7;
  }

  &__order:nth-child(6) {
    order: 2;
  }

  &__order:nth-child(7) {
    order: 4;
  }

  &__order:last-child {
    order: 8;
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

  &__btn:not(:last-child) {
    margin-bottom: 20px;
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