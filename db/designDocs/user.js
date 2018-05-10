const { validateUser } = require('../../src/utils/validators')
module.exports = {
  _id: '_design/user',
  language: 'javascript',
  validate_doc_update: JSON.parse(validateUser)
}