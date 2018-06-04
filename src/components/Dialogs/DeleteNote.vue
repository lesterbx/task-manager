<template>
  <md-dialog-confirm
    :md-active.sync="showDialog"
    md-title="Delete note"
    md-content="Are you sure that you want to remove this note?"
    md-confirm-text="Yes"
    md-cancel-text="No"
    @md-confirm="$emit('confirm')" />
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'create-board',
  computed: {
    ...mapGetters({ dialog: 'getDialog' }),
    showDialog: {
      get () {
        return this.dialog.name === 'delete-note'
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
