<template>
  <div class="drawer">
    <div>
      <md-toolbar md-elevation="0" class="md-primary ">
          <md-button @click="$emit('close')" class="md-icon-button">
            <md-icon class="animated rotateIn">close</md-icon>
          </md-button>
          <h2 @click="goHome" class="drawer-title">Task Manager</h2>
      </md-toolbar>
      <div v-if="authenticated && user">
        <md-toolbar md-elevation="0" class="md-medium padding-left">
          <div @click="$router.push('/profile')" class="user-preview">
            <avatar :fullname="name" :size="54"></avatar>
            <div class="user-text">
              <h3>{{name}}</h3>
              <p>{{user.email}}</p>
            </div>
          </div>
        </md-toolbar>
        <md-list class="no-padding">
          <md-list-item v-for="workspace in workspaces" :key="workspace._id" @click="openWorkspace(workspace._id)">
            <md-avatar class="border">
              <img :src="workspace.picture" alt="Workspace Picture">
            </md-avatar>
            <span class="md-list-item-text">{{workspace.title}}</span>
          </md-list-item>
          <md-divider></md-divider>
          <md-list-item @click="createWorkspace">
            <md-avatar class="md-avatar-icon md-accent">
              <md-icon>add</md-icon>
            </md-avatar>
            <span class="md-list-item-text">Create Workspace</span>
          </md-list-item>
        </md-list>
      </div>
      <div v-else>
        <md-list class="no-padding">
          <md-list-item @click="login()">
            <md-icon>account_circle</md-icon>
            <span class="md-list-item-text">Log in</span>
          </md-list-item>
        </md-list>
      </div>
    </div>
    <div>
      <md-list class="no-padding" v-if="authenticated && user">
        <md-list-item @click="logout()">
          <md-icon>power_settings_new</md-icon>
          <span class="md-list-item-text">Log out</span>
        </md-list-item>
      </md-list>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  computed: {
    ...mapGetters({authenticated: 'getAuthenticated', user: 'getUser', workspaces: 'getWorkspaces'}),
    name () {
      return this.user && this.user.firstName + ' ' + this.user.lastName
    }
  },
  methods: {
    ...mapMutations(['setDialog']),
    ...mapActions(['logOut']),
    goHome () {
      this.$emit('close')
      this.$router.push('/')
    },
    login () {
      this.$emit('close')
      this.setDialog('login')
    },
    openWorkspace (workspaceID) {
      this.$emit('close')
      this.$router.push('/workspace/' + workspaceID)
    },
    createWorkspace () {
      this.$emit('close')
      this.setDialog('create_workspace')
    },
    logout () {
      this.logOut()
      this.goHome()
    }
  }
}
</script>
<style lang="scss" scoped>
.drawer{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: calc(100vh);
}
.drawer-title{
  cursor: pointer;
}
.md-toolbar-row{
  min-height: 64px;
}
.drawer .md-list-item-container{
  font-size: 1.25em;
}
.drawer .md-list .md-icon{
  font-size: 1.25em!important;
}
.user-preview{
  display: flex;
  justify-content: center;
  align-items: center; 
  cursor: pointer;
}
.user-preview > .user-text{
  margin-left: 1em;
}
.user-preview h3, .user-preview p {
  margin: 0;
}
</style>
