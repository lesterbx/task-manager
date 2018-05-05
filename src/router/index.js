import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
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
  ]
})

router.beforeEach((to, from, next) => {
  if (!store.state.initialized) {
    store.dispatch('getSession').then(() => {
      store.commit('initialize')
      if (!store.state.authenticated && to.name !== 'Home') {
        next('/workspace/889')
      } else {
        next()
      }
    })
  } else {
    if (!store.state.authenticated && to.name !== '/' && to.name !== '/home') {
      next('/')
    } else {
      next()
    }
  }
  next()
})

export default router
