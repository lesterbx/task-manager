<template>
  <div class="md-toolbar-row">
    <div class="md-toolbar-section-start" :class="!authenticated && 'padding-left'">
      <md-button v-if="authenticated" @click="$emit('show-menu')" class="md-icon-button">
        <md-icon>menu</md-icon>
      </md-button>
      <h2>{{title}}</h2>
    </div>
    <div class="md-toolbar-section-end">
      <md-button v-if="$route.name == 'Home' && !authenticated" @click="setDialog('login')" class="margin-right">
        Sign in
      </md-button>
      <home-menu v-if="$route.name === 'Home' && authenticated" ></home-menu>
      <workspace-menu v-if="$route.name === 'Workspace'" ></workspace-menu>
      <board-menu v-if="$route.name === 'Board'" ></board-menu>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import { WorkspaceMenu, BoardMenu, HomeMenu } from '../Menus'
export default {
  components: { WorkspaceMenu, BoardMenu, HomeMenu },
  data () {
    return {
      workspaceID: '',
      boardID: ''
    }
  },
  computed: {
    ...mapGetters({ workspace: 'getWorkspace', board: 'getBoard', boards: 'getBoards', authenticated: 'getAuthenticated' }),
    title () {
      if (this.$route.name === 'Home') {
        return 'Task Manager'
      } else if (this.$route.name === 'Workspace') {
        return this.workspace(this.workspaceID) ? this.workspace(this.workspaceID).title : 'Task Manager'
      } else if (this.$route.name === 'Board') {
        return this.board(this.boardID) ? this.board(this.boardID).title : 'Task Manager'
      }
    }
  },
  watch: {
    $route () {
      this.workspaceID = this.$route.params.workspaceID
      this.boardID = this.$route.params.boardID
    }
  },
  methods: {
    ...mapMutations(['setDialog'])
  },
  created () {
    this.workspaceID = this.$route.params.workspaceID
    this.boardID = this.$route.params.boardID
  }
}
</script>
<style>
.md-toolbar-section-start{
flex: auto;
}
</style>

