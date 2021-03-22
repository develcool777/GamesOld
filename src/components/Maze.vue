<template>
  owdnciow
  <div class="maze__field">
    <div class="maze__row" v-for="(row, i) in field" :key="i">
      <div :class="cell.class" v-for="(cell, j) in row" :key="j" :data="calc(cell.class)"></div>
    </div>
  </div>
  <!-- <div class="empty"></div>
  <div class="block"></div>
  <div class="player"></div> -->
</template>

<script>
// import Game from '@/model/game'
// import Player from '@/model/player'
export default {
  created() {
    this.getFieldInMatrix()
  },
  methods: {
    calc(nameOfclass) {
      if (nameOfclass === 'block') {
        return 1;
      } else {
        return 0;
      }
    },
    getFieldInMatrix() {
      const startPos = [];
      const endPos = {};
      const matrix = this.field.map((arr, i) => {
        return arr.map((item, j) => {
          if (item.class.split(' ')[0] === 'startPosition') {
            startPos.push(i,j);
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
      // console.log(matrix, startPos, endPos);
    }
  },
  data() {
    return {
      field: [
        [
          { id: 0,  class: 'block'},
          { id: 1,  class: 'block'},
          { id: 2,  class: 'block'},
          { id: 3,  class: 'block'},
          { id: 4,  class: 'block'}
        ],
        [
          { id: 0,  class: 'startPosition player'},
          { id: 1,  class: 'empty'},
          { id: 2,  class: 'block'},
          { id: 3,  class: 'empty'},
          { id: 4,  class: 'winPosition'}
        ],
        [
          { id: 0,  class: 'block'},
          { id: 1,  class: 'empty'},
          { id: 2,  class: 'block'},
          { id: 3,  class: 'empty'},
          { id: 4,  class: 'block'}
        ],
        [
          { id: 0,  class: 'block'},
          { id: 1,  class: 'empty'},
          { id: 2,  class: 'empty'},
          { id: 3,  class: 'empty'},
          { id: 4,  class: 'block'}
        ],
        [
          { id: 0,  class: 'block'},
          { id: 1,  class: 'block'},
          { id: 2,  class: 'block'},
          { id: 3,  class: 'block'},
          { id: 4,  class: 'block'}
        ]
      ]
    }
  }
}
</script>

<style lang="scss">
.maze {
  &__field {
    // display: flex;
  }
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
</style>