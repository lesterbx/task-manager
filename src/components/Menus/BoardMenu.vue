<template>
  <md-menu md-align-trigger md-direction="bottom-start" md-size="medium">
    <md-button class="md-icon-button" md-menu-trigger>
      <md-icon>more_vert</md-icon>
    </md-button>
    <md-menu-content>
      <md-list>
        <md-list-item @click="setDialog('rename-board')">
          <md-icon>edit</md-icon>
          <span class="md-list-item-text">Rename</span>
        </md-list-item>
        <md-list-item @click="setDialog('delete-board')">
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
  methods: {
    ...mapMutations(['setDialog'])
  }
}
</script>

