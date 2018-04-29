import PouchDB from 'pouchdb'
import PouchAuth from 'pouchdb-authentication'
PouchDB.plugin(PouchAuth)

export default {
  AUTH_HOST: 'http://localhost:3000',
  DB_HOST: 'http://localhost:5984',
  authDB: new PouchDB('http://127.0.0.1:5984/_users'),
  dbs: [],
  workspaces: {}
}
