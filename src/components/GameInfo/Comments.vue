<template>
  <section class="comments" v-if="isLoaded">
    <div class="comments__heading">
      <h2 class="comments__title">Comments</h2>
      <fontAwesome icon="comments" class="comments__icon"/>
      <p title="Amount of comments">{{ getAmountOfComments }}</p>
    </div>
    <div class="comments__write">
      <div v-if="getUser !== null" class="comments__inputWrap" >
        <input 
          type="text" 
          class="comments__input" 
          placeholder="Type your comment..."
          v-model="value"
          @keypress.enter="comment()"
          lang="en"
        >
        <div class="comments__wrapIcon">
          <fontAwesome 
            v-if="value !== ''"
            icon="backspace" 
            class="comments__backspace" 
            title="Clear Field" 
            @click="value = ''"
          />
        </div>
        <button class="comments__post" type="button" @click="comment()">Comment</button>
      </div>
      <p v-else class="comments__alternative">Please sign in to comment</p>
    </div>

    <div v-if="getComments.length !== 0" class="comments__comments" >
      <Comment 
        v-for="(c, i) in getComments"
        :key="i" 
        :comment="Object.assign(c, {isCurrentUserAdmin: getUser?.admin})"
        v-on:delComment="delComment($event)"
      />
    </div>

    <div v-if="showLoadMore" class="comments__loadMoreWrap">
      <button class="comments__loadMore" @click="loadMore()">Load more</button>
    </div>
  </section>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapGetters } = createNamespacedHelpers('comments');
import Filter from 'bad-words';
import Comment from '@/components/GameInfo/Comment'
export default {
  name: 'Comments',
  components: {
    Comment
  },
  props: {
    gameName: String,
    isLoaded: Boolean
  },
  data() {
    return {
      value: '',
      unsubscribe: null 
    }
  },
  async created() {
    await this.init();
  },
  computed: {
    ...mapGetters(['getComments', 'getAmountOfComments']),

    getUser() {
      return this.$store.getters['user/getUser'];
    },

    amountOfComments() {
      return this.getComments.length;
    },

    showLoadMore() {
      const commentsInFirebase = this.getAmountOfComments;
      const currentAmountOfComments = this.amountOfComments;
      return commentsInFirebase !== currentAmountOfComments;
    }
  },
  methods: {
    ...mapActions([
      'GET_DATA', 'POST_COMMENT', 'DELETE_COMMENT', 
      'LISTENER_FOR_COMMENTS', 'LOAD_MORE_COMMENTS', 'CLEAR_STATE'
    ]),

    async init() {
      const obj = {
        gameName: this.gameName,
        listener: false
      }
      await this.GET_DATA(obj);
      this.unsubscribe = await this.LISTENER_FOR_COMMENTS(this.gameName);
      this.$emit('loaded');
    },

    async comment() {
      if (this.value === '') { return }
      const obj = {}
      const customFilter = new Filter({ placeHolder: '*'})
      obj.text = customFilter.clean(this.value);
      obj.avatar = this.getUser.avatar;
      obj.username = this.getUser.username;
      obj.game = this.gameName;
      obj.admin = this.getUser.admin;
      obj.id = Math.floor(Date.now() * Math.random());
      obj.created = Date.now();
      await this.POST_COMMENT(obj);
      this.value = '';
    },

    async delComment(id) {
      const obj = {};
      obj.game = this.gameName;
      obj.id = id;
      await this.DELETE_COMMENT(obj);
    },

    async loadMore() {
      await this.LOAD_MORE_COMMENTS(this.gameName);
    }
  },
  beforeUnmount() {
    this.CLEAR_STATE();
    this.unsubscribe();
  }
}
</script>

<style lang="scss" scoped>
.comments {
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