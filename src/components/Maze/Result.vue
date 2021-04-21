<template>
	<transition name="fade">
		<div class="modal" v-if="getGameFinished">
			<div class="mask" @click="close()"/>
			<div class="resultMaze center">
				<div class="resultMaze__close" @click="close()"></div>
				<div class="resultMaze__title">You {{getResult}}</div>
				<div class="resultMaze__complete">
					<div class="resultMaze__text" v-if="getResult === 'Win'">{{time}}</div>
					<div class="resultMaze__text" v-else>Try one more time or choose another level</div>
				</div>
				<div class="resultMaze__btns" :style="{width: `${width}px`}">
					<div class="resultMaze__btn" v-if="showPrev()" @click="changeLevel(-1)">Previous level</div>
					<div class="resultMaze__btn" @click="restart()">Restart</div>
					<div class="resultMaze__btn" v-if="showNext()" @click="changeLevel(1)">Next level</div>
				</div>
			</div>
		</div>
	</transition>
</template>
<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('maze');
import Result from '@/mixins/result';
export default {
	name: "ResultMaze",
	mixins: [Result],
	computed: {
		...mapGetters([
			'getLevel', 'getTimer', 'getTimeForReset', 
			'getResult', 'getAmountOfLevels', 'getGameFinished'
		])
	}
}
</script>
<style lang="scss">
.resultMaze {
	@include Result();
}
</style>