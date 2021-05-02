<template>
  <section class="homePage">
    <SearchGame 
      :data="parsedData" 
      v-on:searchResult="showSearchedGames($event)"
      v-on:showAll="showAll()"
    />
    <div class="homePage__searchResultEmpty" v-if="result">
      <p class="homePage__text">{{ message }}</p>
    </div>
    <div class="homePage__games">
      <GameBlock 
        class="homePage__game" 
        v-for="(game, i) in games" 
        :key="i"
        :block="game"
      />
    </div>
  </section>
</template>

<script>
// import firebase from 'firebase/app';
// import "firebase/firestore";
// import "firebase/storage";
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('games');
import GameBlock from '@/components/HomePage/GameBlock';
import SearchGame from '@/components/HomePage/SearchGame';
export default {
  name: 'HomePage',
  components: {
    GameBlock,
    SearchGame
  },
  data() {
    return {
      games: [],
      parsedData: [],
      result: false,
      message: ''
    }
  },
  created() {
    this.init();
  },
  computed: {
    ...mapGetters(['getData', 'getParsedData']),
  },
  methods: {
    // ...mapActions(['INIT']),
    async init() {
      // await this.INIT();
      this.games = this.getData;
      this.parsedData = this.getParsedData;
    },
    showSearchedGames(obj) {
      this.result = true;
      if (obj.founded) {
        this.result = false;
      }
      const len = obj.arrayOfIds.length;
      if (len === 0) {
        this.message = `There is no game at '${obj.field}'`;
      } else {
        this.message = `Found ${len} ${len === 1 ? 'game' : 'games'} at '${obj.field}'`;
      }
      this.games = obj.arrayOfIds.map(id => {
        return this.getData[id];
      })
    },
    showAll() {
      this.result = false;
      this.message = '';
      this.games = this.getData;
    },
  }
}
</script>

<style lang="scss" scoped>
.homePage {
  flex: 1;
  margin: 0 rem(20);
  &__text {
    font-size: rem(30);
    margin: rem(20) 0;
    text-align: left;
  }
  &__games {
    display: flex;
    flex-wrap: wrap;
    margin: rem(40) 0;
  }
  &__game {
    margin: rem(15);
  }
}
</style>