import Game from '../../src/model/RockPaperScissors/game'

describe('creating instance of Game', () => {
  const g = new Game(); 

  test('instance of class Game', () => {
    expect(g instanceof Game).toBeTruthy();
  });

  test('properties of class Game', () => {
    expect(Object.getOwnPropertyNames(new Game)).toEqual(['userScore', 'computerScore', 'history']);
  });

  test('properties values of class Game', () => {
    expect(g.userScore).toBe(0);
    expect(g.computerScore).toBe(0);
    expect(g.history).toEqual([]);
  });
});

describe('testing properties', () => {
  const g = new Game(); 

  test('property: userScore', () => {
    expect(g.userScore).toBe(0);
    expect(() => g.userScore = '1').toThrowError(new Error(`userScore.set() value must be integer`));
    expect(() => g.userScore = 1.5).toThrowError(new Error(`userScore.set() value must be integer`));
    expect(g.userScore = 1).toBe(1);
  });

  test('property: computerScore', () => {
    expect(g.computerScore).toBe(0);
    expect(() => g.computerScore = '1').toThrowError(new Error(`computerScore.set() value must be integer`));
    expect(() => g.computerScore = 1.5).toThrowError(new Error(`computerScore.set() value must be integer`));
    expect(g.computerScore = 1).toBe(1);
  });

  test('property: history', () => {
    expect(g.history).toEqual([]);
    expect(() => g.history = '1').toThrowError(new Error(`Cannot set property history of #<Game> which has only a getter`));
    g.history.push(1);
    expect(g.history).toEqual([1]);
  });
});

describe('testing methods', () => {
  const g = new Game(); 

  test('log', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation();
    expect(g.log).toBeUndefined();
    expect(console.log.mock.calls[0][0]).toEqual({ 
      compScore: 0,
      history: [],
      userScore: 0
    });
    spy.mockRestore();
  });

  test('withoutDrawMode()', () => {
    expect(() => g.withoutDrawMode(1)).toThrowError(new Error(`Game.withoutDrawMode(user='') user must be 'r' or 'p' or 's'`));
    expect(() => g.withoutDrawMode('1')).toThrowError(new Error(`Game.withoutDrawMode(user='') user must be 'r' or 'p' or 's'`));
    expect(() => g.withoutDrawMode()).toThrowError(new Error(`Game.withoutDrawMode(user='') user must be 'r' or 'p' or 's'`));
    expect(g.withoutDrawMode('r')).toEqual(expect.objectContaining({user: "r"}));
    expect(g.withoutDrawMode('p')).toEqual(expect.objectContaining({user: "p"}));
    expect(g.withoutDrawMode('s')).toEqual(expect.objectContaining({user: "s"}));
  });

  test('impossibleMode()', () => {
    expect(() => g.impossibleMode(1)).toThrowError(new Error(`Game.impossibleMode(user='') user must be 'r' or 'p' or 's'`));
    expect(() => g.impossibleMode('1')).toThrowError(new Error(`Game.impossibleMode(user='') user must be 'r' or 'p' or 's'`));
    expect(() => g.impossibleMode()).toThrowError(new Error(`Game.impossibleMode(user='') user must be 'r' or 'p' or 's'`));
    expect(g.impossibleMode('r')).toEqual({"comp": "p", "user": "r"});
    expect(g.impossibleMode('p')).toEqual({"comp": "s", "user": "p"});
    expect(g.impossibleMode('s')).toEqual({"comp": "r", "user": "s"});
  });

  test('easyMode()', () => {
    expect(() => g.easyMode(1)).toThrowError(new Error(`Game.easyMode(user='') user must be 'r' or 'p' or 's'`));
    expect(() => g.easyMode('1')).toThrowError(new Error(`Game.easyMode(user='') user must be 'r' or 'p' or 's'`));
    expect(() => g.easyMode()).toThrowError(new Error(`Game.easyMode(user='') user must be 'r' or 'p' or 's'`));
    expect(g.easyMode('r')).toEqual({"comp": "s", "user": "r"});
    expect(g.easyMode('p')).toEqual({"comp": "r", "user": "p"});
    expect(g.easyMode('s')).toEqual({"comp": "p", "user": "s"});
  });

  test('normalGame()', () => {
    expect(() => g.normalGame(1)).toThrowError(new Error(`Game.normalGame(user='') user must be 'r' or 'p' or 's'`));
    expect(() => g.normalGame('1')).toThrowError(new Error(`Game.normalGame(user='') user must be 'r' or 'p' or 's'`));
    expect(() => g.normalGame()).toThrowError(new Error(`Game.normalGame(user='') user must be 'r' or 'p' or 's'`));
    expect(g.normalGame('r')).toEqual(expect.objectContaining({user: "r"}));
    expect(g.normalGame('p')).toEqual(expect.objectContaining({user: "p"}));
    expect(g.normalGame('s')).toEqual(expect.objectContaining({user: "s"}));
  });

  test('clean()', () => {
    expect(g.clean()).toBeUndefined();
    expect(g.userScore).toBe(0);
    expect(g.computerScore).toBe(0);
    expect(g.history).toEqual([]);
  });

  test('calculateScore()', () => {
    expect(() => g.calculateScore()).toThrowError(new Error(`Game.calculateScore(winner='') winner must be 'user' or 'comp'`));
    expect(() => g.calculateScore(1)).toThrowError(new Error(`Game.calculateScore(winner='') winner must be 'user' or 'comp'`));
    expect(() => g.calculateScore('1')).toThrowError(new Error(`Game.calculateScore(winner='') winner must be 'user' or 'comp'`));
    expect(g.calculateScore('user')).toBeUndefined();
    expect(g.calculateScore('comp')).toBeUndefined();
    expect(g.userScore).toBe(1);
    expect(g.computerScore).toBe(1);
    expect(g.clean()).toBeUndefined();
  });

  test('play()', () => {
    expect(() => g.play(1, 'r')).toThrowError(new Error(`Game.play(user, comp) user must be 'r' or 'p' or 's'`));
    expect(() => g.play('1', 'r')).toThrowError(new Error(`Game.play(user, comp) user must be 'r' or 'p' or 's'`));
    expect(() => g.play('r', 1)).toThrowError(new Error(`Game.play(user, comp) comp must be 'r' or 'p' or 's'`));
    expect(() => g.play('r', '1')).toThrowError(new Error(`Game.play(user, comp) comp must be 'r' or 'p' or 's'`));
    // draws
    expect(g.history).toEqual([]);
    expect(g.play('r', 'r')).toBeUndefined();
    expect(g.history[0]).toEqual({"compMove": "r", "compScore": 0, "result": "draw", "userMove": "r", "userScore": 0});
    expect(g.play('p', 'p')).toBeUndefined();
    expect(g.history[1]).toEqual({"compMove": "p", "compScore": 0, "result": "draw", "userMove": "p", "userScore": 0});    
    expect(g.play('s', 's')).toBeUndefined();
    expect(g.history[2]).toEqual({"compMove": "s", "compScore": 0, "result": "draw", "userMove": "s", "userScore": 0});
    expect(g.history).toHaveLength(3);
    //wins
    expect(g.play('r', 'p')).toBeUndefined();
    expect(g.history[3]).toEqual({"compMove": "p", "compScore": 1, "result": "comp", "userMove": "r", "userScore": 0});
    expect(g.play('p', 'r')).toBeUndefined();
    expect(g.history[4]).toEqual({"compMove": "r", "compScore": 1, "result": "user", "userMove": "p", "userScore": 1});
    expect(g.play('p', 's')).toBeUndefined();
    expect(g.history[5]).toEqual({"compMove": "s", "compScore": 2, "result": "comp", "userMove": "p", "userScore": 1});
    expect(g.play('s', 'p')).toBeUndefined();
    expect(g.history[6]).toEqual({"compMove": "p", "compScore": 2, "result": "user", "userMove": "s", "userScore": 2});
    expect(g.play('s', 'r')).toBeUndefined();
    expect(g.history[7]).toEqual({"compMove": "r", "compScore": 3, "result": "comp", "userMove": "s", "userScore": 2});
    expect(g.play('r', 's')).toBeUndefined();
    expect(g.history[8]).toEqual({"compMove": "s", "compScore": 3, "result": "user", "userMove": "r", "userScore": 3});
    expect(g.history).toHaveLength(9);
  });

  test('check()', () => {
    expect(() => g.check(1, 'r')).toThrowError(new Error(`Game.check(i1, i2) i1 must be 'r' or 'p' or 's'`));
    expect(() => g.check('p', 1)).toThrowError(new Error(`Game.check(i1, i2) i2 must be 'r' or 'p' or 's'`));
    expect(g.check('p', 'p')).toBe('draw');
    expect(g.check('r', 'r')).toBe('draw');
    expect(g.check('s', 's')).toBe('draw');
    expect(g.check('r', 'p')).toBe('p');
    expect(g.check('p', 'r')).toBe('p');
    expect(g.check('r', 's')).toBe('r');
    expect(g.check('s', 'r')).toBe('r');
    expect(g.check('p', 's')).toBe('s');
    expect(g.check('s', 'p')).toBe('s');
  });

  test('getAllWinsByMove()', () => {
    expect(() => g.getAllWinsByMove(1, 'user')).toThrowError(new Error(`Game.getAllWinsBymove(move, winner) move must be 'r' or 'p' or 's'`));
    expect(() => g.getAllWinsByMove('r', 1)).toThrowError(new Error(`Game.getAllWinsBymove(move, winner) winner must be 'user' or 'comp'`));
    expect(g.getAllWinsByMove('r', 'user')).toBe(1);
    expect(g.getAllWinsByMove('p', 'user')).toBe(1);
    expect(g.getAllWinsByMove('s', 'user')).toBe(1);
    expect(g.getAllWinsByMove('r', 'comp')).toBe(1);
    expect(g.getAllWinsByMove('p', 'comp')).toBe(1);
    expect(g.getAllWinsByMove('s', 'comp')).toBe(1);
  });

  test('getAllDrawsByMove()', () => {
    expect(() => g.getAllDrawsByMove()).toThrowError(new Error(`Game.getAllDrawsByMove(move='') move must be 'r' or 'p' or 's'`));
    expect(() => g.getAllDrawsByMove(1)).toThrowError(new Error(`Game.getAllDrawsByMove(move='') move must be 'r' or 'p' or 's'`));
    expect(g.getAllDrawsByMove('r')).toBe(1);
    expect(g.getAllDrawsByMove('p')).toBe(1);
    expect(g.getAllDrawsByMove('s')).toBe(1);
  });

  test('analytics()', () => {
    expect(g.analytics()).toEqual({
      "comp": {
        "p": 1,
        "r": 1,
        "s": 1,
      },
      "draws": {
        "p": 1,
        "r": 1,
        "s": 1,
      },
      "user": {
        "p": 1,
        "r": 1,
        "s": 1,
      },
    });
  });
});



