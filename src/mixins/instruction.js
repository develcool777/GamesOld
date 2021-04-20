export default {
  created() {
    this.timeForPrint(this.getTimer);
  },
  data() {
    return {
      timeStr: '',
      idInterval: 0,
      allowClick: true
    }
  },
  watch: {
    gameFinished: function(newValue) {
      if (newValue) {
        this.stopGame();
      }
    },
    level: function(newVal) {
      if (newVal) {
        this.timeForPrint(this.getTimer);
      }
    },
    timer: function(newVal) {
      if (newVal === this.getTimeForReset) {
        this.timeForPrint(newVal);
      }
    },
    restart: function(newVal) {
      if (newVal) {
        this.startGame();
      }
    }
  },
  methods: {
    changeLevel(step) {
      if (this.allowClick) {
        this.$emit('changeLevel', step);
        this.timeForPrint(this.getTimer);
      }
    },
    startGame() {
      if (this.restart) {
        this.CHANGE_RESTART(false);
      }
      this.CHANGE_ISPLAYING(true);
      this.allowClick = false;
      this.idInterval = setInterval(() => {
        const check = this.getTimer - 1
        if (check >= 0) {
          this.CHANGE_TIMER(check);
          this.timeForPrint(check);
        } else {
          this.finishGame();
        }
      }, 1000)
    },
    stopGame() {
      this.allowClick = true;
      this.CHANGE_ISPLAYING(false);
      clearInterval(this.idInterval);
    },
    finishGame() {
      clearInterval(this.idInterval);
      this.END_GAME('Lose');
    },
    timeForPrint(time) {
      let minutes = parseInt(time / 60, 10);
      let seconds = parseInt(time % 60, 10);
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;
      this.timeStr = `${minutes}:${seconds}`;
    },
    restartGame() {
      clearInterval(this.idInterval);
      this.$emit('restart');
    },
    showHint() {
      this.CHANGE_SHOW_HINT(!this.getShowHint);
    }
  }
}