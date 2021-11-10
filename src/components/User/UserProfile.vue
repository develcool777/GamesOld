<template>
  <div class="profile">
    <div class="profile__title">Account</div>
    <div class="profile__info">
      <div class="profile__avatar">
        <img :src="user.photoURL" alt="Avatar">
      </div>
      <div class="profile__username">{{ user.displayName }}</div>
    </div>
  </div>
</template>

<script>
import { auth } from "@/firebase"
export default {
  name: 'UserProfile',
  created() {
    this.getUser();
  },
  data() {
    return {
      user: null,
    }
  },
  methods: {
    getUser() {
      this.user = auth.currentUser;
    }
  }
}
</script>

<style lang="scss" scoped>
.profile {
  &__title {
    @include Flex(center);
    height: 100px;
    font-size: 25px;
    font-weight: bold;
  }
}
</style>