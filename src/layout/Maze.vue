<template>
  <div class="maze" :style="{marginTop: `${-headerHeight}px`}">
    <div class="maze__position">
      <div class="maze__field" key="whatif2">
        <div class="maze__row" v-for="(row, i) in Field" :key="i">
          <div :class="cell.class" v-for="(cell, j) in row" :key="j"></div>
        </div>
      </div>
    </div>
    <Instruction 
      class="maze__instruction" 
      :style="{marginTop: `${headerHeight}px`}"
      :arrow="arrowClicked"
      :state="stop"
      :time="Time"
      :triger="isFinished"
      v-on:startGame="startLoop()"
      v-on:stopGame="stopLoop($event)" 
      v-on:click="keyPressed($event)"
    />
  </div>
  <Result 
    :result="result"
    :status="isModal"
    v-on:close="cleanField()"
  />
  <!-- <div class="test"></div> -->
  <!-- <div class="block"></div> -->
  <!-- <div class="player"></div>  -->
</template>

<script>
import Game from '@/model/game'
import field from '@/maps/field'
import Result from '@/components/Maze/Result'
import Instruction from '@/components/Maze/Instruction'
export default {
  components: {
    Instruction,
    Result
  },
  data() {
    return {
      Field: field,
      game: {},
      arrowClicked: 0,
      isModal: false,
      stop: true,
      headerHeight: 0,
      Time: {str: '01:00', seconds: 59},
      isFinished: false,
      result: ''
    }
  },
  created() {
    this.createGame();
    this.getHeaderHeight();
  },
  methods: {
    getHeaderHeight() {
      this.emitter.on("headerHeight", (h) => {
        console.log('Maze',h);
        this.headerHeight = h + 1; // 
      });
    },
    createGame() {
      this.game = new Game(...this.getFieldInMatrix());
      this.game.init();
    },
    cleanField() {
      this.game.clean();
      this.game.init();
      const modelField = this.game.field;
      const field = modelField.map((arr) => {
        return arr.map((item, j) => {
          const obj =  {
            id: j
          };
          if (item === 1) {
            obj.class = 'block';
          }
          if (item === 0) {
            obj.class = 'empty';
          }
          if (item === '@') {
            obj.class = 'startPosition player';
          }
          if (item === '') {
            obj.class = 'winPosition';
          }
          return obj;
        })
      })
      this.isFinished = false;
      this.Field = field;
      this.Time = {str: '01:00', seconds: 59};
      this.isModal = false;
    },
    draw(prevX, prevY, curentX, curentY) {
      const insertClass = (x, y, className) => {
        const classArr = this.Field[x][y].class.split(' ');
        if (classArr.length > 1) {
          classArr[1] = className;
          this.Field[x][y].class = classArr.join(' ');
        } else {
          this.Field[x][y].class += ` ${className}`
        }
      }
      insertClass(prevX, prevY, 'path');
      insertClass(curentX, curentY, 'player');
    },
    startLoop() {
      console.log('starloop');
      this.stop = false;
      window.addEventListener('keyup', this.keyPressed); 
    },
    setterForStop(result) {
      this.result = result;
      this.isModal = true;
      this.isFinished = true;
    },
    stopLoop(isLose) {
      if (isLose) {
        this.setterForStop('Lose');
      }
      this.stop = true;
      window.removeEventListener('keyup', this.keyPressed);
    },
    keyPressed(event) {
      let key;
      if (typeof event === 'string') {
        key = event;
      } else {
        key = event.key;
      }
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
      console.log('keyPressed');
      const [curentX, curentY] = this.game.player.getPosition();
      this.draw(prevX, prevY, curentX, curentY);
      if (this.game.cheakWin(curentX, curentY)) {
        this.setterForStop('Win');
      }
      setTimeout(() => { this.arrowClicked = 0 }, 250);
    },
    getFieldInMatrix() {
      const startPos = {};
      const endPos = {};
      const matrix = field.map((arr, i) => {
        return arr.map((item, j) => {
          if (item.class.split(' ')[0] === 'startPosition') {
            startPos.x = i;
            startPos.y = j;
          }
          if (item.class.split(' ')[0] === 'winPosition') {
            endPos.x = i;
            endPos.y = j;
          }
          if (item.class === 'block') {
            return 1;
          } else {
            return 0;
          }
        })
      })
      return [matrix, startPos, endPos];
    },
  }
}
</script>

<style lang="scss">
.maze {
  display: flex;
  justify-content: space-between;
  height: 100vh;
  // margin-top: rem(-74); // haeder height
  &__row {
    @include Flex(center);
  }
  &__instruction {
    flex-basis: rem(265);
    // margin-top: rem(74); // haeder height
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