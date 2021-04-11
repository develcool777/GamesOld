<template>
	<transition name="fade">
		<div class="modal" v-if="gameFinished">
			<div class="mask" @click="close()"/>
			<div class="result center">
				<div class="result__close" @click="close()"></div>
				<div class="result__title">You {{getResult}}</div>
				<div class="result__complete">
					<div class="result__text" v-if="getResult === 'Win'">{{time}}</div>
					<div class="result__text" v-else>Try one more time or choose another level</div>
				</div>
				<div class="result__btns" :style="{width: `${width}px`}">
					<div class="result__btn" v-if="showPrev()" @click="changeLevel(-1)">Previous level</div>
					<div class="result__btn" @click="restart()">Restart</div>
					<div class="result__btn" v-if="showNext()" @click="changeLevel(1)">Next level</div>
				</div>
			</div>
		</div>
	</transition>
</template>
<script>
import { mapActions, mapState, mapGetters } from 'vuex'
export default {
	name: "Result",
	data() {
		return {
			width: 400,
		}
	},
	computed: {
		...mapState(['gameFinished']),
		...mapGetters(['getLevel', 'getTimer', 'getTimeForReset', 'getResult', 'getAmountOfLevels']),
		time() {
			const cheak = (time, str) => time > 1 ? `${str}s` : str;   
			let seconds = this.getTimeForReset - this.getTimer;
			if (seconds > 60) {
				let min = Math.floor(seconds / 60);
				let sec = seconds % 60;
				return `Completed in ${min} ${cheak(min, 'minute')} ${sec} ${cheak(sec, 'second')}`;
			}
			return `Completed in ${seconds} ${cheak(seconds, 'second')}`;
		}
	},
	methods: {
		...mapActions(['INIT_STATE', 'END_GAME']), /// !!!!
    restart() {
			this.$emit('restart');
		},
		close() {
			console.log('Result close');
			this.$emit('close');
		},
    changeLevel(step) {
      this.$emit('changeLevel', step);
    },
		showPrev() {
			if (this.getLevel > 1) {
				this.width = 400;
				return true;
			}
			this.width = 300;
			return false;
		},
		showNext() {
			if (this.getLevel < this.getAmountOfLevels) {
				this.width = 400;
				return true;
			}
			this.width = 300;
			return false;
		}
	}
}
</script>
<style lang="scss">
.result {
	display: flex;
	align-items: center;
	flex-direction: column;
	justify-content: space-around;
	width: rem(500);
	height: rem(350);
	background-color: $white;
	border-radius: rem(10);
	z-index: $modalContent;
	&__title {
		font-size: rem(50);
	}
	&__complete {
		width: rem(400);
	}
	&__text {
		text-align: center;
		font-size: rem(30);
	}
	&__btns {
		@include Flex(space-between);
		width: rem(400);
	}
	&__btn {
		padding: rem(10) rem(20);
		border-radius: rem(10);
		color: $white;
		background: $gradient-primary;
		cursor: pointer;
		transition-duration: .5s;
	}
	&__btn:hover {
		background: $gradient-secondary;
		transform: scale(0.98);
	}
	&__close, &__close::before, &__close::after {
		position: absolute;
		width: rem(20);
		content: "";
		transition-duration: .5s;
	}
	&__close {
		top: rem(20);
		right: rem(20);
		height: rem(20);
		cursor: pointer;
	}
	&__close::before, &__close::after {
		top: rem(10);
		height: 1px;
		background: $gradient-primary;
	}
	&__close::before {
		transform: rotate(45deg);
	}
	&__close::after {
		transform: rotate(135deg);
	}
	&__close:hover::before, &__close:hover::after {
		transform: rotate(360deg);
		height: 3px;
		background: $red;
	}
}
</style>