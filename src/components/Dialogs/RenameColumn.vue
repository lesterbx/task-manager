<template>
  <md-dialog-prompt :md-active.sync="showDialog"
      v-model="title"
      md-title="Rename Column"
      md-input-placeholder="New Title"
      @md-confirm="$emit('confirm', { title })" />
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'create-board',
  data () {
    return {
      title: ''
    }
  },
  computed: {
    ...mapGetters({ dialog: 'getDialog' }),
    showDialog: {
      get () {
        return this.dialog.name === 'rename-column'
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
