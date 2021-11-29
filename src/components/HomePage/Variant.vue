<template>
  <div class="variant">
    <div class="variant__imgContainer">
      <img class="variant__img" :src="variant.imgURL" :alt="variant.name">
    </div>
    <p class="variant__name">{{ variant.name }}</p>
  </div>
</template>

<script>
export default {
  name: 'Variant',
  props: {
    variant: Object
  }
}
</script>

<style lang="scss" scoped>
.variant {
  display: flex;
  align-items: center;
  padding-left: 20px;
  height: 60px;
  cursor: pointer;
  background: lightgray;
  transition-duration: .5s;

  &__imgContainer {
    width: 80px;
    height: 40px;
    background: darkgray;
    border-radius: 5px;
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 5px;
  }

  &__name {
    font-size: rem(20);
    margin-left: 20px;
  }
}

.variant:hover {
  background: #fec180;
}

$opacity: 0.3;
$offset: 2px;

.variant:not(:last-child) {
  border-bottom: 1px solid $black;
  box-shadow: 
    $offset 0 1px rgba(0, 0, 0, $opacity), 
    -$offset 0 1px rgba(0, 0, 0, $opacity);
}

.variant:last-child {
  box-shadow: 
    $offset 0 1px rgba(0, 0, 0, $opacity),
    -$offset 0 1px rgba(0, 0, 0, $opacity), 
    0 $offset  1px rgba(0, 0, 0, $opacity);
}

// adaptivness
@media only screen and (max-width: 800px) {
  .variant {
    height: 50px;

    &__imgContainer {
      height: 35px;
      width: 70px;
    }

    &__name {
      font-size: 18px;
      margin-left: 15px;
    }
  }
}

@media only screen and (max-width: 600px) {
  .variant {
    height: 45px;

    &__imgContainer {
      display: none;
    }

    &__name {
      font-size: 18px;
      margin: 0;
    }
  }
}

@media only screen and (max-width: 500px) {
  .variant {
    height: 40px;

    &__name {
      font-size: 17px;
    }
  }
}

@media only screen and (max-width: 400px) {
  .variant {
    height: 35px;

    &__name {
      font-size: 16px;
    }
  }
}

</style>