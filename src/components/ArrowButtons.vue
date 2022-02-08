<template>
  <div class="panel">
    <h3 class="panel__title">Controls</h3>
    <p class="panel__text">Use Arrow buttons or your keybord to control</p>
    <div class="panel__arrows">
      <div class="panel__row">
        <Button 
          class="panel__arrow"
          :class="{pressed: arrowClicked === arrowButtons[0].name}"
          :style="styleArrows(arrowClicked === arrowButtons[0].name)"
          v-on:buttonClicked="clicked($event)"
          :Button="arrowButtons[0]"
          :Title="arrowButtons[0].name"
        />
      </div>
      <div class="panel__row">
        <Button 
          class="panel__arrow"
          v-for="(button, i) in arrowButtons.slice(1)"
          :key="i"
          :class="{pressed: arrowClicked === button.name}"
          :style="styleArrows(arrowClicked === button.name)"
          v-on:buttonClicked="clicked($event)"
          :Button="button"
          :Title="button.name"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Button from '@/components/Button'
export default {
  name: 'ArrowButtons',
  components: {
    Button
  },
  props: {
    arrowClicked: String,
    gameStatus: String
  },
  watch:  {
    arrowClicked: function(newValue) {
      console.log(newValue, 'watch');
    }
  },
  created() {
    console.log({arrowClicked: this.arrowClicked});
  },
  data() {
    return {
      arrowButtons: [
        { icon: 'arrow-up', name: 'ArrowUp' },
        { icon: 'arrow-left', name: 'ArrowLeft' },
        { icon: 'arrow-down', name: 'ArrowDown' },
        { icon: 'arrow-right', name: 'ArrowRight' },
      ],
    }
  },
  methods: {
    styleArrows(isActive) {
      console.log(isActive);
      if (isActive) return {cursor: 'pointer', background: 'yellow'}
      return this.gameStatus === 'start' 
        ? { cursor: 'pointer', background: 'orange' }
        : { cursor: 'default', background: 'gray' }
    },

    clicked(arrow) {
      if (this.gameStatus !== 'start') { return }
      this.$emit('clicked', arrow);
    },
  }
}
</script>

<style lang="scss" scoped>
.panel {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  background: darkslategrey;
  border-bottom: 1px solid gray;
  height: 220px;

  &__title, &__text {
    color: white;
    text-align: center;
  }

  &__title {
    color: whitesmoke;
    font-size: 30px;
  }

  &__arrows {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    height: 110px;
  }

  &__arrow {
    color: white;
    font-size: 30px;
    width: 50px;
    height: 50px;
    border-radius: 5px;
    transition-duration: .5s;
  }

  &__row:nth-child(2) {
    display: flex;
    justify-content: space-between;
    width: 170px;
  }
}

.pressed {
  color: red;
  transform: scale(0.9);
}
</style>