expect = require('chai').expect
sinon = require('sinon')
request = require('supertest')
validar = require('./utils').validar

app = require('../app')
dump = require('./db/dump')
URL_DB = require('./config').URL_DB
db = require('./db')
modelos = require('./db').modelos()