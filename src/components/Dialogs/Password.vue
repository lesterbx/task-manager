<template>
  <md-dialog-prompt :md-active.sync='showDialog' 
      v-model='password'
      md-title='Enter your password'
      md-input-placeholder='Password'
      md-content="You need to enter your password for this action"
      md-confirm-text='Ok'
      @md-confirm='ok' />
</template>
<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  name: 'create-board',
  data () {
    return {
      password: ''
    }
  },
  computed: {
    ...mapGetters({ dialog: 'getDialog' }),
    showDialog: {
      get () {
        return this.dialog === 'password'
      },
      set (show) {
        this.setDialog(show ? 'password' : null)
      }
    }
  },
  methods: {
    ...mapMutations(['setDialog']),
    ...mapActions(['runPendingAction']),
    ok () {
      this.runPendingAction(this.password)
    }
  }
}
</script>
