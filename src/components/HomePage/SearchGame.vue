<template>
  <div class="searchBar">
    <h3 class="searchBar__title">Search game</h3>

    <div class="searchBar__container" :style="styleInput">
      <input 
        class="searchBar__input" 
        type="text" 
        v-model="field" 
        maxlength="45"
        placeholder="Name of the game..."
        @keyup.enter="searchGameBtn()"
        @focus="isFocused = true"
        @blur="isFocused = false"
      >

      <div class="searchBar__variants" v-if="displayVariants"> 
        <Variant 
          v-for="(obj, i) in getSearchResult" 
          :key="i"
          :variant="obj"
          @click="clickGame(obj.to)"
        />
      </div>

      <div class="searchBar__find" @click="searchGameBtn()" :style="styleFindBtn">Find</div>
    </div>

    <div class="searchBar__showAll" @click="showAll()">Show All</div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapActions } = createNamespacedHelpers('games');
import Variant from '@/components/HomePage/Variant';
export default {
  name: 'SearchGame',
  components: {
    Variant
  },
  data() {
    return {
      field: '',
      isFocused: false,
      variantClicked: false,
      displayVariants: false,
      activeVariant: null
    } 
  },
  watch: {
    field: function() {
      this.searchGame();
    },
    isFocused: function(newVal) {
      if (this.variantClicked) {
        this.variantClicked = false;
      }

      setTimeout(() => {
        this.displayVariants = this.getSearchResult.length !== 0 && (newVal || this.variantClicked)
      }, 100)

    }
  },
  computed: {
    ...mapGetters(['getSearchResult']),

    styleInput() {
      return this.displayVariants 
        ? { borderRadius: `10px 10px 0 0` } 
        : { borderRadius: `10px` }
    },

    styleFindBtn() {
      return this.displayVariants 
        ? { borderRadius: `0 10px 0 0` } 
        : { borderRadius: `0 10px 10px 0` }
    },
  },
  methods: {
    ...mapActions(['SEARCH_GAME', 'CLEAR_SEARCH']),

    async searchGame() {
      this.field !== '' && await this.SEARCH_GAME(this.field.toLowerCase());
      this.field === '' && this.CLEAR_SEARCH();
      this.displayVariants = this.getSearchResult.length !== 0 && (this.isFocused || this.variantClicked);
    },

    clickGame(path) {
      this.variantClicked = true;
      this.$router.push(path);
      this.CLEAR_SEARCH();
    },

    searchGameBtn() {
      this.$emit('isSearch', {isSearch: true, field: this.field});
      this.field = '';
    },

    showAll() { 
      this.field = '';
      this.$emit('isSearch', {isSearch: false});
      this.CLEAR_SEARCH();
    },
  },
  beforeUnmount() {
    this.CLEAR_SEARCH();
  }
}
</script>

<style lang="scss" scoped>
.searchBar {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 75px;
  background: #24272E;
  border-radius: 0 0 rem(10) rem(10);

  &__title {
    color: $white;
    font-size: rem(30);
  }

  &__container {
    position: relative;
    @include Flex(center);
    width: rem(600);
    height: rem(40);
    background: $white;
    border-radius: rem(10);
    transition-duration: .5s;
  }

  &__input {
    flex: 1;
    height: 100%;   
    outline: none;
    border: none; 
    background: transparent;
    text-indent: rem(20);
    font-size: rem(20);
  }

  &__variants {
    position: absolute;
    top: 100%;
    content: "";
    background: $white;
    width: 100%;
    z-index: 10;
  }

  &__find {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100px;
    height: 100%;
    background: orange;
    color: $white;
    font-size: 20px;
    cursor: pointer;
    transition-duration: .5s;
  }

  &__find:hover {
    background: orangered;
  }

  &__showAll {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100px;
    height: 40px;
    border-radius: rem(10);
    background: $white;
    font-size: rem(16);
    cursor: pointer;
    transition-duration: .5s;
  }

  &__showAll:hover {
    background: orangered;
    color: $white;
  }
}
// adaptiveness
@media only screen and (max-width: 1023px) {
  .searchBar {
    &__title {
      font-size: 27px;
    }

    &__input {
      padding-right: 10px;
    }

    &__container {
      width: 500px;
      height: 35px;
    }

    &__showAll, &__variant {
      height: 35px;
    }
  }
}

@media only screen and (max-width: 859px) {
  .searchBar {
    &__title {
      font-size: 25px;
    }

    &__container {
      width: 400px;
    }

    &__find {
      width: 90px;
    }

    &__input {
      font-size: 18px;
    }

    &__variant {
      font-size: 18px;
    }
  }
}

@media only screen and (max-width: 767px) {
  .searchBar {
    &__title {
      font-size: 23px;
    }

    &__container {
      width: 300px;
    }

    &__find {
      width: 80px;
      font-size: 18px;
    }

    &__input {
      font-size: 16px;
    }

    &__variant {
      font-size: 16px;
    }
  }
}

@media only screen and (max-width: 599px) {
  .searchBar {
    &__title {
      display: none;
    }

    &__showAll {
      width: 85px;
    }
  }
}

@media only screen and (max-width: 469px) {
  .searchBar {
    height: 60px;

    &__find {
      width: 60px;
      font-size: 16px;
    }

    &__input {
      font-size: 14px;
    }

    &__variant {
      font-size: 14px;
      height: 30px;
    }

    &__container {
      width: 250px;
      height: 30px;
    }

    &__showAll {
      font-size: 14px;
      width: 75px;
      height: 30px;
    }
  }
}

@media only screen and (max-width: 389px) {
  .searchBar {
    &__container {
      width: 200px;
    }

    &__find {
      width: 50px;
      font-size: 14px;
    }

    &__input {
      font-size: 12px;
    }

    &__variant {
      font-size: 12px;
      height: 25px;
    }

    &__showAll {
      font-size: 12px;
      width: 65px;
    }
  }
}

</style>