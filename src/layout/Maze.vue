<template>
  <div class="maze">
    <div class="maze__position">
      <div class="maze__field" key="whatif2">
        <div class="maze__row" v-for="(row, i) in Field" :key="i">
          <div :class="cell.class" v-for="(cell, j) in row" :key="j"></div>
        </div>
      </div>
    </div>
    <Instruction class="maze__instruction"/>
  </div>
  <Result :status="isModal" v-on:close="cleanField()"/>
  <!-- <div class="empty"></div>
  <div class="block"></div>
  <div class="player"></div> -->
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
      isModal: false
    }
  },
  created() {
    this.createGame();
    this.gameLoop();
  },
  methods: {
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
      this.Field = field;
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
      console.log(this.game.history);
    },
    gameLoop() {
      document.addEventListener('keyup', function(event){
        keyPressed(event.key)
      });
      const keyPressed = (key) => {
        const [prevX, prevY] = this.game.player.getPosition();
        if (key === 'ArrowRight') {
          this.game.moves('D');
        }
        if (key === 'ArrowLeft') {
          this.game.moves('A');
        }
        if (key === 'ArrowDown') {
          this.game.moves('S');
        }
        if (key === 'ArrowUp') {
          this.game.moves('W');
        }
        const [curentX, curentY] = this.game.player.getPosition();
        this.draw(prevX, prevY, curentX, curentY);
        if (this.game.cheakWin(curentX, curentY)) {
          this.isModal = true;
        }
      }
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
    }
  }
}
</script>

<style lang="scss">
.maze {
  @include Flex(space-between);
  height: 100vh;
  margin-top: rem(-74); // haeder height
  &__row {
    @include Flex(center);
  }
  &__instruction {
    width: rem(300);
  }
  &__position {
    width: 100%;
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
.red {
  @include Size();
  background: red;;
}
</style>