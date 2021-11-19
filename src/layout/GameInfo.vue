<template>
  <div class="info" v-if="isLoaded">
    <router-link class="info__return" tag="div" :to="game.path">
      <fontAwesome icon="long-arrow-alt-left" class="info__return--arrow"/>
      <p>Back to Game</p>
    </router-link>

    <section class="info__section">
      <h1 class="info__gameName">{{ getInfo.name }}</h1>
      <p class="info__gameCreated">created {{ getInfo.created }}</p>
      <div class="info__description">
        <h2 class="info__title">Description</h2>
        <p class="info__descriptionText">{{ getInfo.description }}</p>
      </div>
    </section>

    <Comments :game="game"/>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapGetters } = createNamespacedHelpers('gameInfo');
import Comments from '@/components/GameInfo/Comments'
export default {
  name: 'GameInfo',
  components: {
    Comments
  },
  props: {
    game: Object
  },
  data() {
    return {
      isLoaded: false,
    }
  },
  async created() {
    await this.init(); 
  },
  computed: {
    ...mapGetters(['getInfo']),
  },
  methods: {
    ...mapActions(['GET_DATA', 'CLEAR_STATE']),

    async init() {
      await this.GET_DATA(this.game.name);
      this.isLoaded = true;
    },
  },
  beforeUnmount() {
    this.CLEAR_STATE();
  }
}
</script>

<style lang="scss" scoped>
.info {   
  flex: 1;

  &__return {
    @include Flex(center);
    font-size: 20px;
    cursor: pointer;
    width: 145px;
    margin: 15px 0 0 15px;
    transition-duration: .5s;
    text-decoration: none;
    color: lightseagreen;
    &--arrow {
      transition-duration: .5s;
    }
  }

  &__return:hover {
    color: lighten($color: lightseagreen, $amount: 10);
  }

  &__return:hover &__return--arrow {
    transform: translateX(-5px);
  }

  &__section {
    width: 100%;
    max-width: 960px;
    margin: 20px auto;
    padding: 20px;
    border-radius: 10px;
    @include boxShadow(0.1);
  }

  &__gameName {
    font-size: 30px;
    color: darkslategrey;
  }

  &__gameCreated {
    color: darkgray;
    font-size: 18px;
    margin: 5px 0 30px 0;
  }

  &__title {
    font-size: 25px;
    color: darkslategrey;
  }

  &__descriptionText {
    font-size: 18px;
    line-height: 1.5;
    margin-top: 5px;
  }
}
</style>