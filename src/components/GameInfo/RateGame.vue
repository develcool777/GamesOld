<template>
  <div class="rate">
    <h2 class="rate__title">Rate this game</h2>

    <div class="rate__flex">
      <div class="rate__option" v-for="(b, i) in bar" :key="i" @click="clickedOption = i" :style="styleClickedOption(i)">
        <div class="rate__name">{{ b.name }}</div>
        <fontAwesome 
          :icon="b.icon"
          :style="{color: b.color}"
          class="rate__smile"
        />
        <div class="rate__stars">
          <fontAwesome 
            class="rate__star" 
            icon="star" 
            v-for="n in 5" 
            :key="n"
            :style="decideColor(b.stars, n)"
          />
        </div>
      </div>
    </div>

    <div class="rate__btnWrap">
      <button  
        v-if="clickedOption !== null"
        class="rate__btn" 
        type="button" 
        @click="submitRating()"
      >Submit your rating</button>
    </div>

    <fontAwesome icon="times" class="rate__close" @click="close()" title="Close"/>
  </div>
</template>

<script>
export default {
  name: 'RateGame',
  data() {
    return {
      clickedOption: null,
      bar: [
        { name: 'Worst', icon: 'angry', color: 'red', stars: 1 },
        { name: 'Poor', icon: 'frown', color: 'orange', stars: 2 },
        { name: 'Average', icon: 'meh', color: `rgb(${218}, ${204}, ${18})`, stars: 3 },
        { name: 'Good', icon: 'smile', color: 'green', stars: 4 },
        { name: 'Excellent', icon: 'grin-hearts', color: 'lightgreen', stars: 5 },
      ]
    }
  },
  methods: {
    decideColor(stars, currentStar) {
      return currentStar <= stars
        ? { color: 'gold' }
        : { color: 'lightslategray' }
    },

    close() {
      this.$emit('close');
    },

    submitRating() {
      const stars = this.bar[this.clickedOption].stars;
      this.$emit('post', stars);
    },

    styleClickedOption(i) {
      return i === this.clickedOption 
        ? { background: `rgb(${3}, ${172}, ${175})`, transform: `translateY(${-10}px)` }
        : {}
    }
  },
}
</script>

<style lang="scss" scoped>
.rate {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  background: white;
  border-radius: 10px;
  padding: 10px;

  &__title {
    font-size: 30px;
    color: darkslategrey;
    text-align: center;
  }

  &__flex {
    @include Flex(space-around);
  }

  &__option {
    padding: 10px;
    height: 200px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    @include boxShadow(0.1);
    border-radius: 5px;
    transition-duration: .5s;
    cursor: pointer;
  }

  &__option:hover  {
    transform: translateY(-10px);
    background: rgb(3, 172, 175);
  }

  &__name {
    font-size: 20px;
  }

  &__smile {
    font-size: 100px;
  }

  &__star {
    font-size: 20px;
  }

  &__btnWrap {
    @include Flex(center);
    height: 43px;
  }

  &__btn {
    border: none;
    padding: 10px 20px;
    border-radius: 10px;
    color: white;
    background: darkslategrey;
    font-size: 20px;
    transition-duration: .5s;
    cursor: pointer;
  }

  &__btn:hover {
    background: lighten($color: darkslategrey, $amount: 10);
  }

  &__close {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 20px;
    color: darkslategrey;
    cursor: pointer;
    transition-duration: .5s;
  }

  &__close:hover {
    color: lightsalmon;
  }
}
</style>