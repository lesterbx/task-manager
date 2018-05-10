<template>
  <div class="welcome padding">
    <div class="home-badge big-badge">
      <img src="/static/img/presentation.svg" class="animated fadeIn">
      <div class="animated fadeInUp">
        <h1>Manage your projects</h1>
        <p>
          Keep track of your projects and organize them in an easy and efficient way.
        </p>
        <div>
          <md-button class="md-raised md-accent" @click="setDialog('login')">Start Working</md-button>
        </div>
      </div>
    </div>
    <div class="home-badge small-badge small-badge-1">
      <img src="/static/img/group.svg" class="animated fadeIn">
      <div class="animated fadeInRight">
        <h2 class="no-margin">Collaborative</h2>
        <p>
          Work together with your team to get the best results.
        </p>
      </div>
    </div>
    <div class="home-badge small-badge small-badge-2">
      <img src="/static/img/development.svg" class="animated fadeIn">
      <div class="animated fadeInRight">
        <h2 class="no-margin">Work Offline</h2>
        <p> 
          Access your workspaces even you are not connected.
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import {mapMutations} from 'vuex'
export default {
  methods: {
    ...mapMutations(['setDialog'])
  }
}
</script>
<style scoped>
.welcome{
  display: flex;
  flex-direction: column;
  font-size: 1.3em;
  padding-top: 3em;
  min-height: calc(100vh - 64px);
  background-color: #fff;
}
.home-badge{
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 3em;
}
.home-badge + .home-badge{
  padding-top: 4em;
  border-top: 2px solid #eee;
  margin-top: 1em;
}
.home-badge > div{
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 1em;
}
.home-badge h1{
  line-height: 1em;
}
.home-badge h2{
  line-height: 1em;
}
.home-badge p{
  line-height: 1.25em;
}
.big-badge{
  flex-direction: column;
  align-items: center;
}
.small-badge img{
  width: 30%;
  margin-left: 1em;
}
.big-badge img{
  width: 55%;
}
@media screen and (min-width: 600px){
  .welcome{
    display: grid;
    grid-template-columns: 50% 50%;
    grid-template-rows: 50% 50%;
  }
  .home-badge{
    padding: 0;
  }
  .small-badge{
    margin-left: 2em;
  }
  .home-badge + .home-badge{
    padding-top: 0;
    border-top: none;
    margin-top: 0;
  }
  .home-badge + .home-badge + .home-badge{
    border-top: 2px solid #eee;
  }
  .big-badge{
    grid-column: 1;
    grid-column-start: 1;
    grid-row-start: 1;
    grid-row-end: span 2;
  }
  .small-badge-1{
    grid-column-start: 2;
    grid-column-start: 2;
    grid-row-start: 1;
    grid-row-end: 1;
  }
  .small-small-2{
    grid-column-start: 2;
    grid-column-start: 2;
    grid-row-start: 2;
    grid-row-end: 2;
  }
}
</style>



