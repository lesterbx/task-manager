<template>
  <md-dialog :md-active.sync="showDialog" :md-fullscreen="false">
      <div class="padding margin" action="javascript:void(0)" autocomplete="nope">
        <h3 class="text-center">Create workspace</h3>
        <div class="md-layout">
          <div class="md-layout-item md-size-40 padding-right picture-wrapper">
            <picture-input @change="pictureSelected" :hideChangeButton="true" size="1" :customStrings="{drag: 'Picture', tap: 'Picture'}" @error="pictureError" :alertOnError="false"></picture-input>
          </div>
          <div class="md-layout-item">
            <md-field>
              <label>Title</label>
              <md-input v-model="workspace.title" autocomplete="nope" @keyup="setID"></md-input>
            </md-field>
            <md-field>
              <label>Workspace ID</label>
              <md-input v-model="workspace._id" autocomplete="nope"></md-input>
            </md-field>
          </div>
        </div>
        
        <md-chips :md-check-duplicated="false" md-input-type="email" v-model="workspace.users" md-placeholder="User emails, enter and press enter"></md-chips>
        
        <md-field>
          <label>Description</label>
          <md-textarea rows="2" v-model="workspace.description"></md-textarea>
        </md-field>

        <div class="full-width text-center">
          <md-button @click="create" class="md-raised md-accent" type.native="submit">Create</md-button>
        </div>
      </div>
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
      }
    }
  },
  computed: {
    ...mapGetters({dialog: 'getDialog'}),
    showDialog: {
      get () {
        return this.dialog === 'create-workspace'
      },
      set (show) {
        this.setDialog(show ? 'create-workspace' : null)
      }
    }
  },
  methods: {
    ...mapMutations(['setDialog', 'setMessage']),
    ...mapActions(['createWorkspace']),
    create () {
      this.createWorkspace({workspace: this.workspace, password: this.password})
        .then(() => this.setDialog(null))
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
<style lang="scss">
  .md-chip{
    margin-left: 4px!important;
  }
  .picture-wrapper{
    display: flex;
    align-items: center;
  }
  .picture-inner-text{
    color: #666666;
    font-size: 3em!important;
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
</style>
