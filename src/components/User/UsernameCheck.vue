<template>
  <div class="username">
    <div class="username__title">Username requirements</div>
    <div class="username__variants">
      <div 
        class="username__variant" 
        v-for="(v, i) in userHints" 
        :key="i"
      >{{ v.text }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UsernameCheck',
  props: {
    field: String
  },
  data() {
    return {
      userHints: [
        {text: '- Starts and ends with letter or number'},
        {text: '- Minimum length is 5 characters, maximum is 20'},
        {text: '- Can contain hyphen and underscore but not consecutively'},
      ]
    }
  },
}
</script>


<style lang="scss" scoped>
.username {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 280px;
  border: 1px solid lightslategray;
  border-top-color: transparent;
  padding: 10px;
  background: whitesmoke;
  z-index: 2;

  &__title {
    margin: 5px 0;
    font-size: 16px;
  }

  &__variants {
    width: inherit;
  }

  &__variant {
    @include Flex(flex-start);
    font-size: 12px;
    width: inherit;
    margin: 5px 0;
  }

  &__text {
    margin-left: 5px;
  }
}
</style>