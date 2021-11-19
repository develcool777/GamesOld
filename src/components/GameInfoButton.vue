<template>
  <router-link tag="div" class="cBtn" :to="path">Game Info</router-link>
</template>

<script>
export default {
  name: 'GameInfoButton',
  props: {
    path: Object
  }
}
</script>

<style lang="scss" scoped>
.cBtn {
  position: absolute;
  bottom: 0;
  right: 0;
  font-size: 25px;
  text-decoration: none;
  padding: 10px 30px;
  background: lightcoral;
  color: white;
  transition-duration: .5s;
}

.cBtn:hover {
  background: darken($color: lightcoral, $amount: 10);
}
</style>