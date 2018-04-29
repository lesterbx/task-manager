const PouchDB = require('pouchdb');

const couch = {
  protocol: 'http',
  host: 'localhost',
  port: '5984',
  user: 'lester',
  pass: 'mono12'
}

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordRegex = /^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z.,-_]{6,}$/;
const nameRegex = /^[a-zA-Z]+$/;

const usersDB = () => {
  return new PouchDB(`${couch.protocol}://${couch.user}:${couch.pass}@${couch.host}:${couch.port}/_users`);
}

const validEmail = (email) => {
  return emailRegex.test(email);
}

const validPassword = (password) => {
  return passwordRegex.test(password);
}

const validName = (name) =>{
  return nameRegex.test(name);
}

const emptyField = (field) => {
  return field === undefined || field === '';
}

const emailExists = (email) => {
  return usersDB().get(`org.couchdb.user:${email}`)
    .then((user) => Promise.resolve(true))
    .catch((user) => Promise.resolve(false))
}

const rejectRequest = (res) => (message) => {
  res.status(400).end(message);
}

const validateNewAccount = ({ body }, res, next) => {
  const reject = rejectRequest(res);
  if (emptyField(body.first_name)) {
    reject('Missing first name');
  } else if (emptyField(body.last_name)) {
    reject('Missing last name');
  } else if (emptyField(body.email)) {
    reject('Missing email');
  } else if (emptyField(body.password)) {
    reject('Missing password');
  } else if (!validName(body.first_name)) {
    reject('The first name can only contain letters');
  } else if (!validName(body.last_name)) {
    reject('The last name can only contain letters');
  } else if (!validEmail(body.email)) {
    reject('The email format is not valid');
  } else if (!validPassword(body.password)) {
    reject('The password must be 6 characters long, can contain only letters, numbers and \'.\' \'_\' \'-\' \',\'. It needs at least one number');
  }else{
    emailExists(body.email).then((exists) => {
      if (exists) {
        reject('The email already belongs to some user');
      } else {
        next()
      }
    })
  }
}

const saveNewAccount = ({ body }, res) => {
  usersDB().put({
    _id: `org.couchdb.user:${body.email}`,
    name: body.email,
    first_name: body.first_name,
    last_name: body.last_name,
    password: body.password,
    type: 'user',
    roles: ['user']
  })
    .then(() => res.status(200).end('ok'))
    .catch((error) => {
      console.error(error)
      res.status(500).end('Error creating the account, try again later')
    })
}
module.exports.validateNewAccount = validateNewAccount;
module.exports.saveNewAccount = saveNewAccount;