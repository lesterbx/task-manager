import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import axios from 'axios';
import PouchDB from 'pouchdb';
import { db as dbconfig } from '../src/config';
import { promisifyValidator, workspaceNotExist } from '../src/utils/index';
import { validateWorkspace } from '../src/utils/validators/index';

const app = express()
app.use(cors())
app.use(bodyParser.json({ limit: '50mb' }))

const dbhost = `${dbconfig.protocol}://${dbconfig.user}:${dbconfig.password}@${dbconfig.host}:${dbconfig.port}`
const usersDB = new PouchDB(`${dbhost}/_users`)
app.post('/create', ({ body }, res) => {
  console.log('Create request')
  const newDB = new PouchDB(`${dbhost}/${body._id}`)
  promisifyValidator(validateWorkspace, body)
    .then(() => workspaceNotExist(dbhost, body._id))
    .then(() => newDB.put({ type: 'workspace_info', ...body }))
    .then(() => {
      let userAdditions = []
      body.users.forEach((user) => {
        userAdditions.push(addWorkspaceToUserFile(user, body._id))
      })
      return Promise.all(userAdditions)
    })
    .then(() => { res.status(200).end() })
    .catch(error => {
      console.log(error)
      if (error.name === 'illegal_database_name') {
        res.status(400).end(JSON.stringify({ reason: 'Invalid name or id' }))
      } else {
        res.status(400).end(JSON.stringify({ reason: error.reason }))
      }
    })
})

const addWorkspaceToUserFile = (email, workspaceID) => {
  return usersDB.get('org.couchdb.user:' + email)
    .then((user) => usersDB.put({ ...user, workspaces: [...user.workspaces, workspaceID] }))
}

app.listen(3000, () => console.log('Listening on port 3000!'))