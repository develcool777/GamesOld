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

    <div class="homePage__games" v-if="isSkeleton">
      <GameBlockSkeleton 
        class="homePage__game"
        v-for="num in 5"
        :key="num"
      />
    </div>

    <div class="homePage__games" v-else>
      <GameBlock 
        class="homePage__game" 
        v-for="(game, i) in games" 
        :key="i"
        :block="game"
        :hovered="hoveredBlock === i"
        @click="updatePlayed(game.docID)"
        @mouseover="hoveredBlock = i"
        @mouseleave="hoveredBlock = null"
      />
    </div>

  </section>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapActions } = createNamespacedHelpers('games');
import GameBlock from '@/components/HomePage/GameBlock';
import GameBlockSkeleton from '@/components/HomePage/GameBlockSkeleton';
import SearchGame from '@/components/HomePage/SearchGame';
export default {
  name: 'HomePage',
  components: {
    GameBlock,
    SearchGame,
    GameBlockSkeleton
  },
  data() {
    return {
      games: [],
      parsedData: [],
      result: false,
      message: '',
      hoveredBlock: null,
      isSkeleton: true
    }
  },
  created() {
    this.init();
  },
  computed: {
    ...mapGetters(['getData', 'getParsedData', 'getIsDataLoaded']),
  },
  methods: {
    ...mapActions(['INIT', 'UPDATE_PLAYED']),
    async init() {
      if (this.getIsDataLoaded === false) {
        await this.INIT();
      }
      this.games = this.getData;
      this.isSkeleton = false;
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
      this.games = this.getData.filter(game => obj.arrayOfIds.includes(game.id));
    },
    showAll() {
      this.result = false;
      this.message = '';
      this.games = this.getData;
    },
    async updatePlayed(docId) {
      await this.UPDATE_PLAYED(docId);
      await this.INIT();
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
    justify-content: center;
    margin: rem(40) 0;
  }

  &__game {
    margin: rem(15);
  }
}
</style>