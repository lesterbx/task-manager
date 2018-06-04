<template>
  <md-menu md-align-trigger md-direction="bottom-start" md-size="medium">
    <md-button class="md-icon-button md-mini" md-menu-trigger>
      <md-icon>more_vert</md-icon>
    </md-button>
    <md-menu-content>
      <md-list>
        <md-list-item @click="rename">
          <md-icon>edit</md-icon>
          <span class="md-list-item-text">Rename</span>
        </md-list-item>
        <md-list-item @click="remove">
          <md-icon>delete</md-icon>
          <span class="md-list-item-text">Delete</span>
        </md-list-item>
        </md-list>
    </md-menu-content>
  </md-menu>
</template>
<script>
import { mapMutations } from 'vuex'
export default {
  props: ['columnID'],
  methods: {
    ...mapMutations(['setDialog']),
    rename () {
      this.setDialog({ name: 'rename-column', action: 'renameColumn', params: { columnID: this.columnID } })
    },
    remove () {
      this.setDialog({ name: 'delete-column', action: 'deleteColumn', params: { columnID: this.columnID }, success: 'Column deleted' })
    }
  }
}
</script>

