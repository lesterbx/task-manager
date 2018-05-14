<template>
  <div class="column margin-right animated fadeIn">
    <md-card v-if="!adding"  class="no-margin text-center padding">
      <md-button class="md-primary full-width no-margin" @click="adding = true">Add column</md-button>
    </md-card>
    <md-card v-else class="no-margin">
      <md-card-content>
        <md-field class="no-margin add-column-input" :md-inline="true">
          <md-input v-model="title" placeholder="Column title" @keyup.enter="addColumn"></md-input>
        </md-field>
      </md-card-content>
      <md-card-actions>
        <md-button class="md-dense" @click="reset">Cancel</md-button>
        <md-button class="md-primary md-dense" @click="addColumn">Add</md-button>
      </md-card-actions>
    </md-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      adding: false,
      title: ''
    }
  },
  methods: {
    reset () {
      this.adding = false
      this.title = ''
    },
    addColumn () {
      this.$emit('add-column', this.title)
      this.reset()
    }
  }
}
</script>

