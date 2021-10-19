<template>
  <div class="user">
    <Registration v-if="getWhatToShow === 'registration'"/>
    <Login v-if="getWhatToShow === 'login'"/>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapActions } = createNamespacedHelpers('user');
import Registration from '@/components/User/Registration';
import Login from '@/components/User/Login';
export default {
  name: 'User',
  components: {
    Registration,
    Login
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