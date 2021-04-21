<template>
	<transition name="fade">
		<div class="modal" v-if="getGameFinished">
			<div class="mask" @click="close()"/>
			<div class="resultMemoji center">
				<div class="resultMemoji__close" @click="close()"></div>
				<div class="resultMemoji__title">You {{getResult}}</div>
				<div class="resultMemoji__complete">
					<div class="resultMemoji__text" v-if="getResult === 'Win'">{{time}}</div>
					<div class="resultMemoji__text" v-else>Try one more time or choose another level</div>
				</div>
				<div class="resultMemoji__btns" :style="{width: `${width}px`}">
					<div class="resultMemoji__btn" v-if="showPrev()" @click="changeLevel(-1)">Previous level</div>
					<div class="resultMemoji__btn" @click="restart()">Restart</div>
					<div class="resultMemoji__btn" v-if="showNext()" @click="changeLevel(1)">Next level</div>
				</div>
			</div>
		</div>
	</transition>
</template>
<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('memoji');
import Result from '@/mixins/result';
export default {
	name: "ResultMemoji",
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
.resultMemoji {
  @include Result();
}
</style>