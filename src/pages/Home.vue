<template>
  <div>
    <welcome v-if="!authenticated"></welcome>
    <workspaces-list v-else :workspaces="workspaces"></workspaces-list>
  </div>
</template>
<script>
import { Welcome, WorkspacesList } from '@/components/Home'
import { mapGetters } from 'vuex'
export default {
  components: { Welcome, WorkspacesList },
  computed: {
    ...mapGetters({authenticated: 'getAuthenticated', workspaces: 'getWorkspacesPreview'})
  }
}
</script>
