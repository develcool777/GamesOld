<template>
  <section class="info" v-if="isLoaded">
    <div class="info__imgContainer">
      <div v-if="!imgLoaded" class="info__imgLoading">
        <div class="info__spinner"></div>
      </div>
      <img 
        ref="img"
        class="info__img" 
        :src="getInfo.imgURL" 
        :alt="getInfo.name" 
        draggable="false" 
        @load="loadImg()"
      >
    </div>
    <h1 class="info__name">{{ getInfo.name }}</h1>
    <p class="info__meta">
      <b>Created:</b> 
      &#160;
      <span class="info__meta--span">{{ timeStamp(getInfo.created) }}</span>
    </p>
    <p class="info__meta">
      <b>Played:</b>
      &#160;
      <span class="info__meta--span">{{ getInfo.played }}</span>
    </p>
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
  data() {
    return {
      imgLoaded: false
    }
  },
  computed: {
    ...mapGetters(['getInfo']),
  },
  methods: {
    ...mapActions(['GET_INFO', 'CLEAR_STATE']),

    async init() {
      await this.GET_INFO(this.gameName);
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
    },

    loadImg() {
      this.imgLoaded = this.$refs.img.complete;
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

  &__imgContainer {
    position: relative;
    width: 300px;
    height: 150px;
    float: left;
    margin-right: 20px;
    @include boxShadow(0.1);
    border-radius: 5px;
  }

  &__imgLoading {
    @include Flex(center);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 5;
    background: gray;
  }

  &__spinner {
    width: 40px;
    height: 40px;
    border: 5px solid lightgray;
    border-top-color: mediumturquoise;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: unset;
    border: none;
    border-radius: 5px;
  }

  &__name {
    font-size: 30px;
    color: darkslategrey;
  }

  &__meta {
    color: darkgray;
    font-size: 18px;
    margin: 5px 0;
    &--span {
      color: cadetblue;
    }
  }

  &__description {
    clear: both;
    padding-top: 10px;
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

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>