<template>
  <md-dialog-prompt :md-active.sync="showDialog" 
      v-model="password"
      md-title="Enter your password"
      md-input-placeholder="Password"
      md-content="You need to enter your password for this action"
      md-confirm-text="Ok"
      @md-confirm="$emit('confirm', { password })" />
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
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
        return this.dialog.name === 'password'
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
