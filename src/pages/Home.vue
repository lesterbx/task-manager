<template>
  <div>
    <md-app md-mode="fixed">
      <md-app-toolbar @show-menu="menuVisible = true"></md-app-toolbar>
      <md-app-drawer :md-active.sync="menuVisible" @closed="menuVisible = false" @open-login="openLoginDialog"></md-app-drawer>
      <md-app-content>
        <welcome @login="openLoginDialog"></welcome>
        <main-footer></main-footer>
      </md-app-content>
    </md-app>
    <login-dialog :show="showLogin" @closed="showLogin = false" @signup="openSignupDialog" @forgot-password="openPasswordDialog"></login-dialog>
    <signup-dialog :show="showSignup" @closed="showSignup = false" @login="openLoginDialog"></signup-dialog>
  </div>
</template>
<script>
import { LoginDialog, SignupDialog } from '@/components/Auth'
import { MdAppDrawer, MainFooter } from '@/components/Common'
import { Welcome, MdAppToolbar } from '@/components/Home'
export default {
  components: { Welcome, MdAppToolbar, MdAppDrawer, MainFooter, LoginDialog, SignupDialog },
  data () {
    return {
      showLogin: false,
      showSignup: false,
      showPassword: false,
      menuVisible: false
    }
  },
  methods: {
    openLoginDialog () {
      this.menuVisible = false
      this.showSignup = false
      this.showLogin = true
    },
    openSignupDialog () {
      this.showLogin = false
      this.showSignup = true
    },
    openPasswordDialog () {
      this.showLogin = false
      this.showPassword = true
    }
  }
}
</script>
<style scoped>
.md-app-content{
  padding: 0
}
</style>
