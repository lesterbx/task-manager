<template>
  <md-menu md-align-trigger md-direction="bottom-start" md-size="big">
    <md-button class="md-icon-button" md-menu-trigger>
      <md-icon>more_vert</md-icon>
    </md-button>
    <md-menu-content>
      <md-list>
        <md-list-item @click="setDialog({ name: 'edit-workspace', action: 'updateWorkspace' })">
          <md-icon>info</md-icon>
          <span class="md-list-item-text">Information</span>
        </md-list-item>
        <md-list-item @click="setDialog({ name: 'workspace-users' })">
          <md-icon>people</md-icon>
          <span class="md-list-item-text">Users</span>
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

