<template>
  <md-dialog-confirm
    :md-active.sync="showDialog"
    md-title="Delete board"
    md-content="Are you sure that you want to remove this board?"
    md-confirm-text="Yes"
    md-cancel-text="No"
    @md-confirm="remove" />
</template>
<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  name: 'create-board',
  computed: {
    ...mapGetters({ dialog: 'getDialog', currentWorkspace: 'getCurrentWorkspace' }),
    showDialog: {
      get () {
        return this.dialog === 'delete-board'
      },
      set (show) {
        this.setDialog(show ? 'delete-board' : null)
      }
    }
  },
  methods: {
    ...mapMutations(['setDialog', 'setMessage']),
    ...mapActions(['deleteBoard']),
    remove () {
      this.deleteBoard()
        .then(() => {
          this.setMessage('Board deleted')
          this.$router.push('/workspace/' + this.currentWorkspace)
        })
    }
  }
}
</script>
