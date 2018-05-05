<template>
  <div>
    <md-empty-state md-icon="dashboard" md-label="Create your first board" md-description="Create a board and start collaborating with your team.">
      <md-button @click="showBoardDialog = true" class="md-accent md-raised">Create board</md-button>
    </md-empty-state>
  </div>
</template>
<script>
export default {
  name: 'Workspace'
}
</script>