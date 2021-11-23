<template>
  <section class="rating" v-if="isLoaded">
    <div class="rating__heading">
      <h2 class="rating__title">Rating</h2>
      <fontAwesome icon="star-half-alt" class="rating__icon"/>
    </div>

    <h3 class="rating__total">{{ getRating }}</h3>

    <div class="rating__game">
      <fontAwesome 
        icon="star" 
        class="rating__star"
        v-for="n in 5"
        :key="n"
        :style="styleRating(n)"
      />
    </div>

    <p class="rating__based">Based on {{ getAmountOfVotes }} players rating</p>

    <div class="rating__details">
      <Detail 
        v-for="(d, i) in getDetails"
        :key="i"
        :detail="d"
        :active="getCurrentUserRating?.stars === d.stars"
      />
    </div>    

    <div class="rating__btnFlex">
      <button 
        v-if="getUser !== null && getCurrentUserRating === null" 
        class="rating__btn" 
        type="button" 
        @click="showRatePopUp = true"
      >Rate this game</button>
      <p v-else-if="getCurrentUserRating === null">Please sign in to rate</p>
    </div>

    <transition name="fade">
      <RateGame v-if="showRatePopUp" v-on:close="showRatePopUp = false" v-on:post="postRating($event)"/>
    </transition>
  </section>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapGetters } = createNamespacedHelpers('rating');
import Detail from '@/components/GameInfo/Detail'
import RateGame from '@/components/GameInfo/RateGame'
export default {
  name: 'Rating',
  components: {
    Detail,
    RateGame
  },
  props: {
    gameName: String,
    isLoaded: Boolean
  },
  async created() {
    await this.init();
  },
  data() {
    return {
      showRatePopUp: false,
      unsubscribe: () => {},
    }
  },
  watch: {
    getUser: function(newValue) {
      if (newValue === null) { 
        this.showRatePopUp = false;
        this.SET_CURRENT_USER_RATING(null);
      } else {
        this.USER_RAITING(newValue.uid);
      }
    },
  },
  computed: {
    ...mapGetters(['getDetails', 'getRating', 'getCurrentUserRating', 'getData']),

    getUser() {
      return this.$store.getters['user/getUser'];
    },

    getAmountOfVotes() {
      return this.getData.length;
    }
  },
  methods: {
    ...mapActions([
      'POST', 'CLEAR_STATE', 'GET_DATA', 
      'LISTENER', 'SET_CURRENT_USER_RATING',
      'USER_RAITING'
    ]),

    async init() {
      await this.GET_DATA(this.gameName);
      this.unsubscribe = await this.LISTENER(this.gameName);
      this.USER_RAITING(this.getUser?.uid);
      this.$emit('loaded');
    },

    styleRating(stars) {
      return stars <= this.getRating || this.getRating >= 4.5
        ? { color: 'gold' }
        : { color: 'dimgray' }
    },

    async postRating(stars) {
      await this.POST({uid: this.getUser.uid, gameName: this.gameName, stars});
      this.USER_RAITING(this.getUser.uid);
      this.showRatePopUp = false;
    }
  },
  beforeUnmount() {
    this.CLEAR_STATE();
    this.unsubscribe();
  }
}
</script>

<style lang="scss" scoped>
.rating {
  position: relative;
  width: 100%;
  max-width: 960px;
  margin: 20px auto;
  padding: 20px;
  border-radius: 10px;
  @include boxShadow(0.1);

  &__heading {
    @include Flex(flex-start);
    width: 250px;
    color: darkslategrey;
    font-size: 25px;
  }

  &__title {
    font-size: 25px;
    color: darkslategrey;
  }

  &__icon {
    margin: 0 10px;
    color: gold;
  }

  &__total {
    font-size: 40px;
    text-align: center;
  }

  &__game {
    @include Flex(space-between);
    padding: 10px 15px;
    border-radius: 10px;
    background: #f2f2f2;
    width: 220px;
    margin: 0 auto;
  }

  &__star {
    font-size: 25px;
  }

  &__based {
    color: darkgrey;
    font-size: 16px;
    text-align: center;
  }

  &__details {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    height: 150px;
    margin-top: 30px;
  }

  &__btnFlex {
    @include Flex(center);
    margin-top: 30px;
    height: 43px;
    font-size: 20px;
  }

  &__btn {
    border: none;
    padding: 10px 20px;
    border-radius: 10px;
    color: white;
    background: darkslategrey;
    cursor: pointer;
    transition-duration: .5s;
  }

  &__btn:hover {
    background: lighten($color: darkslategrey, $amount: 10);
  }
}
</style>