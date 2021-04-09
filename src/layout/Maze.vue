<template>
  <div class="maze" :style="{marginTop: `${-headerHeight}px`}">
    <div class="maze__position">
      <div class="maze__field">
        <div class="maze__row" v-for="(row, i) in fieldForDraw" :key="i">
          <div :class="cell.class" v-for="(cell, j) in row" :key="j"></div>
        </div>
      </div>
    </div>
    <Instruction 
      class="maze__instruction" 
      :style="{marginTop: `${headerHeight}px`}"
      v-on:changeLevel="changeLevel($event)"
      v-on:clicked="actOfUser($event)"
      v-on:restart="restartGame()"
    />
  </div>
  <Result
    v-on:changeLevel="changeLevel($event)"
    v-on:restart="restart()"
    v-on:close="cleanField()"
  />
</template>
<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import DATA from '@/maps/dataForMaze'
import Field from '@/model/field' 
import Game from '@/model/game'
import Result from '@/components/Maze/Result'
import Instruction from '@/components/Maze/Instruction'
export default {
  components: {
    Instruction,
    Result
  },
  data() {
    return {
      field: {},
      game: {},
      fieldForDraw: [],
      headerHeight: 0
    }
  },
  created() {
    this.field = new Field(DATA);
    this.createGame();
    this.getHeaderHeight();
  },
  watch: {
    isPlaying: function(newValue) {
      console.log('MAZE IsPlaying watch');
      if (newValue) {
        this.startLoop();
      } else {
        this.stopLoop();
      }
    },
    showPath: function(newValue) {
      let path = '';
      if (newValue) {
        path = 'path';
      } 
      this.fieldForDraw = this.field.generateFieldWithPath(this.game.field, path);
    }
  },
  computed: {
    ...mapState(['level', 'isPlaying', 'showPath']),
    ...mapGetters(['getShowPath'])
  },
  methods: {
    ...mapActions([
      'INIT_STATE', 'END_GAME', 'CLEAN_GAME', 'CHANGE_ISPLAYING', 
      'CHANGE_RESTART', 'CHANGE_ARROW', 'CHANGE_STOP_CLICK'
    ]),
    getHeaderHeight() {
      this.emitter.on("headerHeight", h => {
        this.headerHeight = h + 1; // 
      });
    },
    createGame() {
      const obj = {
        level: this.field.level,
        seconds: this.field.time(),
        amountOfLevels: this.field.amountOfLevels(),
      }
      console.log({obj});
      this.INIT_STATE(obj);
      const [field, start, end] = this.field.dataForGame();
      this.game = new Game(field, start, end)
      this.fieldForDraw = this.field.generateFieldForDraw(field, start, end);
      this.game.initGame();
    },
    changeLevel(step) {
      this.field.changeLevel(step);
      this.createGame();
      console.log('changed');
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
      console.log('startloop');
      window.addEventListener('keyup', this.actOfUser); 
    },
    stopLoop() {
      console.log('stoploop');
      this.CHANGE_STOP_CLICK(true)
      window.removeEventListener('keyup', this.actOfUser);
    },
    actOfUser(event) {
      const eventChecker = e => {
        if (typeof e === 'string') {
          return e;
        } 
        return e.key;
      }
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
      if (this.getShowPath) {
        insertClass(prevX, prevY, 'path');
      } else {
        insertClass(prevX, prevY, '');
      }
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
      console.log(this.game.field);
      setTimeout(() => { this.CHANGE_ARROW(0) }, 250);
      return [prevX, prevY];
    }
  }
}
</script>

<style lang="scss">
.maze {
  display: flex;
  justify-content: space-between;
  height: 100vh;
  &__row {
    @include Flex(center);
  }
  &__instruction {
    flex-basis: rem(265);
    border-left: 5px solid $black;
  }
  &__position {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center; 
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
.startPosition {
  @include Size();
  background: $start;
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
.path::after {
  position: absolute;
  content: "";
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: rem(10);
  height: rem(10);
  border-radius: 50%;
  background: green;

  // font-size: 30px;
}

</style>