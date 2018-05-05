<template>
  <md-card md-with-hover>
    <md-ripple>
      <md-card-media>
        <img :src="workspace.picture" alt="Workspace picture">
      </md-card-media>
      <md-card-area>
        <md-card-header>
          <div class="md-title">{{workspace.title}}</div>
          <div class="md-subhead">{{workspace.description}}</div>
        </md-card-header>
      </md-card-area>
    </md-ripple>
  </md-card>
</template>
<script>
export default {
  props: ['workspace']
}
</script>
<style>
.md-card{
  margin-left: 0!important;
  margin-right: 0!important;
}
.md-card + .md-card{
  margin-top: 1em!important;
}
</style>
