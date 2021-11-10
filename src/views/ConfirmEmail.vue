<template>
  <div class="cEmail">
    <header class="cEmail__header">Email Confirmation</header>
    <section class="cEmail__section">
      <div class="cEmail__block">
        <h3 class="cEmail__title">Your email has been verified</h3>
        <p class="cEmail__text">You can now sign in with new account</p>
        <div class="cEmail__btnWrap">
          <router-link to="/" class="cEmail__btn" tag="div" @click="btnClicked()">Continue</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script>

import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapGetters } = createNamespacedHelpers('user');
export default {
  name: 'ConfirmEmail',
  computed: {
    ...mapGetters(['getRegisteredUser'])
  },
  created() {
    console.log(this.getRegisteredUser, 'ConfirmEmail.vue', );
  },
  methods: {
    ...mapActions(['SET_SHOW_USER', 'SET_WHAT_TO_SHOW', 'VERIFY_EMAIL', 'PLEASE']),

    btnClicked() {
      this.SET_SHOW_USER(true);
      this.SET_WHAT_TO_SHOW('login');
    }
  }
}
</script>

<style lang="scss" scoped>
.cEmail {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;

  &__header {
    display: grid;
    justify-content: center;
    align-items: center;
    height: 50px;
    font-size: 30px;
    background: darkslategray;
    color: white;
  }

  &__section {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__block {
    width: 300px;
    height: 250px;
    @include boxShadow(0.3);
    border-radius: 5px;
  }

  &__title {
    text-align: center;
    padding: 10px 0;
    font-size: 25px;
  }

  &__text {
    margin-top: 20px;
    text-align: center;
    font-size: 20px;
  }

  &__btnWrap {
    height: 100px;
    @include Flex(center);
  }

  &__btn {
    text-decoration: none;
    padding: 10px 20px;
    border-radius: 5px;
    font-size: 20px;
    color: white;
    background: darkslategray;
    transition-duration: .5s;
    cursor: pointer;
  }

  &__btn:hover {
    background: lighten($color: darkslategray, $amount: 20);
  }
}
</style>