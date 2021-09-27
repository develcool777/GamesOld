<template>
	<transition name="fade">
		<div class="modal" v-if="getGameStatus === 'finish' && getShowModal">
			<div class="mask"/>
			<div class="resultChess center">
				<div class="resultChess__close" @click="close()"></div>
				<div class="resultChess__title">{{ getGameResult.title }}</div>
				<div class="resultChess__description">{{ getGameResult.description }}</div>
				<div class="resultChess__btns">
					<div class="resultChess__btn" @click="analyze()">Analyze Game</div>
					<div class="resultChess__btn" @click="newGame()">New Game</div>
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
		...mapGetters(['getGameResult', 'getGameStatus', 'getShowModal'])
	},
  methods: {
    ...mapActions([
			'CHANGE_GAME_RESULT', 'CHANGE_GAME_STATUS', 
			'CHANGE_CLEAR_BOARD', 'CHANGE_SHOW_MODAL',
			'CHANGE_ANALYZE'
		]),

    close() {
      const obj = {title: '', description: ''};
      this.CHANGE_GAME_RESULT(obj);
			this.CHANGE_SHOW_MODAL(false);
    },

		newGame() {
			this.close();
			this.CHANGE_GAME_STATUS('start');
			this.CHANGE_CLEAR_BOARD(true);
		},

		analyze() {
			this.close();
			this.CHANGE_ANALYZE(true);
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
	&__btns {
		justify-content: space-around;
	}
}
</style>