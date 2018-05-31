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
    ...mapActions(['openWorkspace', 'closeWorkspace']),
    ...mapMutations(['setCurrentWorkspace'])
  },
  mounted () {
    this.workspaceID = this.$route.params.workspaceID
    this.openWorkspace(this.workspaceID)
  },
  beforeDestroy () {
    this.closeWorkspace(this.workspaceID)
  },
  beforeRouteUpdate (to, from, next) {
    if (this.workspaceID !== to.params.workspaceID) {
      this.workspaceID = to.params.workspaceID
      this.closeWorkspace(from.params.workspaceID)
      this.openWorkspace(to.params.workspaceID)
    }
    next()
  }
}
</script>

