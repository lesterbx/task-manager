const axios = require('axios')
function promisifyValidator (validator, doc) {
  return new Promise((resolve, reject) => {
    try {
      validator(doc)
      return resolve()
    } catch (e) {
      return reject({ reason: e.forbidden })
    }
  })
}
function workspaceNotExist (dbhost, id) {
  return new Promise((resolve, reject) => {
    axios.get(`${dbhost}/${id}`)
      .then(() => reject({ reason: 'The workspace ID is already taken' }))
      .catch(({ response }) => response.data.error === 'not_found' ? resolve() : reject(response.data.error))
  })
}
function URL (config) {
  return `${config.protocol}://${config.host}:${config.port}`
}
export { promisifyValidator }
export { workspaceNotExist }
export { URL }
