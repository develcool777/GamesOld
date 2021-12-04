import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    props: { id: null }
  },
  {
    path: '/:name/info',
    name: 'Information',
    component: Home,
    props: (route) => {
      const name = route.params.name.split('-').map(word => word.slice(0, 1).toUpperCase() + word.slice(1)).join('');
      return {
        id: 0, 
        game: {
          name,
          path: '/' + route.params.name
        }
      }
    },
    beforeEnter: (to, from, next) => {
      if (router.getRoutes().some(routes => routes.path === '/' + to.params.name)) {
        next();
      } else {
        next({ name: 'NotFound' });
      }
    }
  },
  {
    path: '/maze',
    name: 'Maze',
    component: Home,
    props: { id: 1 }
  },
  {
    path: '/memoji',
    name: 'Memoji',
    component: Home,
    props: { id: 2 }
  },
  {
    path: '/rock-paper-scissors',
    name: 'RockPaperScissors',
    component: Home,
    props: { id: 3 }
  },
  {
    path: '/tic-tac-toe',
    name: 'TicTacToe',
    component: Home,
    props: { id: 4 }
  },
  {
    path: '/chess',
    name: 'Chess',
    component: Home,
    props: { id: 5 }
  },
  {
    path: '/snake',
    name: 'Snake',
    component: Home,
    props: { id: 6 }
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