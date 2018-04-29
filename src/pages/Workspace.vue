<template>
  <div>
    <md-app md-mode="flexible">
      <md-app-toolbar @show-menu="menuVisible = true"></md-app-toolbar>
      <md-app-drawer :md-active.sync="menuVisible" @closed="menuVisible = false"></md-app-drawer>
      <md-app-content>
        <md-empty-state md-icon="dashboard" md-label="Create your first board" md-description="Create a board and start collaborating with your team.">
          <md-button @click="showBoardDialog = true" class="md-accent md-raised">Create board</md-button>
        </md-empty-state>
      </md-app-content>
    </md-app>
    <edit-board :isNew="true" :workspace-id="workspace._id" :show="showBoardDialog" @confirm="showBoardDialog = false" @cancel="showBoardDialog = false"></edit-board>
  </div>
</template>
<script>
import { MdAppDrawer } from '@/components/Common'
import { MdAppToolbar } from '@/components/Workspace'
import { EditBoard } from '@/components/Board'
export default {
  name: 'Workspace',
  components: { MdAppToolbar, MdAppDrawer, EditBoard },
  data () {
    return {
      menuVisible: false,
      showBoardDialog: false,
      workspace: {
        _id: 'workspace-1'
      }
    }
  }
}
</script>
<style scoped>
.md-app-toolbar {
  height: 196px;
}
.md-app-content{
  margin: 0;
  min-height: calc(100vh - 196px);
}
</style>
