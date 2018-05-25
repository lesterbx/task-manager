<template>
  <md-dialog-prompt :md-active.sync='showDialog' 
      v-model='user'
      md-title='Enter your password'
      md-input-placeholder='Password'
      md-content="You need to enter your password for this action"
      md-confirm-text='Ok'
      @md-confirm='create' />
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
        return this.dialog === 'add-user'
      },
      set (show) {
        this.setDialog(show ? 'add-user' : null)
      }
    }
  },
  methods: {
    ...mapMutations(['setDialog']),
    ...mapActions(['addUserToWorkspace']),
    create () {
      this.addUserToWorkspace({ user: this.user, workspaceID: this.$route.params.id })
    }
  }
}
</script>
