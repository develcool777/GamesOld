# Games
This website contain 5 games:
1. Maze
2. Memoji
3. Rock Scissors Paper
4. Tic Tac Toe
5. Chess

For this website i use:
* [`Vue3`](https://v3.vuejs.org) - progressive JavaScript Framework
* [`Vuex`](https://vuex.vuejs.org) - state management
* [`Vue Router`](https://router.vuejs.org) - router for Vue.js
* [`Firebase`](https://firebase.google.com) - database
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
```
npm run electron:serve
```

#### Run vue version 
```
npm run serve 
```

## Documentation
To create documentation run following command:
```
node_modules/.bin/jsdoc -c jsdoc.json
```
It creates folder with name `docs` click on it and then open `index.html` in browser or run command:
```
open docs/index.html
```

## Unit testing
To run tests run following command:
```
jest --config ./jest.config.js --coverage
```
To see test coverage, open `index.html`(path: `/tests/coverage/lcov-report/index.html`) in browser or run command:
```
open tests/coverage/lcov-report/index.html
```