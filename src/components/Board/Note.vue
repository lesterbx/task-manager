<template>
  <div class="note animated fadeIn">
    <p class="no-margin">{{note.text}}</p>
  </div>
</template>
<script>
export default {
  props: ['note']
}
</script>
<style scoped>
.note{
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 0.75em;
  font-size: 1em;
  background-color: #fff;
  z-index: 10;
}
.note + .note{
  margin-top: 1em;
}
.note p {
  white-space: pre-wrap;
}
</style>
