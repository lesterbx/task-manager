<template>
  <md-dialog :md-active.sync="showDialog" :md-fullscreen="false">
    <form action="javascript:void(0)">
      <div class="margin padding">
        <md-field>
          <label>User email</label>
          <md-input type="email" v-model="email"></md-input>
        </md-field>
        <md-field>
          <label>Password</label>
          <md-input type="password" v-model="password" autocomplete="new-password"></md-input>
          <span class="md-helper-text">Enter your password for security</span>
        </md-field>
      </div>
      <md-card-actions>
        <md-button @click="reset">Cancel</md-button>
        <md-button type="submit" class="md-primary" @click="add">Add</md-button>
      </md-card-actions>
    </form>
  </md-dialog>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  name: 'create-board',
  data () {
    return {
      email: '',
      password: ''
    }
  },
  computed: {
    ...mapGetters({ dialog: 'getDialog' }),
    showDialog: {
      get () {
        return this.dialog === 'add-user'
      },
      set (show) {
        this.setDialog(show ? 'add-user' : null)
      }
    }
  },
  methods: {
    ...mapMutations(['setDialog', 'setMessage']),
    ...mapActions(['addUserToWorkspace']),
    reset () {
      this.setDialog(null)
      this.email = ''
      this.password = ''
    },
    add () {
      this.addUserToWorkspace({ email: this.email, password: this.password, workspaceID: this.$route.params.id })
        .then(() => {
          this.setMessage('User added succesfully')
          this.setDialog(null)
        })
    }
  }
}
</script>
