const { validateWorkspace } = require('../../src/utils/validators')
module.exports = {
  _id: '_design/workspace',
  language: 'javascript',
  validate_doc_update: JSON.parse(validateWorkspace),
  views: {
    workspaceBoards: {
      'map': function(doc) { }
    }
  }
}