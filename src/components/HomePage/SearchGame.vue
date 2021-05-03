<template>
  <div class="searchBar">
    <p class="searchBar__title">Search game</p>
    <div class="searchBar__merge">
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
    <div class="searchBar__showAll" @click="showAll()">Show All</div>
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
      placeHolder: '',
      lockSearch: false
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
      if (this.lockSearch) { return }
      const obj = {};
      if (game !== undefined) {
        this.lockSearch = true;
        obj.arrayOfIds =  [game.id],
        obj.field = this.field
        obj.founded = true
      } else {
        obj.arrayOfIds = this.showVariants(this.field),
        obj.field = this.field
      }
      this.$emit('searchResult', obj);
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
      this.lockSearch = false;
      return result.map(item => item.id);
    },
    showAll() { 
      this.$emit('showAll');
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
  flex: 1;
  padding: rem(20) rem(30); 
  background: #24272E;
  border-radius: 0 0 rem(10) rem(10);
  &__title {
    color: $white;
    font-size: rem(30);
  }
  &__merge {
    display: flex;
    align-items: center;
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
    background: lightgray;
  }
  &__variant:first-child {
    border-top: 1px solid $black;
  }
  &__variant:hover {
    background: $color-primary-1;
  }
  &__containerImg {
    width: rem(30);
    height: rem(30);
    cursor: pointer;
    margin-left: rem(30);
  }
  &__img {
    width: 100%;
    height: 100%;
    transition-duration: .5s;
  }
  &__img:hover {
    transform: scale(1.1);
  }
  &__showAll {
    padding: rem(10) rem(20);
    border-radius: rem(10);
    background: $white;
    font-size: rem(16);
    cursor: pointer;
    transition-duration: .5s;
  }
  &__showAll:hover {
    background: $color-primary-1;
  }
}
</style>