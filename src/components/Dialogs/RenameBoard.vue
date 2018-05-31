<template>
  <md-dialog-prompt :md-active.sync='showDialog' 
      v-model='title'
      md-title='Rename Board'
      md-input-placeholder='New Title'
      @md-confirm='update' />
</template>
<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
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
        return this.dialog === 'rename-board'
      },
      set (show) {
        this.setDialog(show ? 'rename-board' : null)
      }
    }
  },
  methods: {
    ...mapMutations(['setDialog', 'setMessage']),
    ...mapActions(['renameBoard']),
    update () {
      if (this.title !== '') {
        this.renameBoard(this.title)
      } else {
        this.setMessage('Enter a title')
      }
    }
  }
}
</script>
