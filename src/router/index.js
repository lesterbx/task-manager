import Vue from 'vue'
import Router from 'vue-router'
import { Workspace, Board, Home } from '../pages'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/workspace/:id',
      name: 'Workspace',
      component: Workspace
    },
    {
      path: '/workspace/:id/:board',
      name: 'Board',
      component: Board
    }
  ],
  scrollBehavior: (to, from, savedPosition) => ({ x: 0, y: 0 })
})

export default router
