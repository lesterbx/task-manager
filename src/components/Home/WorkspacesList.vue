<template>
  <div class="workspaces-list">
    <md-empty-state v-if="workspaces && workspaces.length == 0" class="new-project" md-icon="devices_other" md-label="Create your first Workspace" md-description="Create your first workspace and start collaborating with your team.">
      <md-button @click="setDialog('create_workspace')" class="md-accent md-raised">Create Workspace</md-button>
    </md-empty-state>
    <div v-else class="no-padding">
      <workspace-card v-for="workspace in workspaces" :key="workspace._id" :workspace="workspace"></workspace-card>
    </div>
  </div>
</template>
<script>
import WorkspaceCard from './WorkspaceCard'
import { mapMutations } from 'vuex'
export default {
  components: { WorkspaceCard },
  props: ['workspaces'],
  methods: {
    ...mapMutations(['setDialog'])
  }
}
</script>
<style lang="scss">
.workspaces-list{
  margin: auto;
  max-width: 500px;
  padding: 1em;
}
.new-project .md-icon{
  background-image: url("../../../static/img/project.svg")!important;
}
.md-card + .mad-card{
  margin-top: 1em;
}
</style>
