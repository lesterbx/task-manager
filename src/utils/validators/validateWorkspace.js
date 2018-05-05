/* eslint-disable */
export default function (newDoc, savedDoc) {
  if (!newDoc._deleted) {
    function required(field, message) {
      if (!newDoc[field] || newDoc[field] === '') {
        throw ({ forbidden: message })
      }
    }
    required('title', 'Missing title')
    required('users', 'Missing users')
    required('picture', 'Missing picture')
    required('description', 'Missing description')
  }
}
