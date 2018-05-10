<template>
  <div class="md-toolbar-row">
    <div class="md-toolbar-section-start">
      <md-button @click="$emit('show-menu')" class="md-icon-button">
        <md-icon>menu</md-icon>
      </md-button>
      <h2>{{title}}</h2>
    </div>
    <div class="md-toolbar-section-end">
      <md-button v-if="$route.name === 'Workspace'" class="md-icon-button">
        <md-icon>info_outline</md-icon>
      </md-button>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      id: ''
    }
  },
  computed: {
    ...mapGetters({ workspace: 'getWorkspace' }),
    title () {
      if (this.$route.name === 'Home') {
        return 'Task Manager'
      } else if (this.$route.name === 'Workspace') {
        return this.workspace(this.id) ? this.workspace(this.id).title : 'Task Manager'
      }
    }
  },
  watch: {
    $route () {
      this.id = this.$route.params.id
    }
  },
  created () {
    this.id = this.$route.params.id
  }
}
</script>
<style>
.md-toolbar-section-start{
flex: auto;
}
</style>

