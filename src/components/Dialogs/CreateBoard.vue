<template>
  <md-dialog-prompt :md-active.sync='showDialog' v-model='title'
      md-title='Create Board'
      md-input-placeholder='Board Title'
      md-confirm-text='Done'
      @md-confirm='create' />
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
        return this.dialog === 'create-board'
      },
      set (show) {
        this.setDialog(show ? 'create-board' : null)
      }
    }
  },
  methods: {
    ...mapMutations(['setDialog']),
    ...mapActions(['createBoard']),
    create () {
      this.createBoard({ title: this.title, workspaceID: this.$route.params.id })
    }
  }
}
</script>
