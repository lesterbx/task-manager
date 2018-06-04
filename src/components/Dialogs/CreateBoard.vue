<template>
  <md-dialog-prompt :md-active.sync="showDialog"
      v-model="title"
      md-title="Create Board"
      md-input-placeholder="Board Title"
      @md-confirm="$emit('confirm', { title })"
      @md-cancel="closeDialog" />
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
        return this.dialog.name === 'create-board'
      },
      set (show) {
      }
    }
  },
  methods: {
    ...mapMutations(['closeDialog'])
  }
}
</script>
