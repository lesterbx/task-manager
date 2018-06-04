const axios = require('axios')
const promisifyValidator = (validator, doc) => {
  return new Promise((resolve, reject) => {
    try {
      validator(doc)
      return resolve()
    } catch (e) {
      return reject({ reason: e.forbidden })
    }
  })
}
const workspaceNotExist = (dbhost, id) => {
  return new Promise((resolve, reject) => {
    axios.get(`${dbhost}/${id}`)
      .then(() => reject({ reason: 'The workspace ID is already taken' }))
      .catch(({ response }) => response.data.error === 'not_found' ? resolve() : reject(response.data.error))
  })
}
const URL = (config) => {
  return `${config.protocol}://${config.host}:${config.port}`
}
const arr2obj = (array) => {
  return array.reduce((acc, el) => ({...acc, [el._id]: el}), {})
}

const removeFromArray = (arr, element) => {
  return arr.slice(0, arr.indexOf(element)).concat(arr.slice(arr.indexOf(element) + 1, arr.length))
}

const updateDocsPositions = ({ docs, oldPosition, newPosition }) => {
  return docs.filter(({ position }) => (newPosition < oldPosition)
    ? (position >= newPosition && position < oldPosition)
    : (position <= newPosition && position > oldPosition)
  ).map((doc) => ({
    ...doc,
    timestamp: Date.now(),
    position: (newPosition < oldPosition)
      ? doc.position + 1
      : doc.position - 1
  }))
}

export { promisifyValidator }
export { workspaceNotExist }
export { URL }
export { arr2obj }
export { removeFromArray }
export { updateDocsPositions }
