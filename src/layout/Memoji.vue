<template>
  <div class="memoji">

    <div class="memoji__game">
      <div class="memoji__field" :style="{width: setFieldWidth}">
        <div class="scene" v-for="(card, i) in fieldForDraw" :key="i">
          <div 
            class="card" 
            :class="displayIsFlipped(card)" 
            :style="cursor(card)"
          > 
            <div 
              class="card__face card__face--front" 
              @click="clickedCard(card)"
            ></div>
            <div 
              class="card__face card__face--back" 
              :class="displayIsMatch(card)" 
            >
              <span :class="card.class"></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Instruction 
      class="memoji__instruction"
      :timer="gameTimeForPrint"
      :attempts="attemptsForHint"
      :gameStatus="gameStatus"
      :isHint="isHintActivated"
      :currentLevel="getCurrentLevel"
      :amountOfLevels="getAmountOfLevels"
      v-on:startGame="gameStarted()"
      v-on:stopGame="gameStoped()"
      v-on:finishGame="gameFinished()"
      v-on:changeLevel="changeLevel($event)"
      v-on:restart="restartGame()"
      v-on:showHint="hint()"
    />

    <GameInfoButton :path="{ name: 'Information', params: { name: 'memoji' }}"/>
  </div>

  <ResultMemoji
    :gameResult="gameResult"
    :status="gameStatus"
    :timeInMs="gameResultTime"
    :currentLevel="getCurrentLevel"
    :amountOfLevels="getAmountOfLevels"
    v-on:changeLevel="changeLevel($event)"
    v-on:restart="restartGame()"
    v-on:close="cleanField()"
  />

  <transition name="fade">
    <Loading v-if="loading" class="LOADING" :step="0.3"/>
  </transition>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapGetters } = createNamespacedHelpers('memoji');
import Field from '@/model/memoji/field';
import Game from '@/model/memoji/game';
import Instruction from '@/components/Memoji/Instruction';
import ResultMemoji from '@/components/Memoji/Result';
import Loading from '@/components/Loading'
import GameInfoButton from '@/components/GameInfoButton'
export default {
  name: 'Memoji',
  components: {
    Instruction,
    ResultMemoji,
    Loading,
    GameInfoButton
  },
  data() {
    return {
      FIELD: {},
      GAME: {},
      fieldForDraw: [],
      timeForShow: 1000,
      loading: true,
      attemptsForHint: 3,
      isHintActivated: false
    }
  },
  watch: {
    gameStatus(newStatus) {
      if (newStatus === 'finish') {
        this.GAME.closeCards();
        this.attemptsForHint = 3
      }
    },

    gameTime(newVal) {
      if (newVal === 0) {
        this.isFinish(true);
      } 
    }
  },
  async created() {
    setTimeout(() => {this.loading = false}, 2000);
    await this.init();
  },
  computed: {
    ...mapGetters(['getData']),

    gameTimeForPrint() {
      return this.GAME?.timer?.timeForPrint || '0:00';
    },

    gameTime() {
      return this.GAME?.timer?.time 
    },

    gameStatus() {
      return this.GAME.gameStatus;
    },

    gameResult() {
      return this.GAME.result;
    },

    gameResultTime() {
      return this.GAME.resultTime;
    },

    setFieldWidth() {
      if (this.GAME.cards === undefined) { return '100px' }
      const amountOfCards = this.GAME.cards.length;
      const calcWidth = (koef) => 130 * koef + 25 * koef;
      if (amountOfCards <= 4) {
        return `${calcWidth(amountOfCards)}px`
      }
      if (amountOfCards <= 12) {
        return `${calcWidth(Math.ceil(amountOfCards / 2))}px`
      }
      return `${calcWidth(6)}px`;
    },

    getCurrentLevel() {
      return this.FIELD.level;
    },

    getAmountOfLevels() {
      return this.FIELD.amountOfLevels;
    }
  },
  methods: {
    ...mapActions(['GET_DATA', 'CLEAR_STATE']),

    async init() {
      await this.GET_DATA();
      this.FIELD = new Field(this.getData)
      this.createGame();
    },

    gameStarted() {
      this.GAME.startGame();
    },

    gameStoped() {
      this.GAME.pauseGame();
    },

    gameFinished() {
      this.GAME.closeCards();
      this.GAME.timer.stop();
      setTimeout(() => this.cleanField(), this.timeForShow);
    },

    cleanField() {
      this.GAME.clean();
      this.draw();
      this.attemptsForHint = 3;
    },

    restartGame() {
      this.gameFinished();
      setTimeout(() => this.gameStarted(), this.timeForShow);
    },

    createGame() {
      this.GAME = new Game(this.FIELD.getCardsForGame(), this.FIELD.time());
      this.GAME.setCardData();
      this.attemptsForHint = 3;
      this.draw();
    },

    clickedCard(card) {
      if (this.GAME.gameStatus !== 'start' || this.GAME.compare.length === 2 || this.isHintActivated) { return }
      this.GAME.clickOnCard(card);

      const isMatch = this.GAME.checkMatch();
      setTimeout(() => {
        if (isMatch === false) {
          this.GAME.compare.forEach(card => {
            this.GAME.reset(card);
          })
          this.GAME.compare.splice(0);
        }
      }, this.timeForShow)

      this.isFinish();
    },

    isFinish(lost=false) {
      if (lost) { return this.GAME.gameFinished('Lost') }
      if (this.GAME.checkWin()) { 
        this.GAME.timer.stop();
        setTimeout(() => this.GAME.gameFinished('Won'), this.timeForShow); 
      }
    },

    draw() {
      this.fieldForDraw = this.GAME.cardsData;
    },

    changeLevel(direction) {
      const level = this.FIELD.level;
      const amount = this.FIELD.amountOfLevels;
      let step;
      switch (direction) {
        case 'First':
          step = 1
          break;
      
        case 'Prev':
          step = level === 1 ? 1 : level - 1;
          break;

        case 'Next':
          step = level === amount ? amount : level + 1;
          break;

        case 'Last':
          step = amount; 
          break;

        default: break;
      }
      this.FIELD.changeLevel(step);
      this.createGame();
    },

    hint() {
      if (this.attemptsForHint === 0 || this.GAME.gameStatus !== 'start' || this.isHintActivated) { return }
      this.isHintActivated = true;
      this.GAME.compare.splice(0);
      this.GAME.showOrHideHint(true)
      setTimeout(() => this.GAME.showOrHideHint(false), this.timeForShow);
      setTimeout(() => { this.isHintActivated = false }, this.timeForShow * 2);
      this.attemptsForHint--;
    },

    cursor(card) {
      if (this.GAME.gameStatus !== 'start') { return {cursor: 'default'} }
      if (card.isMatch === null && card.isFlipped === null) { return {cursor: 'pointer'} }
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
  },
  beforeUnmount() {
    this.CLEAR_STATE();
  }
}
</script>

<style lang="scss" scoped>
.memoji {
	display: flex;
  align-items: center;
  flex: 1;

  &__game {
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center; 
  }

  &__instruction {
    flex-basis: rem(300);
    margin-right: 10px;
  }
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