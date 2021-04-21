export default {
  data() {
		return {
			width: 400,
		}
	},
	computed: {
		time() {
			const cheak = (time, str) => time > 1 ? `${str}s` : str;   
			let seconds = this.getTimeForReset - this.getTimer;
			if (seconds > 60) {
				let min = Math.floor(seconds / 60);
				let sec = seconds % 60;
				return `Completed in ${min} ${cheak(min, 'minute')} ${sec} ${cheak(sec, 'second')}`;
			}
			return `Completed in ${seconds} ${cheak(seconds, 'second')}`;
		}
	},
	methods: {
    restart() {
			this.$emit('restart');
		},
		close() {
			this.$emit('close');
		},
    changeLevel(step) {
      this.$emit('changeLevel', step);
    },
		showPrev() {
			if (this.getLevel > 1) {
				this.width = 400;
				return true;
			}
			this.width = 300;
			return false;
		},
		showNext() {
			if (this.getLevel < this.getAmountOfLevels) {
				this.width = 400;
				return true;
			}
			this.width = 300;
			return false;
		}
	}
}