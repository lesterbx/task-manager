<template>
  <md-dialog-prompt :md-active.sync='showDialog' 
      v-model='user'
      md-title='Add User'
      md-input-placeholder='User Email'
      md-confirm-text='Add'
      @md-confirm='create' />
</template>
<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  name: 'create-board',
  data () {
    return {
      user: ''
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
