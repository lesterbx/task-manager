<template>
  <md-menu md-direction="bottom-end" md-size="big">
    <md-button class="md-icon-button md-mini" md-menu-trigger>
      <md-icon>more_vert</md-icon>
    </md-button>
    <md-menu-content>
      <md-list v-if="!self">
        <md-list-item v-if="!admin" @click="$emit('admin')">
          <md-icon>verified_user</md-icon>
          <span class="md-list-item-text">Make admin</span>
        </md-list-item>
        <md-list-item v-else @click="$emit('revoke')">
          <md-icon>remove_circle_outline</md-icon>
          <span class="md-list-item-text">Revoke admin</span>
        </md-list-item>
        <md-list-item @click="$emit('delete')">
          <md-icon>delete</md-icon>
          <span class="md-list-item-text">Remove</span>
        </md-list-item>
      </md-list>
      <md-list v-else>
        <md-list-item @click="$emit('leave')">
            <md-icon>exit_to_app</md-icon>
            <span class="md-list-item-text">Leave workspace</span>
        </md-list-item>
      </md-list>
    </md-menu-content>
  </md-menu>
</template>
<script>
export default {
  props: ['admin', 'self']
}
</script>
