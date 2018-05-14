<template>
  <div id="app" class="page-container">
    <md-app md-mode="fixed">
      <md-app-toolbar md-elevation="0" class="md-primary">
        <app-toolbar @show-menu="showMenu = true"></app-toolbar>
      </md-app-toolbar>
      <md-app-content>
        <div class="content">
          <spinner v-if="loading"></spinner>
          <router-view v-if="!loading"></router-view>
          <login></login>
          <signup></signup>
          <create-workspace></create-workspace>
          <create-board></create-board>
        </div>
        <app-footer></app-footer>
        <md-snackbar md-position="center" :md-active.sync="showMessage" :md-duration="20000">
          <span class="full-width text-center">{{message}}</span>
          <md-button class="md-accent" @click="showMessage = false">OK</md-button>
        </md-snackbar>
      </md-app-content>
      <md-app-drawer :md-active.sync="showMenu">
        <app-drawer @close="showMenu = false"></app-drawer>
      </md-app-drawer>
    </md-app>
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { Login, Signup, CreateWorkspace, CreateBoard } from '@/components/Dialogs'
import { AppDrawer, AppToolbar, AppFooter, Spinner } from '@/components/Common'
export default {
  name: 'app',
  components: { Login, Signup, CreateWorkspace, AppDrawer, AppToolbar, AppFooter, Spinner, CreateBoard },
  data () {
    return {
      showMenu: false
    }
  },
  computed: {
    ...mapGetters({dialog: 'getDialog', message: 'getMessage', authenticated: 'getAuthenticated', loading: 'getLoadingApp'}),
    showMessage: {
      get () {
        return this.message !== ''
      },
      set (show) {
        this.setMessage(show ? this.message : '')
      }
    }
  },
  methods: {
    ...mapMutations(['setMessage']),
    ...mapActions(['setConnectionListener', 'init'])
  },
  created () {
    this.init().then(() => {
      if (!this.authenticated && this.$router.currentRoute.path !== '/') {
        this.$router.replace('/')
      }
    })
  },
  beforeRouteUpdate (to, from, next) {
    if (!this.authenticated && to.name !== 'Home') {
      next('/')
    } else {
      next()
    }
  }
}
</script>
