const { validateUser } = require('../../src/utils/validators')
module.exports = {
  _id: 'user',
  language: 'javascript',
  validate_doc_update: JSON.parse(validateUser)
}