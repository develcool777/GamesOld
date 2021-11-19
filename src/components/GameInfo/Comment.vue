<template>
  <div class="comment">
    <img :src="comment.avatar" alt="Avatar" class="comment__avatar" draggable="false">
    <div class="comment__info">
      <div class="comment__block">
        <h3 class="comment__username">{{ comment.username }}</h3>
        <fontAwesome v-if="comment.admin" icon="user-cog" title="Admin" class="comment__admin"/>
        <p class="comment__timeStamp">{{ timeStamp(comment.created) }}</p>
      </div>
      <p class="comment__text">{{ comment.text }}</p>
    </div>
    <fontAwesome 
      v-if="comment.isCurrentUserAdmin"
      icon="trash-alt" 
      class="comment__del" 
      @click="deleteComment(comment.id)" 
      title="Delete comment"
    />
  </div>
</template>

<script>
export default {
  name: 'Comment',
  props: {
    comment: Object
  },
  methods: {
    deleteComment(id) {
      this.$emit('delComment', id);
    },

    timeStamp(seconds) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const date = new Date(seconds);
      const month = months[date.getMonth()];
      const dayOfMonth = date.getDate();
      const year = date.getFullYear();
      let hour = date.getHours();
      hour = hour < 10 ? `0${hour}` : hour;
      let min = date.getMinutes();
      min = min < 10 ? `0${min}` : min;
      return `${dayOfMonth}-${month}-${year} ${hour}:${min}`;
    }
  }
}
</script>

<style lang="scss" scoped>
.comment {
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 10px;
  background: #f2f2f2;
  border-radius: 5px;

  &__avatar {
    height: 50px;
    border-radius: 5px;
    margin-right: 10px;
  }

  &__block {
    display: flex;
    align-items: center;
    color: darkslategrey;
  }

  &__username {
    font-size: 18px;
  }

  &__admin {
    font-size: 14px;
    margin-left: 5px;
    color: blue;
  }

  &__timeStamp {
    margin-left: 10px;
    font-size: 14px;
  }

  &__text {
    margin-top: 5px;
    width: 100%;
    max-width: 800px;
    overflow-wrap: break-word;
    word-break: break-all;
    font-size: 16px;
  }

  &__del {
    position: absolute;
    top: 50%;
    right: 2%;
    transform: translateY(-50%);
    font-size: 25px;
    color: darkslategrey;
    transition-duration: .5s;
    cursor: pointer;
  }

  &__del:hover {
    color: lighten($color: darkslategrey, $amount: 10);
  }
}
.comment:not(:last-child) {
  margin-bottom: 20px;
}
</style>