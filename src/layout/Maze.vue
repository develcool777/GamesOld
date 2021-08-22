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
      v-on:changeLevel="changeLevel($event)"
      v-on:clicked="actOfUser($event)"
      v-on:restart="restartGame()"
    />
    <transition name="fade">
      <Loading v-if="loading" class="maze__loading" :step="1.5"/>
    </transition>  
  </div>
  <ResultMaze
    v-on:changeLevel="changeLevel($event)"
    v-on:restart="restart()"
    v-on:close="cleanField()"
  />
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
      loading: true
    }
  },
  async created() {
    setTimeout(() => {this.loading = false}, 1000);
    await this.init();
  },
  watch: {
    isPlaying: function(newValue) {
      return newValue ? this.startLoop() : this.stopLoop();
    },
    showPath: function(newValue) {
      this.fieldForDraw = this.field.generateFieldWith(this.game.field, newValue, this.getShowHint);
    },
    showHint: function(newVal) {
      this.fieldForDraw = this.field.generateFieldWith(this.game.field, this.getShowPath, newVal);
    }
  },
  computed: {
    ...mapState(['level', 'isPlaying', 'showPath', 'showHint']),
    ...mapGetters(['getShowPath', 'getShowHint', 'getData'])
  },
  methods: {
    ...mapActions([
      'INIT_STATE', 'END_GAME', 'CLEAN_GAME', 'CHANGE_ISPLAYING', 
      'CHANGE_RESTART', 'CHANGE_ARROW', 'CHANGE_STOP_CLICK', 'SET_DATA'
    ]),
    async init() {
      await this.SET_DATA();
      this.field = new Field(this.getData);
      this.createGame();
    },
    createGame() {
      const obj = {
        level: this.field.level,
        seconds: this.field.time(),
        amountOfLevels: this.field.amountOfLevels(),
      }
      this.INIT_STATE(obj);
      const [field, start, end] = this.field.dataForGame();
      this.game = new Game(field, start, end)
      this.fieldForDraw = this.field.generateFieldForDraw(field, start, end);
      this.game.initGame();
    },
    changeLevel(step) {
      this.field.changeLevel(step);
      this.createGame();
    },
    restartGame() {
      window.removeEventListener('keyup', this.actOfUser);
      this.restart();
    },
    restart() {
      this.cleanField();
      this.CHANGE_RESTART(true);
    },
    cleanField() {
      const [field, start, end] = this.field.dataForGame();
      this.game.clean();
      this.game.initGame();
      this.fieldForDraw = this.field.generateFieldForDraw(field, start, end);
      this.CLEAN_GAME();
    },
    startLoop() {   
      this.CHANGE_STOP_CLICK(false)
      window.addEventListener('keyup', this.actOfUser); 
    },
    stopLoop() {
      this.CHANGE_STOP_CLICK(true)
      window.removeEventListener('keyup', this.actOfUser);
    },
    actOfUser(event) {
      const eventChecker = e => typeof e === 'string' ? e : e.key;
      const key = eventChecker(event);
      const [prevX, prevY] = this.keyPressed(key);
      const [curentX, curentY] = this.game.player.getPosition();
      this.draw(prevX, prevY, curentX, curentY);
      if (this.game.cheakWin(curentX, curentY)) {
        this.END_GAME('Win');
      }
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
      // console.log(this.game.generateWinPath());
      setTimeout(() => { this.CHANGE_ARROW(0) }, 250);
      return [prevX, prevY];
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
  &__loading {
    position: absolute;
    @include Flex(center);
    width: 100%;
    height: 100%;
    background: darkslategrey;
    z-index: 100;
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