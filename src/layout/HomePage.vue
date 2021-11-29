<template>
  <section class="homePage">
    <SearchGame 
      v-on:isSearch="isSearch($event)"
    />

    <div class="homePage__text" v-if="result">{{ message }}</div>

    <div class="homePage__games" v-if="isSkeleton">
      <GameBlockSkeleton 
        class="homePage__game"
        v-for="num in 5"
        :key="num"
      />
    </div>

    <div class="homePage__games" >
      <GameBlock 
        class="homePage__game" 
        v-for="(game, i) in games" 
        :key="i"
        :block="game"
        :hovered="hoveredBlock === i"
        v-on:imgLoaded="isImgsLoaded($event)"
        @click="updatePlayed(game.docID, game.played)"
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
      result: false,
      message: '',
      hoveredBlock: null,
      isSkeleton: true,
      arrayIsLoaded: []
    }
  },
  created() {
    this.init();
  },
  computed: {
    ...mapGetters(['getData', 'getSearchResult']),
  },
  methods: {
    ...mapActions(['INIT', 'UPDATE_PLAYED']),

    async init() {
      await this.INIT();
      this.games = this.getData;
    },

    isSearch(obj) {
      const len = this.getSearchResult.length;
      this.result = obj.isSearch;
      this.games = obj.isSearch ? this.getSearchResult : this.getData;
      this.message = !obj.isSearch
        ? ''
        : len === 0
          ? `There is no game at '${obj.field}'`
          : `Found ${len} ${len === 1 ? 'game' : 'games'} at '${obj.field}'`;
    },

    async updatePlayed(docID, played) {
      await this.UPDATE_PLAYED({docID, played});
      await this.INIT();
    },

    isImgsLoaded(isLoaded) {
      this.arrayIsLoaded.push(isLoaded);
      if (this.arrayIsLoaded.length === this.games.length) {
        this.isSkeleton = !this.arrayIsLoaded.every(bool => bool === true);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.homePage {
  flex: 1;
  margin: 0 20px;

  &__text {
    font-size: 30px;
    margin-top: 20px;
    text-align: left;
  }

  &__games {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin: 40px 0;
  }

  &__game {
    margin: 15px;
  }
}
// adaptivness
@media only screen and (max-width: 767px) {
  .homePage {
    margin: 0 10px;

    &__text {
      font-size: 25px;
    }
  }
}

@media only screen and (max-width: 469px) {
  .homePage {
    &__text {
      font-size: 20px;
      text-align: center;
    }
  }
}
</style>