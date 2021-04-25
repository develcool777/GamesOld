<template>
  <div class="searchBar">
    <p class="searchBar__title">Search game</p>
    <div class="searchBar__container" :style="styleInput">
      <input 
        class="searchBar__input" 
        type="text" 
        v-model="field" 
        placeholder="Name of the game..."
      >
      <div class="searchBar__variants" v-if="displayVariants">
        <div 
          class="searchBar__variant" 
          v-for="(variant, i) in variants" 
          :key="i"
          @click="findGame(variant)"
        >{{ variant.name }}</div>
      </div>
    </div>
    <div class="searchBar__containerImg" @click="findGame()">
      <img 
        class="searchBar__img" 
        src="@/assets/searchGame/search.png" 
        alt="search"
      >
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchGame',
  props: {
    data: Array
  },
  data() {
    return {
      field: '',
      variants: [],
      displayVariants: false,
      placeHolder: ''
    } 
  },
  watch: {
    field: function(newVal) {
      this.showVariants(newVal);
    }
  },
  computed: {
    styleInput() {
      return this.displayVariants ? {borderRadius: `10px 10px 0 0`} : {borderRadius: `10px`}
    }
  },
  methods: {
    findGame(game) {
      if (game !== undefined) {
        this.$emit('searchResult', [game.id]);
      } else {
        const result = this.showVariants(this.field);
        this.$emit('searchResult', result);
      }
      this.hideVariants();
    },
    showVariants(field) {
      if (field === '') { 
        this.displayVariants = false;
        return;
      }
      const fieldLow = field.toLowerCase();
      const result = [];
      this.data.forEach(item => {
        const name = item.name.toLowerCase();
        if (name.substring(0, fieldLow.length) === fieldLow) {
          result.push(item);
        }
      })
      if (result.length > 0) {
        this.variants = result;
        this.displayVariants = true;  
      }
      return result.map(item => item.id);
    },
    hideVariants() {
      this.field = '';
      this.variants = [];
      this.displayVariants = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.searchBar {
  @include Flex(space-around);
  // flex: 1;
  max-width: rem(1000);
  width: 100%;
  margin: 0 auto;
  padding: rem(20) rem(30); 
  background: #24272E;
  border-radius: 0 0 rem(10) rem(10);
  &__title {
    color: $white;
    font-size: rem(30);
  }
  &__container {
    position: relative;
    width: rem(600);
    height: rem(40);
    background: $white;
    border-radius: rem(10);
  }
  &__input {
    width: 100%;
    height: 100%;   
    outline: none;
    border: none; 
    background: transparent;
    text-indent: rem(20);
    font-size: rem(20);
  }
  &__variants {
    position: absolute;
    content: "";
    background: $white;
    width: 100%;
    z-index: 20;
    padding-top: rem(10);
    border-radius: 0 0 rem(10) rem(10);
  }
  &__variant {
    font-size: rem(20);
    padding: rem(10) 0 rem(10) rem(20);
    border-bottom: 1px solid $black;
    cursor: pointer;
  }
  &__variant:first-child {
    border-top: 1px solid $black;
  }
  &__variant:hover {
    background: lightgoldenrodyellow;
  }
  &__containerImg {
    width: rem(30);
    height: rem(30);
    cursor: pointer;
  }
  &__img {
    width: 100%;
    height: 100%;
    transition-duration: .5s;
  }
  &__img:hover {
    transform: rotate(360deg);
  }
}
</style>