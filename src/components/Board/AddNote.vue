<template>
  <div class="add-note padding">
    <textarea rows="3" v-model="text" placeholder="Enter a note"></textarea>
    <div class="add-note-buttons">
      <md-button class="md-dense no-margin" @click="$emit('cancel')">Cancel</md-button>
      <md-button class="md-primary md-dense no-margin" @click="$emit('add', text)" :disabled="text.length === 0">Add</md-button>
    </div>
  </div>
</template>
<script>
import autosize from 'autosize'

export default {
  data () {
    return {
      text: ''
    }
  },
  mounted () {
    autosize(document.querySelectorAll('textarea'))
  }
}
</script>
<style>
.add-note textarea{
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 0.75em;
  font-size: 1em;
}
.add-note-buttons{
  display: flex;
  justify-content: flex-end;
  padding-top: 0.5em;
}
</style>

