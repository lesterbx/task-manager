<template>
  <div>
    <welcome v-if="!authenticated"></welcome>
    <workspaces-list v-else :workspaces="workspacesPreviews"></workspaces-list>
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
    ...mapGetters({authenticated: 'getAuthenticated', workspacesPreviews: 'getWorkspacesPreviews'})
  },
  methods: {
    ...mapActions(['readWorkspacesPreviews'])
  },
  mounted () {
    if (this.authenticated) {
      this.loading = true
      this.readWorkspacesPreviews().then(() => { this.loading = false })
    }
  }
}
</script>