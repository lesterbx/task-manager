<template>
  <md-dialog :md-active.sync='showDialog' :md-fullscreen='false'>
    <form class='padding margin' action='javascript:void(0)'>
      <h3 class='text-center'>Login with your account</h3>
      <md-field>
        <label>Email</label>
        <md-input name='name' v-model='email' type='email' autocomplete='off'></md-input>
      </md-field>
      <md-field>
        <label>Password</label>
        <md-input name='password' v-model='password' type='password' autocomplete='off'></md-input>
      </md-field>
      <div class='full-width text-center'>
        <md-button @click='log()' type='submit' class='md-raised md-accent'>Login</md-button>
      </div>
    </form>
    <md-dialog-actions>
        <md-button class='md-primary' @click="setDialog('signup')">Sign Up</md-button>
        <md-button class='md-primary'>Forgot Password</md-button> 
    </md-dialog-actions>
  </md-dialog>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
export default {
  data () {
    return {
      email: '',
      password: ''
    }
  },
  computed: {
    ...mapGetters({ dialog: 'getDialog' }),
    showDialog: {
      get () {
        return this.dialog === 'login'
      },
      set (show) {
        this.setDialog(show ? 'login' : null)
      }
    }
  },
  methods: {
    ...mapMutations(['setDialog', 'setMessage']),
    ...mapActions(['login']),
    log () {
      this.login({ email: this.email, password: this.password })
        .then(() => this.setDialog(null))
        .catch((error) => this.setMessage(error))
    }
  }
}
</script>
