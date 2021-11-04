<template>
  <header>
    <div class="head">
      <router-link tag="div" class="head__logo" to="/">
        <img class="head__img" src="@/assets/header/videogame.png" alt="logo">
        Games
      </router-link>
      <!-- <div class="head__wrapperDiv" @click="showHideUser()">
        <fontAwesome icon="user-circle" />
      </div> -->
    </div>
  </header>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapActions } = createNamespacedHelpers('user');
export default {
  name: 'Header',
  computed: {
    ...mapGetters(['getShowUser'])
  },
  methods: {
    ...mapActions(['SET_SHOW_USER']),

    showHideUser() {
      this.SET_SHOW_USER(!this.getShowUser)
    }
  }
}
</script>

<style lang="scss" scopped>
.head {
  @include Flex(center);
  position: relative;
  width: 100%;
  height: 55px;
  background: $black;
  color: white;

  &__img {
    width: 35px;
    height: 30px;
    transition-duration: .5s;
  }

  &__logo, &__link {
    font-size: 30px;
    text-decoration: none;
    color: $white;
  }

  &__logo {
    display: flex;
  }

  &__link {
    font-size: 20px;
  }

  &__wrapperDiv {
    position: absolute;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
    transition-duration: .5s;
    font-size: 30px;
    color: white;
    cursor: pointer;
  }
}

.head__logo:hover  .head__img{
  transform: scale(1.2, 1.2);
}
</style>