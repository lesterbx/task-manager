<template>
  <div class="note">
    <div class="note-content" v-if="!edit">
      <div class="note-text">
        <p class="no-margin">{{note.text}}</p>
      </div>
      <div>
        <note-menu :noteID="note._id" @edit="edit = true"></note-menu>
      </div>
    </div>
    <div class="add-note" v-else>
      <textarea rows="3" v-model="text"></textarea>
      <div class="add-note-buttons">
        <md-button class="md-dense no-margin" @click="edit = false">Cancel</md-button>
        <md-button class="md-primary md-dense no-margin" @click="update" :disabled="text.length === 0">Save</md-button>
      </div>
    </div>
  </div>
</template>
<script>
import { NoteMenu } from '@/components/Menus'
import { mapActions } from 'vuex'
export default {
  props: ['note'],
  components: { NoteMenu },
  data () {
    return {
      edit: false,
      text: ''
    }
  },
  mounted () {
    this.text = this.note.text
  },
  methods: {
    ...mapActions(['updateNote']),
    update () {
      this.updateNote({ noteID: this.note._id, text: this.text })
      this.edit = false
    }
  }
}
</script>
<style scoped>
.note{
  z-index: 10;
}
.note-content {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1em;
  background-color: #fff;
  z-index: 10;
  display: flex;
}
.note + .note {
  margin-top: 1em;
}
.note p {
  white-space: pre-wrap;
}
.note-text {
  width: 100%;
  padding: 0.75em;
}
.add-note textarea {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 0.75em;
  font-size: 1em;
}
.add-note-buttons {
  display: flex;
  justify-content: flex-end;
  padding-top: 0.5em;
}
</style>
