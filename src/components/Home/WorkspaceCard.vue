<template>
  <md-card class="animated fadeInUp" md-with-hover @click.native="$router.push('/workspace/' + workspace._id)">
    <md-ripple>
      <md-card-area>
        <md-card-header>
          <md-card-header-text class="flex-column space-between">
            <div>
              <div class="md-title no-margin">{{workspace.title}}</div>
              <div class="md-subhead">{{workspace.description}}</div>
            </div>
            <span class="md-caption last-activity">Last activity from user</span>
          </md-card-header-text>
          <md-card-media :md-medium="true">
            <div class="workspace-card-picture" :style="`background-image: url('${workspace.picture}');`"></div>
          </md-card-media>
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
<style scoped>
.md-card{
  margin-left: 0!important;
  margin-right: 0!important;
}
.md-card-header:last-child{
  margin-bottom: 0;
}
.md-card + .md-card{
  margin-top: 1em!important;
}
.workspace-card-picture {
  width: 100%;
  height: 100%;
  background-position: center;
  background-size: cover;
}
.md-card .md-title{
  font-size: 1.25em;
}
.last-activity{
  align-self: flex-end;
}
@media screen and (min-width: 324px){
  .md-card .md-title{
    font-size: 1.5em;
  }
}
@media screen and (min-width: 648px){
  .md-card .md-title{
    font-size: 1.75em;
  }
}
</style>
