<template>
  <div class="memoji">
    <div class="memoji__position">
      <div class="memoji__field">
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
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapActions, mapGetters } = createNamespacedHelpers('memoji');
import DATA from '@/data/dataForMemoji';
import Field from '@/model/memoji/field';
import Game from '@/model/memoji/game';
import Instruction from '@/components/Memoji/Instruction';
export default {
  name: 'Memoji',
  components: {
    Instruction
  },
  data() {
    return {
      field: {},
      game: {},
      fieldForDraw: []
    }
  },
  watch: {
    showHint: function(newVal) {
      if (newVal) {
        this.hint(true);
        setTimeout(() => {
          this.hint(false);
        }, 1000);
      }
    }
  },
  created() {
    this.field = new Field(DATA);
    this.createGame();
  },
  computed: {
    ...mapState(['showHint']),
    ...mapGetters(['getItemsForCompare', 'getIsPlaying'])
  },
  methods: {
    ...mapActions([
      'INIT_STATE', 'ADD_ITEMS_FOR_COMPARE', 
      'REMOVE_ITEMS_FOR_COMPARE', 'CLEAN_GAME',
      'CHANGE_SHOW_HINT', 'CHANGE_RESTART'
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
    },
    draw() {
      this.fieldForDraw = this.game.cardsForDraw();
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
      }, 750);   
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
    hint(boolean) {
      this.game.showOrHideHint(boolean);
      this.draw();
      if (boolean === false) {
        this.CHANGE_SHOW_HINT(false);
      }
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

<style lang="scss">
.memoji {
  display: flex;
  flex: 1;
  &__position {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center; 
  }
  &__instruction {
    flex-basis: rem(265);
    border-left: 5px solid $black;
  }
  &__field {
    width: calc(130px*4 + 25px*4);
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
}
.card__face {
  width: rem(130);
  height: rem(130);
  border: 5px solid $white;
  border-radius: 9px;
  // cursor: pointer;
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
  font-size: rem(75);
}
/* flip */
.scene {
  width: 130px;
  height: 130px;
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