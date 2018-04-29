<template>
  <md-app-toolbar md-elevation="0" class="md-primary">
    <div class="md-toolbar-section-start">
      <md-button @click="$emit('show-menu')" class="md-icon-button">
        <md-icon>menu</md-icon>
      </md-button>
      <h2>Task Manager</h2>
    </div>
  </md-app-toolbar>
</template>