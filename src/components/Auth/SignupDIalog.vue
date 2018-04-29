<template>
  <div>
    <md-dialog :md-active.sync="showDialog" :md-fullscreen="false" @md-closed="$emit('closed')">
      <form class="padding margin" action="javascript:void(0)">
        <h3 class="text-center">Create a new account</h3>
        <div class="md-layout md-gutter">
          <div class="md-layout-item">
            <md-field>
              <label>First Name</label>
              <md-input required v-model="account.first_name" autocomplete="on"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item">
            <md-field>
              <label>Last Name</label>
              <md-input required v-model="account.last_name" autocomplete="on"></md-input>
            </md-field>
          </div>
        </div>
        <md-field>
          <label>Email</label>
          <md-input required v-model="account.email" autocomplete="on"></md-input>
        </md-field>
        <md-field>
          <label>Password</label>
          <md-input required v-model="account.password" type="password" autocomplete="on"></md-input>
        </md-field>
        <div class="full-width text-center">
          <md-button @click="create" class="md-raised md-accent" type="submit">Create Account</md-button>
        </div>
      </form>
      <md-dialog-actions>
        <md-button class="md-primary" @click="$emit('login')">Login with your account</md-button> 
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
      account: {
        first_name: '',
        last_name: '',
        email: '',
        password: ''
      },
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
    ...mapActions(['createAccount']),
    create () {
      if (this.account.first_name === '') {
        this.message = 'Please enter your first name'
      } else if (this.account.last_name === '') {
        this.message = 'Please enter your last name'
      } else if (this.account.email === '') {
        this.message = 'Please enter your email'
      } else if (this.account.password === '') {
        this.message = 'Please enter your password'
      } else {
        this.createAccount(this.account)
          .then(() => {
            this.message = 'Account created'
            this.$emit('closed')
          })
          .catch((error) => { this.message = error })
      }
    }
  }
}
</script>

