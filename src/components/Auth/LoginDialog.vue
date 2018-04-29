<template>
  <div>
  <md-dialog :md-active.sync="showDialog" :md-fullscreen="false" @md-closed="$emit('closed')">
    <form class="padding margin" action="javascript:void(0)">
      <h3 class="text-center">Login with your account</h3>
      <md-field>
        <label>Email</label>
        <md-input name="name" v-model="email" type="email" autocomplete="off"></md-input>
      </md-field>
      <md-field>
        <label>Password</label>
        <md-input name="password" v-model="password" type="password" autocomplete="off"></md-input>
      </md-field>
      <div class="full-width text-center">
        <md-button @click="log()" type="submit" class="md-raised md-accent">Login</md-button>
      </div>
    </form>
    <md-dialog-actions>
        <md-button class="md-primary" @click="$emit('signup')">Sign Up</md-button>
        <md-button class="md-primary" @click="$emit('forgot-password')">Forgot Password</md-button> 
      </md-dialog-actions>
  </md-dialog>
    <md-snackbar md-position="center" :md-duration="6000" :md-active.sync="showMessage" md-persistent>
      <span class="full-width text-center">{{message}}</span>
      <md-button class="md-accent" @click="message = ''">OK</md-button>
    </md-snackbar>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  props: ['show'],
  data () {
    return {
      showDialog: false,
      email: '',
      password: '',
      message: ''
    }
  },
  computed: {
    showMessage: {
      get () {
        return this.message !== ''
      },
      set (show) {
        this.message = show ? this.message : ''
      }
    }
  },
  watch: {
    show (show) {
      this.showDialog = show
    }
  },
  methods: {
    ...mapActions(['login']),
    log () {
      this.login({email: this.email, password: this.password})
        .then(() => this.$emit('closed'))
        .catch(error => { this.message = error })
    }
  }
}
</script>

