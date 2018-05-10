<template>
  <div>
    <welcome v-if="!authenticated"></welcome>
    <workspaces-list v-else :workspaces="workspaces"></workspaces-list>
  </div>
</template>
<script>
import { Welcome, WorkspacesList } from '@/components/Home'
import { mapGetters, mapActions } from 'vuex'
export default {
  components: { Welcome, WorkspacesList },
  data () {
    return {
      loading: false
    }
  },
  computed: {
    ...mapGetters({authenticated: 'getAuthenticated', workspaces: 'getWorkspaces'})
  },
  methods: {
    ...mapActions(['readWorkspaces'])
  }
}
</script>
