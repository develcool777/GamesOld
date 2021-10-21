<template>
	<transition name="fade">
		<div class="modal" v-if="status === 'finish'">
			<div class="mask" @click="close()"/>
			<div class="resultMemoji center">
				<div class="resultMemoji__close" @click="close()"></div>
				<div class="resultMemoji__title">You {{ gameResult }}</div>
				<div class="resultMemoji__complete">
					<div class="resultMemoji__text" v-if="gameResult === 'Won'">{{time}}</div>
					<div class="resultMemoji__text" v-else>Try one more time or choose another level</div>
				</div>
				<div class="resultMemoji__btns" :style="calcWidth">
					<div class="resultMemoji__btn" v-if="showPrev()" @click="changeLevel('Prev')">Previous level</div>
					<div class="resultMemoji__btn" @click="restart()">Restart</div>
					<div class="resultMemoji__btn" v-if="showNext()" @click="changeLevel('Next')">Next level</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
export default {
	name: "ResultMemoji",
	props: {	
		status: String,
		gameResult: String,
		timeInMs: Number,
    currentLevel: Number,
    amountOfLevels: Number 
	},
	computed: {
		time() {
			const cheak = (time, str) => time > 1 ? `${str}s` : str;   
			let seconds = parseInt(this.timeInMs / 1000);
			if (seconds > 60) {
				let min = Math.floor(seconds / 60);
				let sec = seconds % 60;
				return `Completed in ${min} ${cheak(min, 'minute')} ${sec} ${cheak(sec, 'second')}`;
			}
			return `Completed in ${seconds} ${cheak(seconds, 'second')}`;
		},

		calcWidth() {
			if (this.currentLevel > 1 && this.currentLevel < this.amountOfLevels) {
				return {width: '400px'};
			} 
			return {width: '300px'}
		},
	},
	methods: {
    restart() {
			this.$emit('restart');
		},

		close() {
			this.$emit('close');
		},

    changeLevel(step) {
      this.$emit('changeLevel', step);
    },

		showPrev() {
			return this.currentLevel > 1;
		},
		
		showNext() {
			return this.currentLevel < this.amountOfLevels;
		}
	}

}
</script>

<style lang="scss" scoped>
.resultMemoji {
  @include Result();
}
</style>