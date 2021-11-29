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
  border-radius: 10px;

  &__block {
    @include FlexColumn(space-between, center);
    @include boxShadow(0.3);
    width: 300px;
    height: 360px;
    padding: 10px;
    border-radius: 10px;
    border: 1px solid $black;
  }

  &__img {
    width: 280px;
    height: 135px;
    background: gray;
  }

  &__title {
    width: 100%;
    height: 30px;
    background: gray;
    border-radius: 10px;
  }

  &__text {
    width: 100%;
    height: 100px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }

  &__line {
    width: 100%;
    height: 18px;
    background: gray;
    border-radius: 10px;
  }

  &__line:last-child {
    width: 80%;
  }

  &__flex {
    width: 100%;
    @include Flex(space-between);
  }

  &__created, &__played {
    width: 40%;
    height: 16px;
    background: gray;
    border-radius: 10px;
  }
}

@keyframes skeleton-loading {
  0% {
    background-color: hsl(200, 20%, 70%);
  }
  100% {
    background-color: hsl(200, 20%, 95%);
  }
}

// adaptivness
@media only screen and (max-width: 1050px) {
  .skeleton {
    &__block {
      width: 280px;
      height: 340px;
    }

    &__img {
      width: 260px;
      height: 130px;
    }

    &__title {
      height: 28px;
    }

    &__text {
      height: 80px;
    }

    &__line {
      height: 16px;
    }

    &__created, &__played {
      height: 14px;
    }
  }
}

@media only screen and (max-width: 800px) {
  .skeleton {
    &__block {
      width: 270px;
      height: 320px;
    }

    &__img {
      width: 250px;
      height: 120px;
    }

    &__title {
      height: 25px;
    }

    &__text {
      height: 75px;
    }

    &__line {
      height: 15px;
    }

    &__created, &__played {
      height: 13px;
    }
  }
}

@media only screen and (max-width: 669px) {
  .skeleton {
    &__block {
      width: 260px;
      height: 300px;
    }

    &__img {
      width: 240px;
      height: 115px;
    }

    &__title {
      height: 23px;
    }

    &__text {
      height: 65px;
    }

    &__line {
      height: 14px;
    }

    &__created, &__played {
      height: 12px;
    }
  }
}

@media only screen and (max-width: 399px) {
  .skeleton {
    &__block {
      width: 250px;
      height: 270px;
    }

    &__img {
      width: 230px;
      height: 110px;
    }

    &__title {
      height: 20px;
    }

    &__text {
      height: 50px;
    }

    &__line {
      height: 12px;
    }

    &__created, &__played {
      height: 10px;
    }
  }
}
</style>