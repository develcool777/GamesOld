<template>
  <div class="maze">
    <div class="maze__game">
      <div class="maze__field">
        <div class="maze__row" v-for="(row, i) in fieldForDraw" :key="i">
          <div :class="cell.class" v-for="(cell, j) in row" :key="j"></div>
        </div>
      </div>
    </div>
    <Instruction 
      class="maze__instruction" 
      :timer="timer"
      :gameStatus="status"
      v-on:startGame="startLoop()"
      v-on:stopGame="stopLoop()"
      v-on:restart="restartGame()"
      v-on:finishGame="cleanField()"
      v-on:changeLevel="changeLevel($event)"
      v-on:clicked="arrowPressed($event)"
    />

  </div>
  <ResultMaze
    :gameResult="result"
    :status="showModal"
    :timeInMs="resultTime"
    v-on:changeLevel="changeLevel($event)"
    v-on:restart="restartGame()"
    v-on:close="cleanField()"
  />
  <transition name="fade">
    <Loading v-if="loading" class="LOADING" :step="1.5"/>
  </transition>  
</template>
<script>
import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapState, mapGetters } = createNamespacedHelpers('maze');
import Field from '@/model/maze/field' 
import Game from '@/model/maze/game'
import ResultMaze from '@/components/Maze/Result'
import Instruction from '@/components/Maze/Instruction'
import Loading from '@/components/Loading'
export default {
  components: {
    Instruction,
    ResultMaze,
    Loading
  },
  data() {
    return {
      field: {},
      game: {},
      fieldForDraw: [],
      headerHeight: 0,
      loading: true,
      result: '',
      resultTime: 0,
      showModal: false,
      status: '',
      gameCreated: false,
      timer: '00:00'
    }
  },
  async created() {
    setTimeout(() => {this.loading = false}, 1000);
    await this.init();
  },
  watch: {
    gameStatus(newStatus) {
      if (newStatus === 'finish') {
        this.showModal = true;
      }
      this.status = newStatus;
    },
    gameTime(newTime) {
      if (newTime === '00:00') { 
        this.isFinish(true);
      }
      this.timer = newTime;
    },
    showPath: function(newValue) {
      this.fieldForDraw = this.field.generateFieldWith(this.game.field, newValue, this.getShowHint);
    },
    showHint: function(newVal) {
      this.fieldForDraw = this.field.generateFieldWith(this.game.field, this.getShowPath, newVal);
    }
  },
  computed: {
    ...mapState(['level', 'showPath', 'showHint']),
    ...mapGetters(['getShowPath', 'getShowHint', 'getData']),
    gameStatus() {
      return this.game.gameStatus;
    },
    gameTime() {
      if (!this.gameCreated) { return '0:00' }
      return this.game.timer.timeForPrint;
    },
  },
  methods: {
    ...mapActions([
      'INIT_STATE', 'CHANGE_ARROW', 'SET_DATA'
    ]),

    async init() {
      await this.SET_DATA();
      this.field = new Field(this.getData);
      this.createGame();
    },

    createGame() {
      const obj = {
        level: this.field.level,
        amountOfLevels: this.field.amountOfLevels(),
      }
      this.INIT_STATE(obj);
      const [field, start, end, time] = this.field.dataForGame();
      this.game = new Game(field, start, end, time);
      this.fieldForDraw = this.field.generateFieldForDraw(field, start, end);
      this.game.initGame();
      this.gameCreated = true;
    },

    changeLevel(step) {
      this.field.changeLevel(step);
      this.createGame();
      this.showModal = false;
    },

    restartGame() {
      this.cleanField();
      this.startLoop();
    },

    cleanField() {
      this.stopLoop();
      this.game.clean();
      this.game.initGame();
      const [field, start, end] = this.field.dataForGame();
      this.fieldForDraw = this.field.generateFieldForDraw(field, start, end);
      this.showModal = false;
    },

    startLoop() {   
      this.game.startGame();
      window.addEventListener('keyup', this.arrowPressed); 
    },

    stopLoop() {
      this.game.stopGame();
      window.removeEventListener('keyup', this.arrowPressed);
    },

    arrowPressed(event) {
      const eventChecker = e => typeof e === 'string' ? e : e.key;
      const key = eventChecker(event);
      const [prevX, prevY, curentX, curentY] = this.keyPressed(key);
      this.draw(prevX, prevY, curentX, curentY);

      this.isFinish(false, curentX, curentY);
    },

    draw(prevX, prevY, curentX, curentY) {
      const insertClass = (x, y, className) => {
        const classArr = this.fieldForDraw[x][y].class.split(' ');
        if (classArr.length > 1) {
          classArr[1] = className;
          this.fieldForDraw[x][y].class = classArr.join(' ');
        } else {
          this.fieldForDraw[x][y].class += ` ${className}`
        }
      }
      let path = this.getShowPath ? 'path' : '';
      insertClass(prevX, prevY, path);
      insertClass(curentX, curentY, 'player');
    },

    keyPressed(key) {
      const [prevX, prevY] = this.game.player.getPosition();
      if (key === 'ArrowUp') {
        this.game.moves('W');
        this.CHANGE_ARROW(1)
      }
      if (key === 'ArrowLeft') {
        this.game.moves('A');
        this.CHANGE_ARROW(2)
      }
      if (key === 'ArrowDown') {
        this.game.moves('S');
        this.CHANGE_ARROW(3)
      }
      if (key === 'ArrowRight') {
        this.game.moves('D');
        this.CHANGE_ARROW(4)
      }

      setTimeout(() => { this.CHANGE_ARROW(0) }, 250);
      const [curentX, curentY] = this.game.player.getPosition();
      return [prevX, prevY, curentX, curentY];
    },

    isFinish(lost=false, x, y) {
      if (lost) { 
        this.game.gameFinished('Lost');
        this.result = this.game.result;
      }
      if (!lost && this.game.checkWin(x, y)) {
        this.game.gameFinished('Won');
        this.result = this.game.result;
        this.resultTime = this.game.resultTime;
      }
      if (this.game.gameStatus === 'finish') {
        window.removeEventListener('keyup', this.arrowPressed);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.maze {
  @include BasicGrid();
  &__row {
    @include Flex(center);
  }
}
.empty {
  @include Size();
}
.block {
  @include Size();
  background: $black;
}
.winPosition {
  @include Size();
  background: $win;
}
.player {
  position: relative;
}
.player::after {
  position: absolute;
  content: "";
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: rem(15);
  height: rem(15);
  border-radius: rem(5);
  background: darkgreen;
}
.path {
  position: relative;
}
.hint {
  position: relative;
}
.path::after, .hint::after {
  position: absolute;
  content: "";
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: rem(10);
  height: rem(10);
  border-radius: 50%;
}

.path::after {
  background: green;
}

.hint::after {
  background: red;
}
</style>