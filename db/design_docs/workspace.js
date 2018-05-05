const { validateWorkspace } = require('../../src/utils/validators')
module.exports = {
  _id: 'workspace',
  language: 'javascript',
  validate_doc_update: JSON.parse(validateWorkspace)
}