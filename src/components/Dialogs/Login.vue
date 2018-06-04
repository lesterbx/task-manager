<template>
  <md-dialog :md-active.sync='showDialog' :md-fullscreen='false'>
    <form class="padding margin" action="javascript:void(0)" @change="setMessage('')">
      <h3 class="text-center">Login with your account</h3>
      <md-field>
        <label>Email</label>
        <md-input name="name" v-model="email" type="email" autocomplete="off"></md-input>
      </md-field>
      <md-field>
        <label>Password</label>
        <md-input name="password" v-model="password" type="password" autocomplete="new-password"></md-input>
      </md-field>
      <div class="full-width text-center">
        <md-button @click="$emit('confirm', { email: email, password: password })" type="submit" class="md-raised md-accent">Login</md-button>
      </div>
    </form>
    <md-dialog-actions>
        <md-button class="md-primary" @click="setDialog({ name: 'signup', action: 'signup', success: 'Account created succesfully' })">Sign Up</md-button>
        <md-button class="md-primary">Forgot Password</md-button> 
    </md-dialog-actions>
  </md-dialog>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'login',
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
        return this.dialog.name === 'login'
      },
      set (show) {
        !show && this.closeDialog()
      }
    }
  },
  methods: {
    ...mapMutations(['setDialog', 'closeDialog', 'setMessage'])
  }
}
</script>
