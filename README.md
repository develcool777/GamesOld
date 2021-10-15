# Games
This website contain 5 games:
1. Maze - aim of game is to make way from start point to end point;
2. Memoji - aim of the game is to uncover all cards;
3. Rock Scissors Paper - battle with computer in rock paper scissors game;
4. Tic Tac Toe - logic game between two opponents on a square field 3 by 3;
5. Chess - competitive board game played between two players;

For this website i use:
* [`Vue`](https://v3.vuejs.org) - progressive JavaScript Framework 
* [`Vuex`](https://vuex.vuejs.org) - for  state management
* [`Vue Router`](https://router.vuejs.org) - for routing
* [`Firebase`](https://firebase.google.com) - for database
* [`Electron`](https://www.electronjs.org) - to run desktop version
* [`JsDoc`](https://jsdoc.app) - for documentation
* [`Jest`](https://jestjs.io) - for unit testing

## Check out how it looks 
Project deployed on [`Heroku`](https://www.heroku.com/), link:
```
https://develcoolgames.herokuapp.com/#/
```

## Check out how it looks localy:
First `Download code` or `clone repository` than install `node_modules` by following command: 
```
npm install
```

#### Run electron version 
In file `package.json` set `main` to `background.js`, if there is no `main`, copy paste this `{"main": "background.js"}`
```
npm run electron:serve
```

#### Run vue version 
In file `package.json` set `main` to `main.js`, if there is no `main`, copy paste this `{"main": "main.js"}`
```
npm run serve 
```

## Documentation
To create documentation run following command:
```
npm run jsdoc
```
It creates folder with name `docs` click on it and then open `index.html` in browser or run command:
```
npm run show:documentation
```

## Unit testing
To run tests run following command:
```
npm run unit:tests
```
To see test coverage, open `index.html`(path: `/tests/coverage/lcov-report/index.html`) in browser or run command:
```
npm run show:coverage
```

## License
[`MIT`](https://opensource.org/licenses/MIT)
Copyright (c) 2021-present, Vadym Pavliuk
