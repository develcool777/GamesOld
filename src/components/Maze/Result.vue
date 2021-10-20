<template>
	<transition name="fade">
		<div class="modal" v-if="status === 'finish'">
			<div class="mask" @click="close()"/>
			<div class="resultMaze center">
				<div class="resultMaze__close" @click="close()"></div>
				<div class="resultMaze__title">You {{gameResult}}</div>
				<div class="resultMaze__complete">
					<div class="resultMaze__text" v-if="gameResult === 'Won'">{{time}}</div>
					<div class="resultMaze__text" v-else>Try one more time or choose another level</div>
				</div>
				<div class="resultMaze__btns" :style="calcWidth">
					<div class="resultMaze__btn" v-if="showPrev()" @click="changeLevel('Prev')">Previous level</div>
					<div class="resultMaze__btn" @click="restart()">Restart</div>
					<div class="resultMaze__btn" v-if="showNext()" @click="changeLevel('Next')">Next level</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
export default {
	name: "ResultMaze",
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
		}
	},
	methods: {
    restart() {
			this.$emit('restart');
		},

		close() {
			this.$emit('close');
		},

    changeLevel(direction) {
      this.$emit('changeLevel', direction);
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
2e
<style lang="scss">
.resultMaze {
	@include Result();
}
</style>