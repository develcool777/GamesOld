<template>
  <div class="rps">
    <div class="rps__game">

      <section class="score-board">
        <span class="user-score">{{ userScore }}:</span>
        <span class="comp-score">{{ compScore }}</span>
      </section>

      <section class="result">
        <div class="between" v-if="getResultOfMove">
          <div class="block left">
            <p>UserMove</p>
            <p class="move" :style="user">{{ display.userMove }}</p>
          </div>
          <div class="block">
            <p>ComputerMove</p>
            <p class="move" :style="comp">{{ display.compMove }}</p>
          </div>
        </div>
        <p v-if="getResultOfMove">{{ display.result }}</p>
        <p v-else>User VS Computer. Who will win?</p>
      </section>

      <section class="choices">
          <div class="choice" v-for="(choice, i) in choices" :key="i">
              <img 
                :src="choice.src"
                :class="choice.class" 
                :alt="choice.alt"
                @click="play(choice.item)"
                draggable="false"
              >
          </div>
      </section>

      <section class="rps__analytics" v-if="getShowAnalitics">
        <table v-if="checkAnalitics">
          <caption class="rps__caption">Analitics</caption>
          <thead>
            <tr>
              <th colspan="2" v-for="(item, i) in headAnalitics.first" :key="i">{{ item.name }}</th>
            </tr>
            <tr>
              <th v-for="(item, i) in headAnalitics.second" :key="i">{{ item.name }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(obj, i) in analiticsData" :key="i">
              <td v-for="(value, key) in obj" :key="key">{{ value }}</td>
            </tr>
          </tbody>
        </table>
        <p v-else class="rps__nodata">Analitics is empty. Play more.</p>
      </section>

      <section class="rps__history" v-if="getShowHistory">
        <table v-if="historyData.length > 0">
          <caption class="rps__caption">History</caption>
          <thead>
            <tr>
              <th v-for="(item, i) in headHistory" :key="i">{{ item.name }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(obj, i) in historyData" :key="i">
              <td v-for="(value, key) in obj" :key="key">{{ value }}</td>
            </tr>
          </tbody>
        </table>
        <p v-else class="rps__nodata">History is empty. Play more.</p>
      </section>
    </div>  

    <Instruction class="rps__instruction"/>
  </div>
  <transition name="fade">
    <Loading v-if="loading" class="LOADING" :step="0.6"/>
  </transition>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapState, mapActions } = createNamespacedHelpers('rockPaperScissors');
import Game from '@/model/RockPaperScissors/game';
import Instruction from '@/components/RockPaperScissors/Instruction';
import Loading from '@/components/Loading' 
export default {
  name: 'RockPaperScissors',
  components: {
    Instruction,
    Loading
  },
  data() {
    return {
      game: {},
      display: {},
      choices: [
        { src: '', class: 'img', alt: 'rock', item: 'r' },
        { src: '', class: 'img', alt: 'paper', item: 'p' },
        { src: '', class: 'img', alt: 'scissors', item: 's' }
      ],
      headHistory: [
        { name: '№'},
        { name: 'User'},
        { name: 'Computer'},
        { name: 'Result'},
        { name: 'Score'}
      ],
      headAnalitics: {
        first: [
          { name: 'User' },
          { name: 'Computer' },
          { name: 'Draw' }
        ],
        second: [
          { name: 'Move' },
          { name: 'Amount of wins' },
          { name: 'Move' },
          { name: 'Amount of wins' },
          { name: 'Move' },
          { name: 'Amount of draws' },
        ]
      },
      historyData: [],
      analiticsData: [],
      loading: true
    }
  },
  watch: {
    clear: function(newVal) {
      if (newVal) {
        this.clearField();
      }
    }
  },
  async created() {
    setTimeout(() => {this.loading = false}, 1000);
    await this.init();
  },
  computed: {
    ...mapState(['clear', 'showHistory', 'showAnalitics']),
    ...mapGetters([
      'getImpossible', 'getEasy', 'getWithoutDraw', 
      'getResultOfMove', 'getShowHistory', 'getShowAnalitics', 'getChoices'
    ]), 
    userScore() {
      return this.game.userScore;
    },
    compScore() {
      return this.game.computerScore;
    },
    user() {
      return this.display.res === 'user' ? {color: 'green'} : {color: 'red'};
    },
    comp() {
      return this.display.res === 'comp' ? {color: 'green'} : {color: 'red'};
    },
    checkAnalitics() {
      return this.game.history.length > 0
    }
  },
  methods: {
    ...mapActions(['CHANGE_CLEAR', 'CHANGE_SHOW_HISTORY', 'CHANGE_RESULT_OF_MOVE', 'SET_CHOICES']),
    async init() {
      await this.SET_CHOICES()
      this.setImages();
      this.game = new Game();
    },
    play(move) {
      let moves;
      if (this.getImpossible) {
        moves = this.game.impossibleMode(move);
      }
      else if (this.getEasy) {
        moves = this.game.easyMode(move);
      }
      else if (this.getWithoutDraw) {
        moves = this.game.withoutDrawMode(move);
      } else {
        moves = this.game.normalGame(move);
      }
      this.game.play(moves.user, moves.comp);
      this.displayResult();
      this.CHANGE_RESULT_OF_MOVE(true);
      this.setAnaliticsData();
      this.setHistoryData();
    },

    clearField() {
      this.game.clean();
      this.CHANGE_CLEAR(false);
      this.display = {};
      this.historyData = [];
      this.analiticsData = [];
    },

    convertMove(move) {
      return move === 'r' ? 'Rock' : move === 'p' ? 'Paper' : 'Scissors';
    },

    convertResult(info) {
      if (info === 'draw') {
        return `It's a draw`
      }
      if (info === 'user') {
        return `User win`
      }
      if (info === 'comp') {
        return `Computer win`
      }
    },

    displayResult() {
      const history = this.game.history;
      const info = history[history.length - 1];
      this.display.userMove = this.convertMove(info.userMove);
      this.display.compMove = this.convertMove(info.compMove);
      this.display.result = this.convertResult(info.result);
      this.display.res = info.result;
    },

    setHistoryData() {
      const history = this.game.history;
      const arr = []
      history.forEach((item, i) => {
        const obj = {};
        obj.id = i + 1;
        obj.userMove = this.convertMove(item.userMove);
        obj.compMove = this.convertMove(item.compMove);
        obj.result = this.convertResult(item.result);
        obj.score = `${item.userScore}:${item.compScore}`
        arr.unshift(obj);
      })
      this.historyData = arr;
    },

    setAnaliticsData() {
      const data = this.game.analytics();
      let res = [];
      for (let key in data) {
        const entries = Object.entries(data[key]);
        entries.forEach((arr, i) => {
          if (res[i] === undefined) {
            res[i] = [];
          }
          res[i].push(arr)
        })
      }
      this.analiticsData = res.map(arr => {
        return arr.flat().map(item => {
          if (typeof item === 'string') {
            return this.convertMove(item);
          }
          return item; 
        })
      })
    },

    setImages() {
      const imgs = this.getChoices;
      this.choices = this.choices.map(c => {
        c.src = imgs[c.alt];
        return c;
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.rps {
  @include BasicGrid(flex-start);
  background: #24272E;
  &__caption {
    font-size: rem(40);
  }
  &__nodata {
    color: $white;
    font-size: rem(20);
    margin: rem(20) 0;
  }
}

.score-board {
  position: relative;
  width: 200px;
  padding: 10px 0;
  margin-top: rem(20);
  border: 3px solid $white;
  border-radius: 5px;
  color: $white;
  font-size: 46px;
  text-align: center;
}

.score-board:before {
  content: "user";
  position: absolute;
  font-size: 20px;
  padding: 5px 10px;
  border-radius: 5px;
  background: #E25840;
  left: 0;
  top: 50%; 
  transform: translate(-50%, -50%);
}

.score-board:after {
  content: "comp";
  position: absolute;
  font-size: 20px;
  padding: 5px 10px;
  border-radius: 5px;
  background: #E25840;
  top: 50%;
  right: 0;
  transform: translate(50%, -50%);
}

.user-score, .comp-score {
  color: $white;
}

.choices {
  text-align: center;
  margin: 50px 0 20px;
}

.choice {
  display: inline-block;
  margin: 0 20px;
  border: 5px solid white;
  border-radius: 50%;
  cursor: pointer;
  transition-duration: .5s;
}

.choice:hover {
  border-color: red;
}

.img {
  display: block;
  width: 100px;
  height: 100px;
  background: grey;
  border-radius: 50%;
  transition-duration: .5s;
}

.choice:hover > .img {
  transform: rotate(-90deg) 
} 

.result {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 800px;
  margin: rem(50) 0 rem(75);
  font-size: 40px;
  color: $white;
}

.between {
  display: flex;
  justify-content: space-between;
  width: inherit;
}

.move {
  text-align: center;
}

.left {
  padding-left: rem(80);
}

table {
  border-collapse: collapse;
  margin: 50px auto;
  color: white;
}

th {
  padding: 10px 20px;
  border: 1px solid white;
  font-size: 20px;
  background: #E25840;
}

td {
  border: 1px solid white;
  padding: 10px 20px; 
  font-size: 14px;
  text-align: center;
}

tr:hover {
  background-color: tomato;
  cursor: default;
}
</style>