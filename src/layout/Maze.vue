<template>
  <div class="maze" :style="{marginTop: `${-headerHeight}px`}">
    <div class="maze__position">
      <div class="maze__field" key="whatif2">
        <div class="maze__row" v-for="(row, i) in fieldForDraw" :key="i">
          <div :class="cell.class" v-for="(cell, j) in row" :key="j"></div>
        </div>
      </div>
    </div>
    <Instruction 
      class="maze__instruction" 
      :style="{marginTop: `${headerHeight}px`}"
      :arrow="arrowClicked"
      :stopClick="stopClickArrows"
      :time="timer"
      :triger="isFinished"
      :level="level"
      v-on:startGame="startLoop()"
      v-on:stopGame="stopLoop($event)" 
      v-on:click="keyPressed($event)"
      v-on:changeLevel="changeLevel($event)"
    />
  </div>
  <Result 
    :result="result"
    :status="isFinished"
    v-on:close="cleanField()"
  />
</template>

<script>
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
      timer: {},
      level: 1,
      arrowClicked: 0,
      stopClickArrows: true,
      headerHeight: 0,
      isFinished: false,
      result: ''
    }
  },
  created() {
    this.field = new Field(DATA);
    this.createGame();
    this.getHeaderHeight();
  },
  methods: {
    getHeaderHeight() {
      this.emitter.on("headerHeight", (h) => {
        this.headerHeight = h + 1; // 
      });
    },
    createGame() {
      this.fieldForDraw = this.field.generateFieldForDraw();
      this.timer = this.field.time();
      this.level = this.field.level;
      this.game = new Game(...this.field.dataForGame());
      this.game.init();
    },
    cleanField() {
      this.game.clean();
      this.game.init();
      this.isFinished = false;
      this.fieldForDraw = this.field.generateFieldForDraw();
      this.timer = this.field.time();
    },
    changeLevel(step) {
      this.field.changeLevel(step);
      this.createGame();
      console.log('changed');
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
      insertClass(prevX, prevY, 'path');
      insertClass(curentX, curentY, 'player');
    },
    setterForStop(result) {
      this.result = result;
      this.isFinished = true;
    },
    startLoop() {
      console.log('starloop');
      this.stopClickArrows = false;
      window.addEventListener('keyup', this.keyPressed); 
    },
    stopLoop(isLose) {
      if (isLose) {
        this.setterForStop('Lose');
      }
      this.stopClickArrows = true;
      window.removeEventListener('keyup', this.keyPressed);
    },
    keyPressed(event) {
      const eventChecker = e => {
        if (typeof e === 'string') {
          return e;
        } 
        return e.key;
      }
      const key = eventChecker(event);
      const [prevX, prevY] = this.game.player.getPosition();
      if (key === 'ArrowUp') {
        this.game.moves('W');
        this.arrowClicked = 1
      }
      if (key === 'ArrowLeft') {
        this.game.moves('A');
        this.arrowClicked = 2
      }
      if (key === 'ArrowDown') {
        this.game.moves('S');
        this.arrowClicked = 3
      }
      if (key === 'ArrowRight') {
        this.game.moves('D');
        this.arrowClicked = 4
      }
      const [curentX, curentY] = this.game.player.getPosition();
      this.draw(prevX, prevY, curentX, curentY);
      if (this.game.cheakWin(curentX, curentY)) {
        this.setterForStop('Win');
      }
      setTimeout(() => { this.arrowClicked = 0 }, 250);
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
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  content: "@";
  font-size: 30px;
}
.path {
  position: relative;
}
.path::after {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  content: "*";
  font-size: 30px;
}

</style>