<template>
	<transition name="fade">
		<div class="modal" v-if="status">
			<div class="mask" @click="close()"/>
			<div class="result center">
				<div class="result__close" @click="close()"></div>
				<div class="result__title">You {{result}}</div>
				<div class="result__btns">
					<div class="result__btn">Previous level</div>
					<div class="result__btn" @click="restart()">Restart</div>
					<div class="result__btn">Next level</div>
				</div>
			</div>
		</div>
	</transition>
</template>
<script>
export default {
	name: "Result",
  props: {
    status: Boolean,
		result: String
  },
	methods: {
    restart() {
			this.$emit('restart');
		},
		close() {
			console.log('Result close');
			this.$emit('close');
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
	&__btns {
		@include Flex(space-between);
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