<template>
  <div>
    <login></login>
    <signup></signup>
    <edit-workspace></edit-workspace>
    <create-board></create-board>
    <workspace-users></workspace-users>
    <add-user></add-user>
  </div>
</template>
<script>
import { Login, Signup, EditWorkspace, CreateBoard, WorkspaceUsers, AddUser } from '@/components/Dialogs'
export default {
  components: { Login, Signup, EditWorkspace, CreateBoard, WorkspaceUsers, AddUser }
}
</script>