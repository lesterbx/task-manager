<template>
  <md-dialog :md-active="show" :md-fullscreen="false">
    <md-dialog-title>{{ isNew ? 'New' : 'Edit'}} board</md-dialog-title>
    <div class="padding margin">
      <md-field>
        <label>Board Title</label>
        <md-input v-model="board.title"></md-input>
      </md-field>
    </div>
    <md-dialog-actions>
      <md-button class="md-primary" @click="$emit('cancel')">Cancel</md-button>
      <md-button :disabled="board.title == ''" class="md-primary" @click="newBoard(board)">Save</md-button>
    </md-dialog-actions>
  </md-dialog>
</template>
<script>
import { mapActions } from 'vuex'
import slug from 'slug'
export default {
  props: ['isNew', 'id', 'show', 'workspaceId'],
  data () {
    return {
      showDialog: false,
      board: {
        title: ''
      }
    }
  },
  methods: {
    ...mapActions(['createBoard']),
    newBoard (board) {
      this.createBoard(this.workspaceId, {...board, id: slug(board.title)})
      this.$emit('confirm')
      this.$router.push('Board')
    }
  }
}
</script>
