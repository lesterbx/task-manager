<template>
  <div id="app" class="page-container">
    <md-app md-mode="fixed">
      <md-app-toolbar md-elevation="0" class="md-primary">
        <app-toolbar @show-menu="showMenu = true"></app-toolbar>
      </md-app-toolbar>
      <md-app-content>
        <div class="content">
          <router-view v-if="!loading"></router-view>
        </div>
        <app-footer></app-footer>
        <login></login>
        <signup></signup>
        <create-workspace></create-workspace>
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
import { Login, Signup, CreateWorkspace } from '@/components/Dialogs'
import { AppDrawer, AppToolbar, AppFooter } from '@/components/Common'
export default {
  name: 'app',
  components: { Login, Signup, CreateWorkspace, AppDrawer, AppToolbar, AppFooter },
  data () {
    return {
      showMenu: false,
      loading: true
    }
  },
  computed: {
    ...mapGetters({dialog: 'getDialog', message: 'getMessage'}),
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
      this.loading = false
    })
  }
}
</script>
