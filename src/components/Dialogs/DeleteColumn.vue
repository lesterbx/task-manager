<template>
  <md-dialog-confirm
    :md-active.sync="showDialog"
    md-title="Delete column"
    md-content="Are you sure that you want to remove this column? All the notes will be removed too."
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
        return this.dialog.name === 'delete-column'
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
