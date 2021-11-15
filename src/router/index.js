import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    props: {id: null}
  },
  {
    path: '/maze',
    name: 'Maze',
    component: Home,
    props: {id: 1}
  },
  {
    path: '/memoji',
    name: 'Memoji',
    component: Home,
    props: {id: 2}
  },
  {
    path: '/rock-paper-scissors',
    name: 'RockPaperScissors',
    component: Home,
    props: {id: 3}
  },
  {
    path: '/tic-tac-toe',
    name: 'TicTacToe',
    component: Home,
    props: (route) => {
      return route.name === 'TicTacToe' 
        ? { id: 4 }
        : { id: 0, game: {name: 'TicTacToe', path: '/tic-tac-toe'} }
    },
    children: [ { path: 'comments', component: Home, name: 'Commets' } ]
  },
  {
    path: '/chess',
    name: 'Chess',
    component: Home,
    props: {id: 5}
  },
  {
    path: '/:pathMatch(.*)*', 
    name: 'NotFound',
    component: () => import(/* webpackChunkName: "Not Found" */ '../views/NotFound.vue')
  },
  // {
  //   path: '/email_confirmation', 
  //   name: 'ConfirmEmail',
  //   component: () => import(/* webpackChunkName: "group-foo" */ '../views/ConfirmEmail.vue')
  // }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router