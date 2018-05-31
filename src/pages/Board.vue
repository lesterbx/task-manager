<template>
  <div class="board">
    <div class="board-content padding">
      <draggable class="draggable" v-if="sortedColumns.length > 0" :value="sortedColumns" element="div" @change="movedColumn">
        <transition-group class="board-content" name="list" tag="div">
          <column v-for="column in sortedColumns" :key="column._id" :column="column"></column>
        </transition-group>
      </draggable>
      <add-column @add-column="addColumn"></add-column>
    </div>
  </div>
</template>
<script>
import { Column, AddColumn } from '../components/Board'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import draggable from 'vuedraggable'
export default {
  components: { Column, AddColumn, draggable },
  computed: {
    ...mapGetters({columns: 'getColumns'}),
    sortedColumns () {
      return Object.keys(this.columns).length > 0 && Object.values(this.columns).sort((a, b) => a.position - b.position)
    }
  },
  methods: {
    ...mapActions(['readBoardContent', 'createColumn', 'moveColumn']),
    ...mapMutations(['setCurrentBoard', 'setMessage']),
    addColumn (title) {
      this.createColumn({ boardID: this.$route.params.boardID, title: title })
        .catch(error => this.setMessage(error.reason))
    },
    movedColumn ({moved}) {
      this.moveColumn({ columnID: moved.element._id, oldPosition: moved.oldIndex, newPosition: moved.newIndex })
        .catch(error => this.setMessage(error.reason))
    }
  },
  created () {
    this.readBoardContent(this.$route.params.boardID)
    this.setCurrentBoard(this.$route.params.boardID)
  }
}
</script>
<style>
.board{
  height: calc(100vh - 64px);
  overflow-x: scroll;
}
.board-content{
  display: flex;
  flex-direction: row;
  width: fit-content;
  height: 100%;
}
.list-enter-active, .list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.list-move {
  transition: transform 0.2s;
}
</style>

