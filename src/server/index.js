const express = require('express');
const app = express();
var bodyParser = require('body-parser')
const accounts = require('./accounts');
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());    
app.use(bodyParser.urlencoded({ extended: true })); 

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  next();
});

app.post('/account', accounts.validateNewAccount, accounts.saveNewAccount);

app.listen(3000, () => { console.log('Server running on *:' + PORT) })