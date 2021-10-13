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
    props: {id: 0}
  },
  {
    path: '/memoji',
    name: 'Memoji',
    component: Home,
    props: {id: 1}
  },
  {
    path: '/rock-paper-scissors',
    name: 'RockPaperScissors',
    component: Home,
    props: {id: 2}
  },
  {
    path: '/tic-tac-toe',
    name: 'TicTacToe',
    component: Home,
    props: {id: 3}
  },
  {
    path: '/chess',
    name: 'Chess',
    component: Home,
    props: {id: 4}
  },
  {
    path: '/:pathMatch(.*)*', 
    name: 'NotFound',
    component: () => import(/* webpackChunkName: "group-foo" */ '../views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
