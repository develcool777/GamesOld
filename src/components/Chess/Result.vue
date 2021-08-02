<template>
	<transition name="fade">
		<div class="modal" v-if="getGameStatus === 'finish'">
			<div class="mask"/>
			<div class="resultChess center">
				<div class="resultChess__close" @click="close()"></div>
				<div class="resultChess__title">{{ getGameResult.title }}</div>
				<div class="resultChess__description">{{ getGameResult.description }}</div>
				<div class="resultChess__btns">
					<div class="resultChess__btn">Analyze Game</div>
					<div class="resultChess__btn">New Game</div>
				</div>
			</div>
		</div>
	</transition>
</template>
<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapActions } = createNamespacedHelpers('chess');

export default {
	name: "ResultChess",
	computed: {
		...mapGetters(['getGameResult', 'getGameStatus'])
	},
  methods: {
    ...mapActions(['CHANGE_GAME_RESULT', 'CHANGE_GAME_STATUS']),

    close() {
      const obj = {title: '', description: ''};
      this.CHANGE_GAME_RESULT(obj);
      this.CHANGE_GAME_STATUS('')
    }
  }
}
</script>
<style lang="scss">
.resultChess {
  @include Result();
  &__description {
    font-size: rem(25);
  }
}
</style>