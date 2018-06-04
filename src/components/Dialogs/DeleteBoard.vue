<template>
  <md-dialog-confirm
    :md-active.sync="showDialog"
    md-title="Delete board"
    md-content="Are you sure that you want to remove this board? All the content will be removed."
    md-confirm-text="Yes"
    md-cancel-text="No"
    @md-confirm="$emit('confirm')" />
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'create-board',
  computed: {
    ...mapGetters({ dialog: 'getDialog', currentWorkspace: 'getCurrentWorkspace' }),
    showDialog: {
      get () {
        return this.dialog.name === 'delete-board'
      },
      set (show) {
        !show && this.closeDialog()
      }
    }
  },
  methods: {
    ...mapMutations(['closeDialog'])
  }
}
</script>
