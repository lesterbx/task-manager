<template>
  <md-card md-with-hover @click.native="setDialog('create-workspace')">
    <md-ripple>
      <md-card-area>
        <md-card-header>
          <md-card-header-text class="flex-column space-between">
            <div>
              <div class="md-title no-margin">Create Workspace</div>
              <div class="md-subhead">Create a workspace and start collaborating with your team.</div>
            </div>
            <div class="full-width text-right padding-right margin-right">
              <md-button class="md-small md-accent" >Create workspace</md-button>
            </div>
          </md-card-header-text>
          <md-card-media :md-medium="true">
            <div class="workspace-card-picture" style="background-image: url('/static/img/project.svg')"></div>
          </md-card-media>
        </md-card-header>
      </md-card-area>
    </md-ripple>
  </md-card>
</template>
<script>
import { mapMutations } from 'vuex'
export default {
  methods: {
    ...mapMutations(['setDialog'])
  }
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
</style>
