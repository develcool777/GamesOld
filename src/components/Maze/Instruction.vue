<template>
  <div class="instruction">
    <div class="instruction__controls">
      <div class="instruction__title">Controls</div>
      <div class="instruction__text">Use Arrow buttons or your keybord to control</div>
      <div class="instruction__btns">
        <div class="instruction__row instruction__row--center">
          <div class="instruction__btn up"></div>
        </div>
        <div class="instruction__row">
          <div class="instruction__btn left"></div>
          <div class="instruction__btn down"></div>
          <div class="instruction__btn right"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Instruction'
}
</script>

<style lang="scss">
.instruction {
  width: rem(300);
  &__btns {
    width: rem(170);
    height: rem(110);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  &__row {
    @include Flex(space-between);
    &--center {
      justify-content: center;
    }
  }
  &__btn {
    width: rem(50);
    height: rem(50);
    background: red;
    cursor: pointer;
  }
}
.up, .down, .left, .right {
  position: relative;
}
.up::after, .down::after, .left::after, .right::after {
  position: absolute;
  content: '';
  top: 50%;
  left: 50%;
  width: 3px;
  height: 3px;
  border: solid black;
  border-radius: 2px;
  border-width: 0 5px 5px 0;
  display: inline-block;
  padding: 5px;
}
.right::after {
    transform: translate(-60%, -50%) rotate(-45deg);
    -webkit-transform: translate(-60%, -50%) rotate(-45deg);
}

.left::after {
    transform: translate(-40%, -50%)  rotate(135deg);
    -webkit-transform: translate(-40%, -50%) rotate(135deg);
}

.up::after {
    transform: translate(-50%, -40%) rotate(-135deg);
    -webkit-transform: translate(-50%, -40%) rotate(-135deg);
}

.down::after {
    transform: translate(-50%, -50%) rotate(45deg);
    -webkit-transform: translate(-50%, -60%) rotate(45deg);
}

</style>