<template>
  <div class="skeleton">
    <div class="skeleton__block">
      <div class="skeleton__img"></div>
      <div class="skeleton__title"></div>
      <div class="skeleton__text">
        <div class="skeleton__line"></div>
        <div class="skeleton__line"></div>
        <div class="skeleton__line"></div>
      </div>
      <div class="skeleton__flex">
        <div class="skeleton__created"></div>
        <div class="skeleton__played"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GameBlockSkeleton'
}
</script>

<style lang="scss" scopped>
.skeleton {
  opacity: .7;
  animation: skeleton-loading 1s linear infinite alternate;

  &__block {
    @include FlexColumn(space-between, center);
    @include boxShadow(0.3);
    width: rem(300);
    height: rem(360);
    padding: rem(10);
    border-radius: rem(10);
    border: 1px solid $black;
  }

  &__img {
    width: rem(280);
    height: rem(135);
    background: gray;
  }

  &__title {
    width: 100%;
    height: 30px;
    margin: rem(20) 0;
    background: gray;
    border-radius: 10px;
  }

  &__text {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  &__line {
    width: 100%;
    height: 10px;
    margin: 5px 0;
    background: gray;
    border-radius: 10px;
  }

  &__line:last-child {
    margin-bottom: 0;
    width: 80%;
  }

  &__flex {
    margin-top: rem(50);
    width: 100%;
    @include Flex(space-between);
  }

  &__created, &__played {
    width: 40%;
    height: 10px;
    background: gray;
    border-radius: 10px;
  }
}

.skeleton-text {
  width: 100%;
  height: .5rem;
  margin-bottom: .25rem;
  border-radius: .125rem;
}

.skeleton-text:last-child {
  margin-bottom: 0;
  width: 80%;
}

@keyframes skeleton-loading {
  0% {
    background-color: hsl(200, 20%, 70%);
  }
  100% {
    background-color: hsl(200, 20%, 95%);
  }
}
</style>