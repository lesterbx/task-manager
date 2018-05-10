<template>
  <div class="workspaces-boards padding-bottom">
    <h3 class="no-margin padding-bottom">Boards</h3>
    <md-card class="no-margin">
      <md-list class="no-padding md-double-line">
        <md-list-item class="animated fadeIn" v-for="board in boards" :key="board._id" @click="openBoard(board._id)">
          <div class="md-list-item-text padding margin-left">
            <span>{{board.title}}</span>
            <span>Last activity from user</span>
          </div>
          <md-button class="md-icon-button md-list-action">
            <md-icon>chevron_right</md-icon>
          </md-button>
        </md-list-item>
      </md-list>
      <md-divider></md-divider>
      <md-list class="no-padding">
        <md-list-item @click="setDialog('create-board')">
          <md-avatar class="md-avatar-icon md-accent md-small">
            <md-icon>add</md-icon>
          </md-avatar>
          <span class="md-list-item-text padding">Create Board</span>
        </md-list-item>
      </md-list>
    </md-card>
  </div>
</template>
<script>
import { mapMutations, mapActions, mapGetters } from 'vuex'
export default {
  name: 'Workspace',
  computed: {
    ...mapGetters({boards: 'getBoards'})
  },
  methods: {
    ...mapMutations(['setDialog']),
    ...mapActions(['syncWorkspaceDB'])
  },
  mounted () {
    this.syncWorkspaceDB(this.$route.params.id)
  }
}
</script>
<style>
.workspaces-boards{
  margin: auto;
  width: 100%;
  padding: 1em;
}
@media screen and (min-width: 648px){
  .workspaces-boards{
    width: 75%;
  }
}
@media screen and (min-width: 1024px){
  .workspaces-boards{
    width: 50%;
  }
}
</style>
