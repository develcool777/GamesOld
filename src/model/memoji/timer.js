export default class Timer {
  constructor(time, delay=100) { //Delay in ms
    this.state = "paused";
    this.delay = delay;
    this.time = time;
    this.timeForReset = time;
    this.compare = time;
    this.timeForPrint = this.formatTime(time)
  }
  
  formatTime(ms) {
    let hours   = Math.floor(ms / 3600000);
    let minutes = Math.floor((ms - (hours * 3600000)) / 60000);
    let seconds = Math.floor((ms - (hours * 3600000) - (minutes * 60000)) / 1000);
    // let ds = Math.floor((ms - (hours * 3600000) - (minutes * 60000) - (seconds * 1000))/100);
 
    // if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return minutes+':'+seconds;
  }
  
  update() {
    if (this.state=="running" && this.time > 0) {
      this.time -= this.delay;
    } else { return this.stop() }

    if (this.compare - this.time === 1000) {
      this.timeForPrint = this.formatTime(this.time)
      this.compare -= 1000;
    }
  }

  start() {
    if (this.state=="paused") {
      this.state="running";
      if (!this.interval) {
        this.interval = setInterval(() => this.update(), this.delay);
      }
    }
  }
  
  amountOfTime() {
    return this.timeForReset - this.time;
  }

  stop() {
    if (this.state=="running") {
      this.state="paused";
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
      }
    }
  }
  
  reset() {
    this.stop();
    this.time = this.timeForReset;
    this.compare = this.timeForReset;
    this.timeForPrint = this.formatTime(this.timeForReset)
  }
}