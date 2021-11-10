<template>
  <div class="user">
    <Registration v-if="getWhatToShow === 'registration'"/>
    <Login v-if="getWhatToShow === 'login'"/>
    <UserProfile v-if="getWhatToShow === 'account'"/>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('user');
import Registration from '@/components/User/Registration';
import Login from '@/components/User/Login';
import UserProfile from '@/components/User/UserProfile';
export default {
  name: 'User',
  components: {
    Registration,
    Login,
    UserProfile
  },
  computed: {
    ...mapGetters(['getWhatToShow']),
  }
}
</script>

<style lang="scss" scoped>
.user {
  background: whitesmoke;
}
</style>