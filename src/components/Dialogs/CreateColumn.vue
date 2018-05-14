<template>
  <md-dialog-prompt :md-active.sync='showDialog' v-model='title'
      md-title='Add Column'
      md-input-placeholder='Column Title'
      md-confirm-text='Add'
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
        return this.dialog === 'create-column'
      },
      set (show) {
        this.setDialog(show ? 'create-column' : null)
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
