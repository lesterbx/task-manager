<template>
  <md-dialog :md-active.sync="showDialog" :md-fullscreen="false" class="padding">
    <div class="users-header">
      <h3 :class="currentAdmin && 'no-margin'">Workspace Users</h3>
      <md-button v-if="currentAdmin" @click="setDialog('add-user')" class="md-primary md-mini" md-menu-trigger>Add User</md-button>
    </div>
    <md-divider></md-divider>
    <md-list class="md-double-line">
      <md-list-item v-for="user in users" :key="user.email">
        <avatar class="margin-right" :fullname="user.firstName + ' ' + user.lastName " :size="42"></avatar>
        <div class="md-list-item-text">
          <span>{{ user.firstName + ' ' + user.lastName }}</span>
          <span>{{ user.email }}</span>
        </div>
        <md-badge v-if="isAdmin(user.email)" class="md-square md-primary margin-right" md-content="Admin"></md-badge>
        <user-menu v-if="currentAdmin" :admin="isAdmin(user.email)" :self="currentUser.email === user.email" class="md-list-action" @admin="makeAdmin(user.email)" @revoke="removeAdmin(user.email)" @delete="deleteUser(user.email)"></user-menu>
      </md-list-item>
    </md-list>
  </md-dialog>
</template>
<script>
import { UserMenu } from '@/components/Menus'
import { mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  components: { UserMenu },
  computed: {
    ...mapGetters({dialog: 'getDialog', currentUser: 'getUser', users: 'getWorkspaceUsers', admins: 'getWorkspaceAdmins'}),
    showDialog: {
      get () {
        return this.dialog === 'workspace-users'
      },
      set (show) {
        this.setDialog(show ? 'workspace-users' : null)
      }
    },
    currentAdmin () {
      return this.currentUser && this.isAdmin(this.currentUser.email)
    }
  },
  methods: {
    ...mapActions(['addAdminToWorkspace', 'removeAdminFromWorkspace', 'removeUserFromWorkspace']),
    ...mapMutations(['setDialog', 'setPendingAction']),
    isAdmin (user) {
      return this.admins && this.admins.includes(user)
    },
    makeAdmin (email) {
      this.setPendingAction({ action: 'addAdminToWorkspace', params: { email }, success: 'Admin added succesfully' })
      this.setDialog('password')
    },
    removeAdmin (email) {
      this.setPendingAction({ action: 'removeAdminFromWorkspace', params: { email }, success: 'Admin revoked succesfully' })
      this.setDialog('password')
    },
    deleteUser (email) {
      this.setPendingAction({ action: 'removeUserFromWorkspace', params: { email }, success: 'User removed succesfully' })
      this.setDialog('password')
    }
  }
}
</script>
<style>
.users-header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.5em;
  padding-left: 0.5em;
}
</style>
