<template>
  <div>
    <login></login>
    <signup></signup>
    <edit-workspace></edit-workspace>
    <create-board></create-board>
    <workspace-users></workspace-users>
    <add-user></add-user>
    <password></password>
    <rename-board></rename-board>
    <delete-board></delete-board>
  </div>
</template>
<script>
import { Login, Signup, EditWorkspace, CreateBoard, WorkspaceUsers, AddUser, Password, RenameBoard, DeleteBoard } from '@/components/Dialogs'
export default {
  components: { Login, Signup, EditWorkspace, CreateBoard, WorkspaceUsers, AddUser, Password, RenameBoard, DeleteBoard }
}
</script>