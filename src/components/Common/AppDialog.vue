<template>
  <div>
    <div>
      <login v-if="dialog.name === 'login'" @confirm="confirm"></login>
    </div>
    <div>
      <signup v-if="dialog.name === 'signup'" @confirm="confirm"></signup>
    </div>
    <div>
      <edit-workspace v-if="dialog.name === 'create-workspace' || dialog.name === 'edit-workspace' " @confirm="confirm"></edit-workspace>
    </div>
    <div>
      <create-board v-if="dialog.name === 'create-board'" @confirm="confirm"></create-board>
    </div>
    <div>
      <workspace-users v-if="dialog.name === 'workspace-users'" @confirm="confirm"></workspace-users>
    </div>
    <div>
      <add-user v-if="dialog.name === 'add-user'" @confirm="confirm"></add-user>
    </div>
    <div>
      <password v-if="dialog.name === 'password'" @confirm="confirm"></password>
    </div>
    <div>
      <rename-board v-if="dialog.name === 'rename-board'" @confirm="confirm"></rename-board>
    </div>
    <div>
      <delete-board v-if="dialog.name === 'delete-board'" @confirm="confirm"></delete-board>
    </div>
    <div>
      <rename-column v-if="dialog.name === 'rename-column'" @confirm="confirm"></rename-column>
    </div>
    <div>
      <delete-column v-if="dialog.name === 'delete-column'" @confirm="confirm"></delete-column>
    </div>
    <div>
      <delete-note v-if="dialog.name === 'delete-note'" @confirm="confirm"></delete-note>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import { Login, Signup, EditWorkspace, CreateBoard, WorkspaceUsers, AddUser, Password, RenameBoard, DeleteBoard, RenameColumn, DeleteColumn, DeleteNote } from '@/components/Dialogs'
export default {
  components: { Login, Signup, EditWorkspace, CreateBoard, WorkspaceUsers, AddUser, Password, RenameBoard, DeleteBoard, RenameColumn, DeleteColumn, DeleteNote },
  computed: {
    ...mapGetters({ dialog: 'getDialog' })
  },
  methods: {
    ...mapMutations(['setDialog', 'setMessage', 'closeDialog']),
    confirm (params) {
      this.$store.dispatch(this.dialog.action, { ...this.dialog.params, ...params })
        .then(() => {
          this.setMessage(this.dialog.success || '')
          this.closeDialog()
        })
        .catch((error) => {
          this.setMessage(error)
        })
    }
  }
}
</script>