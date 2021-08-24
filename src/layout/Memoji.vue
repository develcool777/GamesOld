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
      :timer="timer"
      :attempts="attemptsForHint"
      :gameStatus="status"
      v-on:startGame="gameStarted()"
      v-on:stopGame="gameStoped()"
      v-on:finishGame="gameFinished()"
      v-on:changeLevel="changeLevel($event)"
      v-on:restart="restartGame()"
      v-on:showHint="hint()"
    />
  </div>

  <ResultMemoji
    :gameResult="result"
    :status="showModal"
    :timeInMs="resultTime"
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
export default {
  name: 'Memoji',

  components: {
    Instruction,
    ResultMemoji,
    Loading
  },

  data() {
    return {
      field: {},
      game: {},
      gameCreated: false,
      fieldForDraw: [],
      timeForShow: 1000,
      timer: '0:00',
      resultTime: 0,
      result: '',
      showModal: false,
      loading: true,
      attemptsForHint: 3,
      status: ''
    }
  },

  watch: {
    gameTime(newTime) {
      if (newTime === '00:00') { 
        this.isFinish(true);
      }
      this.timer = newTime;
    },

    gameStatus(newStatus) {
      if (newStatus === 'finish') {
        this.showModal = true;
        this.game.closeCards();
      }
      this.status = newStatus;
    },
  },

  async created() {
    setTimeout(() => {this.loading = false}, 2000);
    await this.init();
  },

  computed: {
    ...mapGetters(['getData']),

    gameTime() {
      if (!this.gameCreated) { return '0:00' }
      return this.game.timer.timeForPrint;
    },

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
    },

    gameStatus() {
      return this.game.gameStatus
    } 
  },

  methods: {
    ...mapActions(['INIT_STATE', 'GET_DATA']),

    async init() {
      await this.GET_DATA();
      this.field = new Field(this.getData)
      this.createGame();
    },

    gameStarted() {
      this.game.startGame();
    },

    gameStoped() {
      this.game.pauseGame();
    },

    gameFinished() {
      this.game.closeCards();
      this.cleanField();
    },

    createGame() {
      this.game = new Game(this.field.getCardsForGame(), this.field.time());
      this.game.setCardData();
      this.attemptsForHint = 3;
      this.draw();
      const obj = {
        level: this.field.level,
        levels: this.field.amountOfLevels()
      }
      this.INIT_STATE(obj);
      this.gameCreated = true;
    },

    clickedCard(card) {
      if (this.game.gameStatus !== 'start' || this.game.compare.length === 2) { return }

      this.game.clickOnCard(card);

      const isMatch = this.game.checkMatch();
      setTimeout(() => {
        if (isMatch === false) {
          this.game.compare.forEach(card => {
            this.game.reset(card);
          })
          this.game.compare.splice(0);
        }
      }, this.timeForShow)

      this.isFinish();
    },

    isFinish(lost=false) {
      if (lost) {
        this.game.gameFinished('Lost');
        this.result = this.game.result;
      }
      if (this.game.checkWin() && !lost) {
        setTimeout(() => {
          this.game.gameFinished('Won');
          this.result = this.game.result;
          this.resultTime = this.game.resultTime;
        }, this.timeForShow)
      }
    },

    draw() {
      this.fieldForDraw = this.game.cardsData;
    },

    changeLevel(step) {
      if (!['', 'finish'].includes(this.game.gameStatus)) { return }
      this.field.changeLevel(step);
      this.createGame()
      this.showModal = false;
    },

    cleanField() {
      this.game.clean();
      this.draw();
      this.showModal = false;
    },

    restartGame() {
      this.cleanField();
      this.gameStarted();
    },

    hint() {
      if (this.attemptsForHint === 0  || this.game.gameStatus !== 'start') { return }
      const func = bool => this.game.showOrHideHint(bool)
      func(true);
      setTimeout(() => func(false), this.timeForShow);
      this.attemptsForHint--;
    },

    cursor(card) {
      if (this.game.gameStatus !== 'start') { return {cursor: 'default'} }
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