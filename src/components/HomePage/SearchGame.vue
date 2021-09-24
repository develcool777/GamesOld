<template>
  <div class="searchBar">
    <p class="searchBar__title">Search game</p>
    <div class="searchBar__merge">
      <div class="searchBar__container" :style="styleInput">
        <input 
          class="searchBar__input" 
          type="text" 
          v-model="field" 
          maxlength="45"
          placeholder="Name of the game..."
          v-on:keyup.enter="searchGame()"
        >

        <div class="searchBar__variants" v-if="displayVariants">
          <div 
            class="searchBar__variant" 
            v-for="(variant, i) in variants" 
            :key="i"
            @click="foundGameInVariants(variant)"
          >{{ variant.name }}</div>
        </div>

        <div class="searchBar__find" @click="searchGame()" :style="styleFindBtn">Find</div>
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
    },

    styleFindBtn() {
      return this.displayVariants ? {borderRadius: `0 10px 0 0`} : {borderRadius: `0 10px 10px 0`}
    }
  },
  methods: {
    searchGame() {
      if (this.lockSearch) { return }
      this.samePart(this.showVariants(this.field), this.field);
    },

    foundGameInVariants(variant) {
      if (this.lockSearch) { return }
      this.lockSearch = true;
      this.samePart([variant.id], this.field, true);
    },

    samePart(array, field, found=false) {
      const obj = {}
      obj.arrayOfIds = array;
      obj.field = field;
      obj.founded = found;
      this.$emit('searchResult', obj);
      this.hideVariants();
    },

    showVariants(field) {
      if (field === '') { 
        this.displayVariants = false;
        return;
      }
      const fieldLow = field.toLowerCase();
      this.variants = this.data.reduce((acc, item) => {
        const name = item.name.toLowerCase();
        if (name.substring(0, fieldLow.length) === fieldLow) {
          acc.push(item);
        }
        return acc;
      }, []);

      this.displayVariants = this.variants.length > 0;  
      this.lockSearch = false;
      return this.variants.map(i => i.id);
    },

    showAll() { 
      this.hideVariants();
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
  }

  &__variant {
    display: flex;
    align-items: center;
    font-size: rem(20);
    padding-left: rem(20);
    height: 40px;
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

  &__find {
    position: absolute;
    top: 0;
    right: 0;
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
      width: calc(100% - 110px);
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
      width: calc(100% - 100px);
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
      width: calc(100% - 90px);
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
      width: calc(100% - 70px);
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
      width: calc(100% - 60px);
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