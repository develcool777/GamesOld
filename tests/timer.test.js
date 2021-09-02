import Timer from '../src/model/timer'

describe('creating instance of Timer', () => {
  const t = new Timer(10_000); 

  test('instance of class Timer', () => {
    expect(t instanceof Timer).toBeTruthy();

    expect(() => new Timer('1')).toThrowError(new Error(`Timer.constructor(time, delay) time must be Integer and greater than 0`));
    expect(() => new Timer(1.345)).toThrowError(new Error(`Timer.constructor(time, delay) time must be Integer and greater than 0`));
    expect(() => new Timer(-1)).toThrowError(new Error(`Timer.constructor(time, delay) time must be Integer and greater than 0`));

    expect(() => new Timer(10_000, '1')).toThrowError(new Error(`Timer.constructor(time, delay) delay must be Integer and greater than 0`));
    expect(() => new Timer(10_000, 1.345)).toThrowError(new Error(`Timer.constructor(time, delay) delay must be Integer and greater than 0`));
    expect(() => new Timer(10_000, -1)).toThrowError(new Error(`Timer.constructor(time, delay) delay must be Integer and greater than 0`));
  });

  test('properties of class Timer', () => {
    expect(Object.getOwnPropertyNames(new Timer(10_000))).toEqual(['state', 'time', 'delay', 'timeForReset', 'compare', 'timeForPrint', 'interval']);
  });

  test('properties values of class Timer', () => {
    expect(t.state).toMatch("paused");
    expect(t.time).toBe(10_000);
    expect(t.delay).toBe(100);
    expect(t.timeForReset).toBe(10_000);
    expect(t.compare).toBe(10_000)
    expect(t.timeForPrint).toMatch("00:10");
    expect(t.interval).toBeUndefined();
  });
});

describe('testing properties', () => {
  const t = new Timer(10_000);

  test('property: state', () => {
    expect(t.state).toMatch("paused");
    expect(() => t.state = 1).toThrowError(new Error(`Timer.state.set(value) value must be String`));
    expect(() => t.state = '1').toThrowError(new Error(`Timer.state.set(value) value must be 'paused' or 'running'`));
    expect(t.state = 'running').toMatch('running');
    expect(t.state = 'paused').toMatch('paused');
  });

  test('property: time', () => {
    expect(t.time).toBe(10_000);
    expect(() => t.time = '1').toThrowError(new Error(`Timer.time.set(value) value must be Integer and greater than 0`));
    expect(() => t.time = 213.345).toThrowError(new Error(`Timer.time.set(value) value must be Integer and greater than 0`));
    expect(() => t.time = -1).toThrowError(new Error(`Timer.time.set(value) value must be Integer and greater than 0`));
    expect(t.time = 0).toBe(0);
    expect(t.time = 10_000).toBe(10_000);
  });

  test('property: delay', () => {
    expect(t.delay).toBe(100);
    expect(() => t.delay = 1_000).toThrowError(new Error(`Cannot set property delay of #<Timer> which has only a getter`));
  });

  test('property: timeForReset', () => {
    expect(t.timeForReset).toBe(10_000);
    expect(() => t.timeForReset = 1_000).toThrowError(new Error(`Cannot set property timeForReset of #<Timer> which has only a getter`));
  });

  test('property: compare', () => {
    expect(t.compare).toBe(10_000);
    expect(() => t.compare = '1').toThrowError(new Error(`Timer.compare.set(value) value must be Integer and greater than 0`));
    expect(() => t.compare = 213.345).toThrowError(new Error(`Timer.compare.set(value) value must be Integer and greater than 0`));
    expect(() => t.compare = -1).toThrowError(new Error(`Timer.compare.set(value) value must be Integer and greater than 0`));
    expect(t.compare = 0).toBe(0);
    expect(t.compare = 10_000).toBe(10_000);
  });

  test('property: timeForPrint', () => {
    expect(t.timeForPrint).toMatch("00:10");
    expect(() => t.timeForPrint = 1).toThrowError(new Error(`Timer.timeForPrint.set(value) value must be String`));
    expect(t.timeForPrint = "00:08").toMatch("00:08");
    expect(t.timeForPrint = "00:10").toMatch("00:10");
  });

  test('property: interval', () => {
    expect(t.interval).toBeUndefined();
    expect(t.interval = 21345).toBe(21345);
  });
});

describe('testing methods', () => {
  const t = new Timer(10_000);

  test('formatTime()', () => {
    expect(() => t.formatTime('1')).toThrowError(new Error(`Timer.formatTime(ms) ms must be Integer and greater than 0`));
    expect(() => t.formatTime(213.345)).toThrowError(new Error(`Timer.formatTime(ms) ms must be Integer and greater than 0`));
    expect(() => t.formatTime(-1)).toThrowError(new Error(`Timer.formatTime(ms) ms must be Integer and greater than 0`));
    expect(t.formatTime(8_000)).toMatch("00:08");
    expect(t.formatTime(120_000)).toMatch("02:00");
    expect(t.formatTime(0)).toMatch("00:00");
    expect(t.formatTime(3_599_000)).toMatch("59:59");
  });

  test('amountOfTime()', () => {
    expect(t.amountOfTime()).toBe(0);
    t.time = 5_000;
    expect(t.amountOfTime()).toBe(5_000);
    t.time = 10_000;
  });

  test('update()', () => {
    t.state = 'running'
    for (let i = 0; i < 12; i++) {
      if (i === 11) {
        expect(t.state = 'paused').toMatch('paused');
      }
      expect(t.update()).toBeUndefined();
    }
    expect(t.time).toBe(8_900);
    expect(t.compare).toBe(9000);
    expect(t.timeForPrint).toMatch("00:09");
    t.reset();
  });

  test('start()', () => {
    expect(t.state).toMatch("pause");
    expect(t.start()).toBeUndefined();
    expect(t.state).toMatch("running");
    t.stop();
  });

  test('stop()', () => {
    t.start();
    expect(t.state).toMatch("running");
    expect(t.stop()).toBeUndefined();
    expect(t.state).toMatch("pause");
  });

  test('reset()', () => {
    t.start();
    expect(t.state).toMatch("running");
    expect(t.reset()).toBeUndefined();
    expect(t.state).toMatch("pause");
  });
});