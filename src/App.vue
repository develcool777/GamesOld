<template>
  <router-view></router-view>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('games');
export default {
  name: 'App',
  created() {
    this.reload();
    this.INIT();
  },
  methods: {
    ...mapActions(['INIT']),
  }
}
</script>
