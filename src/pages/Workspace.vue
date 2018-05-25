<template>
  <spinner v-if="loading"></spinner>
  <router-view v-else></router-view>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { Spinner } from '@/components/Common'
export default {
  name: 'Workspace',
  components: { Spinner },
  data () {
    return {
      workspaceID: ''
    }
  },
  computed: {
    ...mapGetters({loading: 'getLoadingWorkspace'})
  },
  methods: {
    ...mapActions(['syncWorkspaceDB', 'unsyncWorkspaceDB', 'readWorkspaceBoards']),
    ...mapMutations(['setCurrentWorkspace'])
  },
  mounted () {
    this.workspaceID = this.$route.params.workspaceID
    commit('setCurrentWorkspace', this.workspaceID)
    this.syncWorkspaceDB(this.workspaceID)
  },
  beforeDestroy () {
    this.unsyncWorkspaceDB(this.workspaceID)
  },
  beforeRouteUpdate (to, from, next) {
    if (this.workspaceID !== to.params.workspaceID) {
      this.workspaceID = to.params.workspaceID
      this.unsyncWorkspaceDB(from.params.workspaceID)
      this.syncWorkspaceDB(to.params.workspaceID)
    }
    next()
  }
}
</script>

