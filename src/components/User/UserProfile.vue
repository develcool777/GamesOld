<template>
  <div class="profile">
    <div class="profile__title">Account</div>
    <div class="profile__info" v-if="user !== null">
      <img :src="user.avatar" alt="Avatar" class="profile__avatar" title="Avatar">
      <div class="profile__block">
        <h3 class="profile__username" title="Username">{{ user.username }}</h3>
        <button type="button" class="profile__btn">Edit Profile</button>
      </div>
    </div>
    <div class="profile__signOut" title="Sign Out" @click="signOut()">
      <fontAwesome icon="sign-out-alt" />
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapGetters } = createNamespacedHelpers('user');
export default {
  name: 'UserProfile',
  created() {
    this.user = this.getUser;
  },
  data() {
    return {
      user: null,
    }
  },
  computed: {
    ...mapGetters(['getUser'])
  },
  methods: {
    ...mapActions(['SIGN_OUT']),

    async signOut() {
      await this.SIGN_OUT();
    }
  }
}
</script>

<style lang="scss" scoped>
.profile {
  position: relative;

  &__title {
    @include Flex(center);
    height: 100px;
    font-size: 25px;
    font-weight: bold;
  }

  &__info {
    height: 100px;
    @include Flex(center);
  }

  &__avatar {
    width: 100px;
    height: 100%;
    border-radius: 5%;
  }

  &__block {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: flex-start;
    margin-left: 10px;
  }

  &__username {
    font-size: 25px;
    color: darkslategray;
  }

  &__btn {
    @include Flex(center);
    background: darkslategray;
    border-radius: 5px;
    border: none;
    height: 40px;
    width: 150px;
    color: white;
    font-size: 16px;
    cursor: pointer;
    transition-duration: .5s;
  }

  &__btn:hover {
    @include boxShadow(0.3);
    background: lighten(darkslategray, 10);
  }

  &__signOut {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 30px;
    color: darkslategray;
    cursor: pointer;
    transition-duration: .5s;
  }

  &__signOut:hover {
    color: lightcoral;
  }
}
</style>