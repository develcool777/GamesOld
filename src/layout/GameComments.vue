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

    <section class="info__section">
      <div class="info__flex">
        <h2 class="info__title">Comments</h2>
        <fontAwesome icon="comments" class="info__commentsIcon"/>
        <p title="Amount of comments">{{ getAmountOfComments }}</p>
      </div>
      <div class="info__write">
        <div v-if="getUser !== null" class="info__inputWrap" >
          <input 
            type="text" 
            class="info__input" 
            placeholder="Type your comment..."
            v-model="value"
            @keypress.enter="comment()"
            lang="en"
          >
          <div class="info__wrapIcon">
            <fontAwesome 
              v-if="value !== ''"
              icon="backspace" 
              class="info__backspace" 
              title="Clear Field" 
              @click="value = ''"
            />
          </div>
          <button class="info__post" type="button" @click="comment()">Comment</button>
        </div>
        <p v-else class="info__alternative">Please sign in to comment</p>
      </div>

      <div v-if="getGameData.comments.length !== 0" class="info__comments" >
        <Comment 
          v-for="(c, i) in getGameData.comments"
          :key="i" 
          :comment="Object.assign(c, {isCurrentUserAdmin: getUser?.admin})"
          v-on:delComment="delComment($event)"
        />
      </div>

      <div v-if="showLoadMore" class="info__loadMoreWrap">
        <button class="info__loadMore" @click="loadMore()">Load more</button>
      </div>
    </section>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapGetters } = createNamespacedHelpers('comments');
import Filter from 'bad-words';
import Comment from '@/components/GameComments/Comment'
export default {
  name: 'GameComments',
  components: {
    Comment
  },
  props: {
    game: Object
  },
  data() {
    return {
      isLoaded: false,
      value: '',
      unsubscribe: null 
    }
  },
  async created() {
    await this.init(); 
  },
  computed: {
    ...mapGetters(['getGameData', 'getAmountOfComments']),

    getUser() {
      return this.$store.getters['user/getUser'];
    },

    amountOfComments() {
      return this.getGameData.comments.length;
    },

    getInfo() {
      return this.getGameData.info;
    },

    showLoadMore() {
      const commentsInFirebase = this.getAmountOfComments;
      const currentAmountOfComments = this.amountOfComments;
      return commentsInFirebase !== currentAmountOfComments;
    }
  },
  methods: {
    ...mapActions(['GET_DATA', 'POST', 'DELETE_COMMENT', 'LISTENER_FOR_COMMENTS', 'LOAD_MORE_COMMENTS']),

    async init() {
      const obj = {
        gameName: this.game.name,
        listener: false
      }
      await this.GET_DATA(obj);
      this.unsubscribe = await this.LISTENER_FOR_COMMENTS(this.game.name);
      this.isLoaded = true;
    },

    async comment() {
      if (this.value === '') { return }
      const obj = {}
      const customFilter = new Filter({ placeHolder: '*'})
      obj.text = customFilter.clean(this.value);
      obj.avatar = this.getUser.avatar;
      obj.username = this.getUser.username;
      obj.game = this.game.name;
      obj.admin = this.getUser.admin;
      obj.id = Math.floor(Date.now() * Math.random());
      obj.created = Date.now();
      await this.POST(obj);
      this.value = '';
    },

    async delComment(id) {
      const obj = {};
      obj.game = this.game.name;
      obj.id = id;
      await this.DELETE_COMMENT(obj);
    },

    async loadMore() {
      await this.LOAD_MORE_COMMENTS(this.game.name);
    }
  },
  beforeUnmount() {
    this.unsubscribe();
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
    margin: 5px 0 30px;
  }

  &__title {
    font-size: 25px;
    color: darkslategrey;
  }

  &__flex {
    @include Flex(flex-start);
    width: 250px;
    color: darkslategrey;
    font-size: 25px;
  }

  &__commentsIcon {
    margin: 0 10px;
  }

  &__descriptionText {
    font-size: 18px;
    line-height: 1.5;
    margin-top: 5px;
  }

  &__write {
    margin-top: 5px;
    width: 100%;
    text-align: center;
  }

  &__inputWrap {
    display: flex;
    height: 40px;
  }

  &__input {
    flex: 1;
    height: 100%;
    outline: none;
    border: none;
    caret-color: darkslategrey;
    font-size: 20px;
    border-bottom: 2px solid darkslategrey;
    padding-right: 10px;
  }

  &__wrapIcon {
    @include Flex(center);
    border-bottom: 2px solid darkslategrey;
    height: 100%;
    padding-right: 10px;
  }

  &__backspace {
    color: darkgray;
    font-size: 20px;
    cursor: pointer;
    transition-duration: .5s;
  }

  &__backspace:hover {
    color: darken($color: darkgray, $amount: 10);
  }

  &__post {
    border: none;
    outline: none;
    font-size: 20px;
    background: darkslategrey;
    color: white;
    width: 150px;
    height: 100%;
    cursor: pointer;
    transition-duration: .5s;
  }

  &__post:hover {
    background: lighten($color: darkslategrey, $amount: 10);
  }

  &__alternative {
    @include Flex(center);
    font-size: 20px;
    height: 40px;
  }

  &__comments {
    margin-top: 30px;
  }

  &__loadMoreWrap {
    @include Flex(center);
    margin-top: 30px;
  }

  &__loadMore {
    border: none;
    font-size: 18px;
    padding: 10px 20px;
    border-radius: 5px;
    background: darkslategrey;
    color: white;
    cursor: pointer;
    transition-duration: .5s;
  }

  &__loadMore:hover {
    background: lighten($color: darkslategrey, $amount: 10);
  }
}
</style>