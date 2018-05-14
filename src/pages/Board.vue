<template>
  <div class="padding board">
    <column v-for="column in board.columns" :key="column._id" :column="column"></column>
    <add-column @add-column="addColumn"></add-column>
  </div>
</template>
<script>
import { Column, Card, AddColumn } from '../components/Board'
import { mapGetters, mapActions, mapMutations } from 'vuex'
export default {
  components: { Column, Card, AddColumn },
  computed: {
    ...mapGetters({board: 'getBoard'})
  },
  methods: {
    ...mapActions(['readBoardColumns', 'createColumn']),
    ...mapMutations(['setBoard']),
    addColumn (title) {
      this.createColumn({workspaceID: this.$route.params.workspaceID, boardID: this.$route.params.boardID, title: title})
    }
  },
  created () {
    this.readBoardColumns({ workspaceID: this.$route.params.workspaceID, boardID: this.$route.params.boardID })
  },
  beforeDestroy () {
    this.setBoard({ columns: {}, cards: {} })
  }
}
</script>
<style>
.board{
  display: flex;
  flex-direction: row;
  height: calc(100vh - 64px);
  overflow-x: scroll;
}
.add-column-input{
  min-height: 0;
  padding-top: 0;
}
.column{
  min-width: 250px;
  max-height: calc(100vh - 64px - 2em);
}
.column + .column{
  margin-left: 1em !important;
}
</style>

