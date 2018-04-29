import Vue from 'vue'
import Router from 'vue-router'
import { Workspace, Board, Home } from '../pages'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/:workspace',
      name: 'Workspace',
      component: Workspace
    },
    {
      path: '/:workspace/:board',
      name: 'Board',
      component: Board
    }
  ]
})
