<template>
  <md-app-drawer :md-active.sync="menuVisible" @md-closed="$emit('closed')" >
    <md-toolbar md-elevation="0" class="md-primary ">
        <md-button @click="$emit('closed')" class="md-icon-button">
          <md-icon>close</md-icon>
        </md-button>
        <h2>Task Manager</h2>
    </md-toolbar>
    <md-list>
      <md-list-item @click="login">
        <md-icon>account_circle</md-icon>
        <span class="md-list-item-text">Log in</span>
      </md-list-item>
    </md-list>
  </md-app-drawer>
</template>
<script>
export default {
  props: ['mdActive'],
  data () {
    return {
      menuVisible: false
    }
  },
  watch: {
    mdActive (active) {
      this.menuVisible = active
    }
  },
  methods: {
    login () {
      this.$emit('open-login')
    }
  }
}
</script>
<style lang="scss" scoped>
.md-toolbar-row{
  min-height: 64px;
}
.md-drawer .md-list-item-container{
  font-size: 1.25em;
}
.md-drawer .md-list .md-icon{
  font-size: 1.25em!important;
}
</style>


