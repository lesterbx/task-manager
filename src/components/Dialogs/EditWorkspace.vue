<template>
  <md-dialog :md-active.sync="showDialog" :md-fullscreen="false">
      <div class="padding margin animated fadeIn" action="javascript:void(0)" autocomplete="nope">
        <h3 v-if="isNew" class="text-center">Create workspace</h3>
        <h3 v-if="edit" class="text-center">Edit workspace</h3>
        <form action="javascript:void(0)" :class="!edit && !isNew && 'form-read-only'">
          <input type="password" style="display:none">
          <div class="md-layout">
            <div class="md-layout-item md-xsmall-size-100 md-small-size-40">
              <div class="picture-wrapper">
                <picture-input v-if="isNew || edit" :prefill="workspace.picture"  @change="pictureSelected" :hideChangeButton="true" size="1" :customStrings="{drag: 'Picture', tap: 'Picture'}" @error="pictureError" :alertOnError="false">
                </picture-input>
                <div class="preview-picture" v-if="!isNew && !edit" :style="`background-image: url('${workspace.picture}')`"></div>
              </div>
            </div>
            <div class="md-layout-item">
              <md-field>
                <label>Title</label>
                <md-input :disabled="!isNew && !edit" v-model="workspace.title" autocomplete="nope" @keyup="isNew && setID()"></md-input>
              </md-field>
              <md-field>
                <label>Workspace ID</label>
                <md-input :disabled="!isNew" v-model="workspace._id" autocomplete="nope"></md-input>
                <span v-if="isNew" class="md-helper-text">Cannot be changed later</span>
              </md-field>
              <md-field class="margin-top">
                <label>Description</label>
                <md-textarea :disabled="!isNew && !edit" v-model="workspace.description" md-autogrow></md-textarea>
              </md-field>
            </div>
          </div>
          
          <md-chips v-if="isNew" :md-check-duplicated="true" md-input-type="text" v-model="workspace.users" md-placeholder="User emails, write and press enter"></md-chips>
          
          <md-divider v-if="isNew"></md-divider>
          <md-field v-if="isNew">
            <label>Password</label>
            <md-input type="password" v-model="password" autocomplete="new-password" name="psw"></md-input>
            <span class="md-helper-text">Enter your password for security</span>
          </md-field>
        </form>
      </div>
      <md-card-actions>
        <md-button v-if="isNew || edit" @click="closeDialog()">Cancel</md-button>
        <md-button v-if="isNew" class="md-primary" @click="$emit('confirm', { workspace, password })">Create</md-button>
        <md-button v-if="!isNew && !edit && currentAdmin" class="md-primary" @click="startEdit">edit</md-button>
        <md-button v-if="!isNew && edit" class="md-primary" @click="$emit('confirm', { workspace })">Save</md-button>
      </md-card-actions>
  </md-dialog>
</template>
<script>
import PictureInput from 'vue-picture-input'
import slugify from 'slugify'
import { mapActions, mapGetters, mapMutations } from 'vuex'
export default {
  name: 'create-workspace',
  components: { PictureInput },
  data () {
    return {
      workspace: {
        title: '',
        _id: '',
        users: [],
        picture: null,
        description: ''
      },
      password: '',
      edit: false
    }
  },
  computed: {
    ...mapGetters({dialog: 'getDialog', getWorkspace: 'getWorkspace', currentWorkspace: 'getCurrentWorkspace', user: 'getUser'}),
    showDialog: {
      get () {
        return this.dialog.name === 'create-workspace' || this.dialog.name === 'edit-workspace'
      },
      set (show) {
        !show && this.closeDialog()
      }
    },
    isNew () {
      return this.dialog.name === 'create-workspace'
    },
    currentAdmin () {
      return this.getWorkspace(this.currentWorkspace).admins.includes(this.user.email)
    }
  },
  mounted () {
    if (this.dialog.name === 'edit-workspace') {
      this.workspace = { ...this.getWorkspace(this.currentWorkspace) }
    }
  },
  methods: {
    ...mapMutations(['closeDialog', 'setMessage', 'setDialog']),
    ...mapActions(['createWorkspace', 'updateWorkspace']),
    startEdit () {
      this.setDialog({ ...this.dialog, action: 'updateWorkspace', success: 'Workspace Updated' })
      this.edit = true
    },
    setID () {
      this.workspace._id = slugify(this.workspace.title, {lower: true})
    },
    pictureSelected (picture) {
      this.workspace.picture = picture
    },
    pictureError ({message}) {
      this.setMessage(message)
    }
  }
}
</script>
<style lang="scss" scoped>
  .md-chip{
    margin-left: 4px!important;
  }
  .picture-wrapper{
    display: flex;
    align-items: center;
    width: 30%;
    margin: auto;
  }
  .preview-picture{
    background-size: cover;
    width:100%;
    padding-top: 67%;
  }
  .picture-inner-text{
    color: #666666;
    font-size: 10em!important;
  }
  .md-field.md-has-textarea:not(.md-autogrow):after, .md-field.md-has-textarea:not(.md-autogrow):before{
    border-left: none;
    border-top: none;
    border-right: none;
    border-radius: 0;
  }
  .md-textarea{
    padding: 0!important;
    padding-top: 10px!important;
  }
  .md-field.md-has-textarea:not(.md-autogrow) label{
    left: 0!important;
  }
  .md-field+.md-has-textarea:not(.md-autogrow){
    margin-top: 0;
  }
  .form-read-only .md-field::after, .form-read-only .md-field.md-focused::after{
    background-color: transparent!important;
  }
  .md-field.md-theme-default.md-disabled::after{
    background-image: none!important;
  }
  @media screen and (min-width: 600px){
    .picture-wrapper{
      width: 100%;
      padding-right: 1em;
    }
    .picture-inner-text{
      font-size: 4em!important;
    }
  }
</style>
