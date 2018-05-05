<template>
  <div>
    <div class="md-toolbar-section-start">
      <md-button @click="$emit('show-menu')" class="md-icon-button">
        <md-icon>menu</md-icon>
      </md-button>
      <h2>{{title}}</h2>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      title: 'Task Manager'
    }
  }
}
</script>

