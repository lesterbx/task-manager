<template>
  <md-app-toolbar md-elevation="0" class="md-large md-primary">
    <div class="md-toolbar-row">
      <div class="md-toolbar-section-start">
        <md-button @click="$emit('show-menu')" class="md-icon-button">
          <md-icon>menu</md-icon>
        </md-button>
      </div>
      <div class="md-toolbar-section-end">
        <md-button class="md-icon-button">
          <md-icon>more_vert</md-icon>
        </md-button>
      </div>
    </div>
    <div class="md-toolbar-row md-toolbar-offset">
      <h2>Workspace</h2>
    </div>
  </md-app-toolbar>
</template>
<script>
export default {
}
</script>
