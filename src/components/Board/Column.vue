<template>
  <div class="column animated fadeIn">
    <md-card class="no-margin">
      <md-card-header>
        <h3 class="no-margin">{{column.title}}</h3>
      </md-card-header>
      <md-divider></md-divider>
      <div class="padding">
      </div>
      <md-divider></md-divider>
      <md-card-actions>
        <md-button class="md-primary">Add Note</md-button>
      </md-card-actions>
    </md-card>
  </div>
</template>
<script>
export default {
  props: ['column']
}
</script>