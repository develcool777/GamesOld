<template>
  <section class="instMemoji">
    <div class="instMemoji__time">
      <div class="instMemoji__title">Timer: {{ timeStr }}</div>
      <div class="instMemoji__mainBtns">
        <div 
          class="instMemoji__mainBtn" 
          @click.stop=" allowClick ? startGame() : null"
        >{{ getIsPlaying === undefined ? 'Start' : getIsPlaying ? 'Started' : 'Start'}}</div>
        <div
          class="instMemoji__mainBtn"
          @click.stop=" !allowClick ? stopGame() : null"
          >{{ getIsPlaying === undefined ? 'Stop' : !getIsPlaying ? 'Stoped' : 'Stop'}}</div>
      </div>
      <div class="instMemoji__mainBtn" @click="restartGame()">Restart</div>
      <div class="instMemoji__mainBtn" @click="showHint()">Show hint</div>
    </div>
    <div class="instMemoji__levels">
      <div class="instMemoji__title">Levels</div>
      <div class="instMemoji__row instMemoji__row--width">
        <div class="instMemoji__btn left" @click="changeLevel(-1)"></div>
         <div class="instMemoji__level">Level: {{getLevel}}</div>
        <div class="instMemoji__btn right" @click="changeLevel(1)"></div>
      </div>
    </div> 
  </section>
</template>

<script>
import Instruction from '@/mixins/instruction'
import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapState, mapGetters } = createNamespacedHelpers('memoji')
export default {
  name: 'Instruction',
  mixins: [Instruction],
  computed: {
    ...mapGetters([
      'getLevel', 'getTimer', 'getShowHint', 
      'getTimeForReset', 'getIsPlaying'
    ]),
    ...mapState([
      'gameFinished', 'level',
      'timer', 'restart'
    ])
  },
  methods: {
    ...mapActions([
      'CHANGE_LEVEl', 'CHANGE_TIMER', 'CHANGE_ISPLAYING',
      'END_GAME', 'CHANGE_RESTART',
      'CHANGE_SHOW_HINT'
    ]),
  }
}
</script>

<style lang="scss">
.instMemoji {
  @include Instruction();
}
</style>