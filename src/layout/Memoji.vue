<template>
  <div class="memoji">
    <div class="memoji__game">
      <div class="memoji__field" :style="{width: setFieldWidth}">
        <div class="scene" v-for="(card, i) in fieldForDraw" :key="i">
          <div 
            class="card" 
            :class="displayIsFlipped(card)" 
            :style="{cursor: getIsPlaying ? 'pointer' : 'default'}"
          > 
            <div 
              class="card__face card__face--front" 
              @click="clickedCard(card)"
            ></div>
            <div 
              class="card__face card__face--back" 
              :class="displayIsMatch(card)" 
              @click="clickedCard(card)"
            >
              <span :class="card.class"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Instruction 
      class="memoji__instruction"
      v-on:changeLevel="changeLevel($event)"
      v-on:restart="restartGame()"
    />
  </div>
  <ResultMemoji
    v-on:changeLevel="changeLevel($event)"
    v-on:restart="restartGame()"
    v-on:close="cleanField()"
  />
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapActions, mapGetters } = createNamespacedHelpers('memoji');
import Field from '@/model/memoji/field';
import Game from '@/model/memoji/game';
import Instruction from '@/components/Memoji/Instruction';
import ResultMemoji from '@/components/Memoji/Result';
export default {
  name: 'Memoji',
  components: {
    Instruction,
    ResultMemoji
  },
  data() {
    return {
      field: {},
      game: {},
      fieldForDraw: [],
      timeForShow: 1000
    }
  },
  watch: {
    showHint: function(newVal) {
      return newVal ? this.hint() : null;
    },
    gameFinished: function(newVal) {
      if (newVal) {
        this.game.clean();
      } 
    }
  },
  async created() {
    await this.GET_DATA();
    this.field = new Field(this.getData)
    this.createGame();
  },
  computed: {
    ...mapState(['showHint', 'gameFinished']),
    ...mapGetters(['getItemsForCompare', 'getIsPlaying', 'getData']),
    setFieldWidth() {
      if (this.game.cards === undefined) { return '100px' }
      const amountOfCards = this.game.cards.length;
      const calcWidth = (koef) => 130 * koef + 25 * koef;
      if (amountOfCards <= 4) {
        return `${calcWidth(amountOfCards)}px`
      }
      if (amountOfCards <= 12) {
        return `${calcWidth(Math.ceil(amountOfCards / 2))}px`
      }
      return `${calcWidth(6)}px`;
    }
  },
  methods: {
    ...mapActions([
      'INIT_STATE', 'ADD_ITEMS_FOR_COMPARE', 
      'REMOVE_ITEMS_FOR_COMPARE', 'CLEAN_GAME',
      'CHANGE_SHOW_HINT', 'CHANGE_RESTART', 'END_GAME', 'GET_DATA'
    ]),
    createGame() {
      this.game = new Game(this.field.getCardsForGame());
      this.game.setCardData();
      this.draw();
      const obj = {
        time: this.field.time(),
        level: this.field.level,
        levels: this.field.amountOfLevels()
      }
      this.INIT_STATE(obj);
    },
    clickedCard(card) {
      if (this.getIsPlaying !== true ) { return }
      if (this.getItemsForCompare.length < 2) {
        this.ADD_ITEMS_FOR_COMPARE(card);
        this.game.clickOnCard(card);
        this.draw();
      }
      if (this.getItemsForCompare.length === 2) {
        this.check();
      }
      if (this.game.checkWin()) {
        setTimeout(() => {
          this.END_GAME('Win')
        }, this.timeForShow);
      }
    },
    draw() {
      this.fieldForDraw = this.game.cardsData;
    },
    check() {
      const isMatch = this.game.checkMatch(...this.getItemsForCompare);
      if (isMatch) {
        this.REMOVE_ITEMS_FOR_COMPARE();
        return this.draw();
      } 
      setTimeout(() => {
        this.getItemsForCompare.forEach(card => {
          this.game.reset(card);
        }) 
        this.REMOVE_ITEMS_FOR_COMPARE();
        this.draw();
      }, this.timeForShow - 250);   
    },
    changeLevel(step) {
      this.field.changeLevel(step);
      this.createGame();
    },
    cleanField() {
      this.game.clean();
      this.draw();
      this.CLEAN_GAME();
    },
    restartGame() {
      this.cleanField();
      this.CHANGE_RESTART(true);
    },
    hint() {
      const func = bool => {
        this.game.showOrHideHint(bool);
        this.draw();
      }
      func(true);
      setTimeout(() => {
        func(false);
      }, this.timeForShow);
      setTimeout(() => {
        this.CHANGE_SHOW_HINT(false);
      }, this.timeForShow * 2);
    },
    displayIsMatch(card) {
      if (card.isMatch && card.isFlipped) {
        return 'match';
      }
      if (card.isFlipped && card.isMatch === false) {
        return 'noMatch';
      }
      return '';
    },
    displayIsFlipped(card) {
      return card.isFlipped ? 'isFlipped' : '';
    }
  }
}
</script>

<style lang="scss" scoped>
.memoji {
  @include BasicGrid();
  &__field {
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
}
.card__face {
  @include Card(130);
  border: 5px solid $white;
  border-radius: 9px;
  box-shadow: 1px 1px 5px rgba(0,0,0,0.5);
}

.card__face--front {
  background: linear-gradient(to top right, $firstGradient, $secondGradient);
}

.card__face--back{
  display: flex;
  justify-content: center;
  align-items: center;
  background:$white;
}

.img {
  @include SizeOfEmoji(75);
}
/* flip */
.scene {
  @include Card(130);
  margin-bottom: 25px;
  perspective: 600px;
}
  
.card {
  transition: transform 1s;
  transform-style: preserve-3d;
  position: relative;
}

.card.isFlipped {
  pointer-events: none;
  transform: rotateY(180deg);
}

.card__face {
  position: absolute;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

.card__face--back {
  transform: rotateY(180deg);
}

.match {
  background: $match;
  border-color: $match;
  pointer-events: none;
  transition-duration: 2s;
}

.noMatch {
  background: $didNotMatch;
  border-color: $didNotMatch;
  pointer-events: none;
  transition-duration: 2s;
}
</style>