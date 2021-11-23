<template>
  <section class="info" v-if="isLoaded">
    <h1 class="info__name">{{ getInfo.name }}</h1>
    <p class="info__created">created {{ timeStamp(getInfo.created) }}</p>
    <div class="info__description">
      <h2 class="info__title">Description</h2>
      <p class="info__descriptionText">{{ getInfo.description }}</p>
    </div>
  </section>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapGetters } = createNamespacedHelpers('gameInfo');
export default {
  name: 'Info',
  props: {
    gameName: String,
    isLoaded: Boolean
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
      await this.GET_DATA(this.gameName);
      this.$emit('loaded');
    },

    timeStamp(milliseconds) {
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const d = new Date(milliseconds);
      const month = months[d.getMonth()];
      let day = d.getDate();
      day = day < 10 ? `0${day}` : day;
      const year = d.getFullYear();
      return `${day}-${month}-${year}`
    }
  },
  beforeUnmount() {
    this.CLEAR_STATE();
  }
}
</script>

<style lang="scss" scoped>
.info {
  width: 100%;
  max-width: 960px;
  margin: 20px auto;
  padding: 20px;
  border-radius: 10px;
  @include boxShadow(0.1);

  &__name {
    font-size: 30px;
    color: darkslategrey;
  }

  &__created {
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