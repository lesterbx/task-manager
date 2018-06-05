import Vue from 'vue'
import Router from 'vue-router'
import { Workspace, Board, Home, BoardsList } from '../pages'
Vue.use(Router)

const router = new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/workspace/:workspaceID',
      component: Workspace,
      children: [
        {
          path: '',
          name: 'Workspace',
          component: BoardsList
        },
        {
          path: ':boardID',
          name: 'Board',
          component: Board
        }
      ]
    }
  ],
  scrollBehavior: (to, from, savedPosition) => ({ x: 0, y: 0 })
})

export default router
