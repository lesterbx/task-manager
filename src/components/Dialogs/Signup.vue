<template>
    <md-dialog :md-active.sync="showDialog" :md-fullscreen="false">
      <form class="padding margin" action="javascript:void(0)">
        <h3 class="text-center">Create a new account</h3>
        <div class="md-layout md-gutter">
          <div class="md-layout-item">
            <md-field>
              <label>First Name</label>
              <md-input required v-model="account.first_name" autocomplete="off"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item">
            <md-field>
              <label>Last Name</label>
              <md-input required v-model="account.last_name" autocomplete="off"></md-input>
            </md-field>
          </div>
        </div>
        <md-field>
          <label>Email</label>
          <md-input required v-model="account.email" autocomplete="off"></md-input>
        </md-field>
        <md-field>
          <label>Password</label>
          <md-input required v-model="account.password" type="password" autocomplete="off"></md-input>
        </md-field>
        <div class="full-width text-center">
          <md-button @click="create" class="md-raised md-accent" type="submit">Create Account</md-button>
        </div>
      </form>
      <md-dialog-actions>
        <md-button class="md-primary" @click="setDialog('login')">Login with your account</md-button> 
      </md-dialog-actions>
    </md-dialog>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
export default {
  data () {
    return {
      account: {
        first_name: '',
        last_name: '',
        email: '',
        password: ''
      }
    }
  },
  computed: {
    ...mapGetters({dialog: 'getDialog'}),
    showDialog: {
      get () {
        return this.dialog === 'signup'
      },
      set (show) {
        this.setDialog(show ? 'signup' : null)
      }
    }
  },
  methods: {
    ...mapMutations(['setDialog', 'setMessage']),
    ...mapActions(['signUp']),
    create () {
      this.signUp(this.account)
        .then(() => {
          this.setMessage('Account created succesfully')
          this.setDialog(null)
        })
        .catch(this.setMessage)
    }
  }
}
</script>

