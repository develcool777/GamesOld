<template>
  owdnciow
  <div class="maze__field" key="whatif2">
    <div class="maze__row" v-for="(row, i) in Field" :key="i">
      <div :class="cell.class" v-for="(cell, j) in row" :key="j"></div>
    </div>
  </div>
  <!-- <div class="empty"></div>
  <div class="block"></div>
  <div class="player"></div> -->
</template>

<script>
import Game from '@/model/game'
import field from '@/maps/field'
export default {
  data() {
    return {
      Field: field,
      game: {},
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
      this.game.log();
    },
    draw() {
      const modelField = this.game.field;
      // console.log('!', modelField);
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
          if (item === '*') {
            obj.class = 'empty path';
          }
          if (item === '@') {
            obj.class = 'empty player';
          }
          return obj;
        })
      })
      this.Field = field;
    },
    gameLoop() {
      document.addEventListener('keyup', function(event){
        // console.log('Key: ', event.key);
        keyPressed(event.key)
      });
      const keyPressed = (key) => {
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
        this.draw();
      }
      console.log('!!!!!!!!!!!!!!');
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
      // console.log(matrix, startPos, endPos);
      return [matrix, startPos, endPos];
    }
  }
}
</script>

<style lang="scss">
.maze {
  // &__field {
  //   display: flex;
  // }
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