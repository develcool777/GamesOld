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
import DATA from '@/data/games.json';
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
  methods: {
    init() {
      this.games = DATA.games;
      this.parsedData = this.games.map(game => {
        const obj = {};
        obj.id = game.id;
        obj.name = game.name;
        return obj;
      });
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
        return DATA.games[id];
      })
    },
    showAll() {
      this.result = false;
      this.message = '';
      this.games = DATA.games;
    }
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
    margin: rem(20);
  }
}
</style>