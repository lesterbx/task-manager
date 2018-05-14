<template>
  <div class="workspaces-list">
    <div class="workspaces-cards">
      <h3 class="no-margin">Workspaces</h3>
      <div class="padding-top">
        <workspace-card v-for="workspace in workspaces" :key="workspace._id" :workspace="workspace"></workspace-card>
        <create-workspace-card v-if="workspaces && Object.keys(workspaces).length == 0"></create-workspace-card>
      </div>
    </div>
  </div>
</template>
<script>
import WorkspaceCard from './WorkspaceCard'
import CreateWorkspaceCard from './CreateWorkspaceCard'
import { mapMutations } from 'vuex'
export default {
  components: { WorkspaceCard, CreateWorkspaceCard },
  props: ['workspaces'],
  methods: {
    ...mapMutations(['setDialog'])
  }
}
</script>
<style lang="scss">
.workspaces-list{
  width: 100%;
  min-height: calc(100vh - 64px);
}
.workspaces-cards{
  margin: auto;
  width: 100%;
  padding: 1em;
}
.new-project .md-icon{
  background-image: url("../../../static/img/project.svg")!important;
}
.md-card + .mad-card{
  margin-top: 1em;
}
@media screen and (min-width: 648px){
  .workspaces-cards{
    width: 75%;
  }
}
@media screen and (min-width: 1024px){
  .workspaces-cards{
    width: 50%;
  }
}
</style>
