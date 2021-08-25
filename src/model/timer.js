export default class Timer {
  /**
   * @class 
   * @alias Timer
   * @classdesc This class represents logic of timer 
   * @param {Number} time - number(milliseconds) from which timer starts to countdown
   * @param {Number} delay - uses as a time parameter in `setInterval()`
   * @constructor
   * @property {String} state - can be 'paused'(timer stops countdown) or 'running'(timer starts countdown) 
   * @property {Number} timeForReset - needs to restore initial value of `time` after countdown
   * @property {String} timeForPrint - stores `time` in format 00:00
   * @property {} interval - this is id that `setInterval()` returns, uses in `clearInterval()`
   * @property {Number} compare - the subtraction between `compare` and `time` if it's equals 1000, call [`formatTime`]{@link Timer#formatTime} function
   * @throws Error - if `time` is not Intager and lower than 0
   * @throws Error - if `delay` is not Intager and lower than 0
   */
  constructor(time, delay=100) { 
    if (!Number.isInteger(time) && time > 0) {
      throw Error(`Timer.constructor(time, delay) time must be Integer and greater than 0`);
    }
    if (!Number.isInteger(delay) && delay > 0) {
      throw Error(`Timer.constructor(time, delay) delay must be Integer and greater than 0`);
    }
    let state = 'paused';
    const timeForReset = time;
    let compare = time;
    let timeForPrint = this.formatTime(time);
    let interval;
    Object.defineProperties(this, {
      state: {
        get: () => state,
        set: (value) => {
          if (typeof value !== 'string') {
            throw Error(`Timer.state.set(value) value must be String`);
          }
          if (!['paused', 'running'].includes(value)) {
            throw Error(`Timer.state.set(value) value must be 'paused' or 'running'`);
          }
          state = value;
        }
      },
      time: {
        get: () => time,
        set: (value) => {
          if (!Number.isInteger(value) && value > 0) {
            throw Error(`Timer.time.set(value) value must be Integer and greater than 0`); 
          }
          time = value;
        }
      },
      delay: {
        get: () => delay
      },
      timeForReset: {
        get: () => timeForReset
      },
      compare: {
        get: () => compare,
        set: (value) => {
          if (!Number.isInteger(value) && value > 0) {
            throw Error(`Timer.compare.set(value) value must be Integer and greater than 0`); 
          }
          compare = value;
        }
      },
      timeForPrint: {
        get: () => timeForPrint,
        set: (value) => {
          if (typeof value !== 'string') {
            throw Error(`Timer.timeForPrint.set(value) value must be String`);
          }
          timeForPrint = value;
        }
      },
      interval: {
        get: () => interval,
        set: (value) => {
          interval = value;
        }
      }
    })
  }
  /**
   * @method formatTime
   * @memberof Timer#
   * @description Converts `ms` in format 00:00
   * @param {Number} ms - number in milliseconds 
   * @returns {String} 
   * @example const time = this.formatTime(30000) // returns 00:30
   */
  formatTime(ms) {
    let hours   = Math.floor(ms / 3_600_000);
    let minutes = Math.floor((ms - (hours * 3_600_000)) / 60_000);
    let seconds = Math.floor((ms - (hours * 3_600_000) - (minutes * 60_000)) / 1000);
    // let ds = Math.floor((ms - (hours * 3600000) - (minutes * 60000) - (seconds * 1000))/100);
 
    // if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = '0'+minutes;}
    if (seconds < 10) {seconds = '0'+seconds;}
    return minutes+':'+seconds;
  }
  
  /**
   * @method update
   * @memberof Timer#
   * @description Updates timer value
   * @returns {undefined} undefined
   * @example this.update()
   */
  update() {
    if (this.state=='running' && this.time > 0) {
      this.time -= this.delay;
    } else { return this.stop() }

    if (this.compare - this.time === 1000) {
      this.timeForPrint = this.formatTime(this.time)
      this.compare -= 1000;
    }
  }

  /**
   * @method start
   * @memberof Timer#
   * @description Starts timer countdown
   * @returns {undefined} undefined
   * @example this.start()
   */
  start() {
    if (this.state=='paused') {
      this.state='running';
      if (!this.interval) {
        this.interval = setInterval(() => this.update(), this.delay);
      }
    }
  }
  
  /**
   * @method amountOfTime
   * @memberof Timer#
   * @description Returns subtraction between `timeForReset` and `time`
   * @returns {Number} milliseconds
   * @example const amount = this.amountOfTime()
   */
  amountOfTime() {
    return this.timeForReset - this.time;
  }

  /**
   * @method stop
   * @memberof Timer#
   * @description Stops timer countdown
   * @returns {undefined} undefined
   * @example this.stop()
   */
  stop() {
    if (this.state=='running') {
      this.state='paused';
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
      }
    }
  }

  /**
   * @method reset
   * @memberof Timer#
   * @description Stops timer countdown and set initial value for `time`, `compare` and `timeForPrint`  
   * @returns {undefined} undefined
   * @example this.reset()
   */
  reset() {
    this.stop();
    this.time = this.timeForReset;
    this.compare = this.timeForReset;
    this.timeForPrint = this.formatTime(this.timeForReset)
  }
}