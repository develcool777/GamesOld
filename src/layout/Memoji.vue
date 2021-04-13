<template>
  <div class="memoji">
    <div class="memoji__position">
      <div class="memoji__field">
        <div class="scene" v-for="(item, i) in fieldForDraw" :key="i">
          <div class="card" :class="{isFlipped: item.isMatch}" :id="item.id">
            <div class="card__face card__face--front" @click="clickedCard(item)"></div>
            <div class="card__face card__face--back" :class="{match: item.isMatch}" @click="clickedCard(item)">
              <span :class="item.class"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="memoji__instruction">rgbr</div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
//mapState, 
const { mapActions, mapGetters } = createNamespacedHelpers('memoji');
import DATA from '@/data/dataForMemoji';
import Field from '@/model/memoji/field';
import Game from '@/model/memoji/game';
export default {
  name: 'Memoji',
  data() {
    return {
      field: {},
      game: {},
      fieldForDraw: []
    }
  },
  created() {
    this.field = new Field(DATA);
    this.createGame();
  },
  computed: {
    ...mapGetters(['getItemsForCompare'])
  },
  methods: {
    ...mapActions(['INIT_STATE', 'ADD_ITEMS_FOR_COMPARE', 'REMOVE_ITEMS_FOR_COMPARE']),
    createGame() {
      this.game = new Game(this.field.getCardsForGame());
      this.game.setCardData();
      this.fieldForDraw = this.game.cardsForDraw();
      const obj = {
        time: this.field.time(),
        level: this.field.level,
        levels: this.field.amountOfLevels()
      }
      this.INIT_STATE(obj);
    },
    clickedCard(item) {
      const card = document.getElementById(`${item.id}`);
      if (card.classList.length < 2 && this.getItemsForCompare.length < 2) {
        this.ADD_ITEMS_FOR_COMPARE(item);
        card.classList.add('isFlipped');
        if (this.getItemsForCompare.length === 2) {
          this.check();
        }
      }
    },
    check() {
      if (this.game.checkMatch(...this.getItemsForCompare)) {
        this.REMOVE_ITEMS_FOR_COMPARE();
        this.fieldForDraw = this.game.cardsForDraw();
        return;
      } 
      const [first, second] = this.getItemsForCompare;
      const removeClass = item => {
        const element = document.getElementById(`${item.id}`);
        element.classList.remove('isFlipped');
        element.lastChild.classList.remove('noMatch');
      }
      const addClass = item => document.getElementById(`${item.id}`).lastChild.classList.add('noMatch');
      addClass(first);
      addClass(second);
      this.REMOVE_ITEMS_FOR_COMPARE();
      setTimeout(() => {
        removeClass(first);
        removeClass(second);
      }, 750);   
    }
  }
}
</script>

<style lang="scss">
.memoji {
  display: flex;
  &__position {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center; 
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
  cursor: pointer;
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
  cursor: pointer;
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