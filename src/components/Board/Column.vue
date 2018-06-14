<template>
  <md-card class="column no-margin">
    <md-card-header class="column-header">
      <h3 class="no-margin">{{column.title}}</h3>
      <column-menu :columnID="this.column._id"></column-menu>
    </md-card-header>
    <md-divider></md-divider>
    <div>
      <add-note v-if="addingNote" @add="addNote" @cancel="addingNote = false"></add-note>
      <draggable class="draggable" @change="noteMoved($event, column._id)" :value="sortedNotes"  :options="{group: 'notes', ghostClass: 'drag-note', chosenClass: 'drag-note', dragClass: 'drag-note'}" element="div">
        <transition-group class="padding" name="note" tag="div">
          <note v-for="note in sortedNotes" :key="note._id" :note="note"></note>
        </transition-group>
      </draggable>
    </div>
    <md-divider></md-divider>
    <md-card-actions>
      <md-button @click="addingNote = true" class="md-primary">Add Note</md-button>
    </md-card-actions>
  </md-card>
</template>
<script>
import AddNote from './AddNote'
import Note from './Note'
import { mapActions, mapGetters } from 'vuex'
import draggable from 'vuedraggable'
import { ColumnMenu } from '../Menus'
export default {
  components: { AddNote, Note, draggable, ColumnMenu },
  props: ['column'],
  data () {
    return {
      addingNote: false
    }
  },
  computed: {
    ...mapGetters({columnNotes: 'getColumnNotes'}),
    sortedNotes () {
      return this.columnNotes(this.column._id) && this.columnNotes(this.column._id).length === 1
        ? this.columnNotes(this.column._id)
        : this.columnNotes(this.column._id).sort((a, b) => a.position - b.position)
    }
  },
  methods: {
    ...mapActions(['createNote', 'addNoteToColumn', 'removeNoteFromColumn', 'moveNoteInColumn', 'updateNotePosition']),
    addNote (text) {
      this.createNote({
        boardID: this.$route.params.boardID,
        columnID: this.column._id,
        text
      })
      this.addingNote = false
    },
    noteMoved (event, columnID) {
      if (event.added) {
        this.addNoteToColumn({ columnID, noteID: event.added.element._id, position: event.added.newIndex })
      } else if (event.removed) {
        this.removeNoteFromColumn({ columnID, noteID: event.removed.element._id, position: event.removed.oldIndex })
      } else if (event.moved) {
        this.moveNoteInColumn({ columnID, noteID: event.moved.element._id, oldPosition: event.moved.oldIndex, newPosition: event.moved.newIndex })
      }
    }
  }
}
</script>
<style>
.drag-note{
  z-index: 9999;
}
.column{
  width: 270px;
  max-height: calc(100vh - 64px - 2em);
  height: fit-content;
  overflow: hidden;
}
.column + .column{
  margin-left: 1em !important;
}
.column-header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5em 1em;
}
.notes{
  max-height: calc(100vh - 64px - 2em - 104px);
  overflow-y: scroll;
}
.draggable{
  min-height: 2em;
}
.note-enter-active, .note-leave-active {
  transition: all 0.5s;
}
.note-enter, .note-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.note-move {
  transition: transform 0.2s;
}
</style>
