'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _Promise = _interopDefault(require('babel-runtime/core-js/promise'));
var _toConsumableArray = _interopDefault(require('babel-runtime/helpers/toConsumableArray'));
var _JSON$stringify = _interopDefault(require('babel-runtime/core-js/json/stringify'));
var _extends = _interopDefault(require('babel-runtime/helpers/extends'));
var express = _interopDefault(require('express'));
var cors = _interopDefault(require('cors'));
var bodyParser = _interopDefault(require('body-parser'));
require('axios');
var PouchDB = _interopDefault(require('pouchdb'));

var db = {
  protocol: 'http',
  host: 'localhost',
  port: 5984,
  user: 'lester',
  password: 'mono12'
};

var axios$1 = require('axios');
function promisifyValidator(validator, doc) {
  return new _Promise(function (resolve, reject) {
    try {
      validator(doc);
      return resolve();
    } catch (e) {
      return reject({ reason: e.forbidden });
    }
  });
}
function workspaceNotExist(dbhost, id) {
  return new _Promise(function (resolve, reject) {
    axios$1.get(dbhost + '/' + id).then(function () {
      return reject({ reason: 'The workspace ID is already taken' });
    }).catch(function (_ref) {
      var response = _ref.response;
      return response.data.error === 'not_found' ? resolve() : reject(response.data.error);
    });
  });
}

/* eslint-disable */

/* eslint-disable */
function validateWorkspace (newDoc, savedDoc) {
  if (!newDoc._deleted) {
    var required = function required(field, message) {
      if (!newDoc[field] || newDoc[field] === '') {
        throw { forbidden: message };
      }
    };

    required('title', 'Missing title');
    required('users', 'Missing users');
    required('picture', 'Missing picture');
    required('description', 'Missing description');
  }
}

var app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

var dbhost = db.protocol + '://' + db.user + ':' + db.password + '@' + db.host + ':' + db.port;
var usersDB = new PouchDB(dbhost + '/_users');
app.post('/create', function (_ref, res) {
  var body = _ref.body;

  console.log('Create request');
  var newDB = new PouchDB(dbhost + '/' + body._id);
  promisifyValidator(validateWorkspace, body).then(function () {
    return workspaceNotExist(dbhost, body._id);
  }).then(function () {
    return newDB.put(_extends({ type: 'workspace_info' }, body));
  }).then(function () {
    var userAdditions = [];
    body.users.forEach(function (user) {
      userAdditions.push(addWorkspaceToUserFile(user, body._id));
    });
    return _Promise.all(userAdditions);
  }).then(function () {
    res.status(200).end();
  }).catch(function (error) {
    console.log(error);
    if (error.name === 'illegal_database_name') {
      res.status(400).end(_JSON$stringify({ reason: 'Invalid name or id' }));
    } else {
      res.status(400).end(_JSON$stringify({ reason: error.reason }));
    }
  });
});

var addWorkspaceToUserFile = function addWorkspaceToUserFile(email, workspaceID) {
  return usersDB.get('org.couchdb.user:' + email).then(function (user) {
    return usersDB.put(_extends({}, user, { workspaces: [].concat(_toConsumableArray(user.workspaces), [workspaceID]) }));
  });
};

app.listen(3000, function () {
  return console.log('Listening on port 3000!');
});
