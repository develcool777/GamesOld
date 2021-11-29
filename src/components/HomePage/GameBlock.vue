<template>
  <router-link class="gBlock" tag="div" :to="block.to">
    <div class="gBlock__block">
      <div class="gBlock__container">

        <video 
          v-show="hovered && isVideoAvailable"
          class="gBlock__video"
          ref="video" 
          :src="block.videoURL"
          muted="muted"  
          loop
        />

        <img
          ref="img"
          v-show="!hovered && imgLoaded || hovered && !isVideoAvailable" 
          class="gBlock__poster" 
          :src="block.imgURL" 
          :alt="block.name"
          @load="loadedImg()"
        >

        <transition name="noVideo">
          <div class="gBlock__noVideo" v-if="hovered && !isVideoAvailable">There is no video preview</div>
        </transition>

      </div>
      <div class="gBlock__title">{{ block.name }}</div>
      <div class="gBlock__rating" :title="`${block.rating} out of 5`">
        <fontAwesome 
          v-for="(n, i) in 5"
          :key="i"
          class="gBlock__star"
          icon="star" 
          :style="styleStar(n)"
        />
      </div>
      <div class="gBlock__text">{{ block.shortDescription }}</div>
      <div class="gBlock__flex">
        <div class="gBlock__created"><b>Added:</b> {{ timeStamp(block.created) }}</div>
        <div class="gBlock__played"><b>Played:</b> {{ block.played }}</div>
      </div>
    </div>
  </router-link>
</template>

<script>
export default {
  name: 'GameBlock',
  props: {
    block: Object,
    hovered: Boolean
  },
  created() {
    this.videoUrl()
  },
  data() {
    return {
      imgLoaded: false,
      isVideoAvailable: false
    }
  },
  watch: {
    hovered: async function(newVal) {
      if (!this.isVideoAvailable) { return }
      if (newVal) {
        await this.$refs.video.play();
      } else {
        await this.$refs.video.pause();
        this.$refs.video.currentTime = 0;
        // update
        // this.$refs.video.load() makes Error
      }
    },
  },
  methods: {
    loadedImg() {
      this.imgLoaded = this.$refs.img.complete;
      this.$emit('imgLoaded', true);
    },

    videoUrl() {
      this.isVideoAvailable = this.block.videoURL !== ''
    },

    timeStamp(milliseconds) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const d = new Date(milliseconds);
      const month = months[d.getMonth()];
      let day = d.getDate();
      day = day < 10 ? `0${day}` : day;
      const year = d.getFullYear();
      return `${day}-${month}-${year}`
    },

    styleStar(stars) {
      return stars <= this.block.rating || this.block.rating >= 4.5
        ? { color: 'gold' }
        : { color: 'dimgray' }
    }
  }
}
</script>

<style lang="scss" scoped>
.gBlock {
  text-decoration: none;

  &__block {
    @include FlexColumn(space-between, center);
    @include boxShadow(0.3);
    width: 300px;
    height: 360px;
    padding: 10px;
    border-radius: 10px;
    border: 1px solid $black;
    transition-duration: .5s;
  }

  &__block:hover {
    background: whitesmoke;
    @include boxShadow(0.9);
  }

  &__container {
    position: relative;
    width: 280px;
    height: 135px;
    background: gray;
    overflow: hidden;
    @include boxShadow(0.05);
  }

  &__video, &__poster  {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }

  &__noVideo {
    position: absolute;
    width: 100%;
    height: 20px;
    background: red;
    bottom: 0;
    left: 0;
    text-align: center;
    color: white;
  }

  &__rating {
    @include Flex(space-around);
    width: 150px;
  }

  &__star {
    font-size: 20px;
  }

  &__title, &__text {
    font-size: 20px;
    color: $black
  }

  &__title {
    font-size: 30px;
  }

  &__text {
    height: 100px;
    color: $black;
    opacity: 0.7;
  }

  &__flex {
    width: 100%;
    @include Flex(space-between);
    color: darkslateblue;
  }

  &__created, &__played {
    font-size: 16px;
  }
}

// transition
.noVideo-enter-active, .noVideo-leave-active {
  transition: transform .5s
}

.noVideo-enter-from, .noVideo-leave-to {
  transform: translateY(20px);
}

// adaptivness
@media only screen and (max-width: 1050px) {
  .gBlock {
    &__block {
      width: 280px;
      height: 340px;
    }

    &__container {
      width: 260px;
      height: 130px;
    }

    &__title {
      font-size: 25px;
    }

    &__rating {
      width: 140px;
    }

    &__star {
      font-size: 19px;
    }

    &__text {
      font-size: 18px;
      height: 80px;
    }

    &__created, &__played {
      font-size: 14px;
    }
  }
}

@media only screen and (max-width: 800px) {
  .gBlock {
    &__block {
      width: 270px;
      height: 320px;
    }

    &__container {
      width: 250px;
      height: 120px;
    }

    &__title {
      font-size: 24px;
    }

    &__rating {
      width: 130px;
    }

    &__star {
      font-size: 18px;
    }

    &__text {
      font-size: 17px;
      height: 75px;
    }
  }
}

@media only screen and (max-width: 669px) {
  .gBlock {
    &__block {
      width: 260px;
      height: 300px;
    }

    &__container {
      width: 240px;
      height: 115px;
    }

    &__title {
      font-size: 23px;
    }

    &__rating {
      width: 120px;
    }

    &__star {
      font-size: 16px;
    }

    &__text {
      font-size: 16px;
      height: 70px;
    }
  }
}

@media only screen and (max-width: 399px) {
  .gBlock {
    &__block {
      width: 250px;
      height: 270px;
    }

    &__container {
      width: 230px;
      height: 110px;
    }

    &__title {
      font-size: 20px;
    }

    &__rating {
      width: 100px;
    }

    &__star {
      font-size: 14px;
    }

    &__text {
      font-size: 14px;
      height: 50px;
    }

    &__created, &__played {
      font-size: 12px;
    }
  }
}
</style>