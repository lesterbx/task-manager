<template>
  <md-menu md-direction="bottom-end" md-size="big">
    <md-button class="md-icon-button md-mini" md-menu-trigger>
      <md-icon>more_vert</md-icon>
    </md-button>
    <md-menu-content>
      <md-list>
        <md-list-item @click="$emit('remane')">
          <md-icon>edit</md-icon>
          <span class="md-list-item-text">Make admin</span>
        </md-list-item>
        <md-list-item @click="$emit('delete')">
          <md-icon>delete</md-icon>
          <span class="md-list-item-text">Remove</span>
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

