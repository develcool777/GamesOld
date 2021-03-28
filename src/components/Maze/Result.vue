<template>
	<transition name="fade">
		<div class="modal" v-if="status">
			<div class="mask"/>
			<div class="result center">
				<div class="result__title">You {{result}}</div>
				<div class="result__btns">
					<div class="result__btn" @click="close()">Refresh</div>
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
    close() {
			this.$emit('close')
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
		border: 1px solid $black;
		cursor: pointer;
		transition-duration: .5s;
	}
	&__btn:hover {
		color: $white;
		background: $black;
	}
}
</style>