<template>
  <div class="comment">
    <img :src="comment.avatar" alt="Avatar" class="comment__avatar" draggable="false">
    <div class="comment__info">
      <h3 class="comment__username">{{ comment.username }}</h3>
      <p class="comment__text">{{ comment.text }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Comment',
  props: {
    comment: Object
  }
}
</script>

<style lang="scss" scoped>
.comment {
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

  &__username {
    font-size: 18px;
    color: darkslategrey;
  }

  &__text {
    margin-top: 5px;
    width: 100%;
    max-width: 840px;
    overflow-wrap: break-word;
    font-size: 16px;
  }
}
.comment:not(:last-child) {
  margin-bottom: 20px;
}
</style>