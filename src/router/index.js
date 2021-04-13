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
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
