<template>
  <md-menu md-align-trigger md-direction="bottom-start" md-size="small">
    <md-button class="md-icon-button" md-menu-trigger>
      <md-icon>more_vert</md-icon>
    </md-button>
    <md-menu-content>
      <md-list>
        <md-list-item @click="setDialog({ name: 'create-workspace', action: 'createWorkpsace', success: 'Workspace created' })">
          <md-icon>add</md-icon>
          <span class="md-list-item-text">Create Workspace</span>
        </md-list-item>
      </md-list>
    </md-menu-content>
  </md-menu>
</template>
<script>
import { mapMutations } from 'vuex'
export default {
  methods: {
    ...mapMutations(['setDialog'])
  }
}
</script>

