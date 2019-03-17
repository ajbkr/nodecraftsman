'use strict'

const { DBWrapper } = require('node-dbi')

const env = require('./env')
const dbOptions = require('../../database.json')[env]

let dbWrapper
if (dbOptions.driver === 'sqlite3') {
  dbWrapper = new DBWrapper('sqlite3', { path: dbOptions.filename })
} else if (dbOptions.driver === 'mysql') {
  dbWrapper = new DBWrapper('mysql', {
    host: dbOptions.host,
    user: dbOptions.user,
    password: dbOptions.password,
    database: dbOptions.database
  })
} else {
  throw new Error('No suitable databse config found')
}

dbWrapper.connect()

module.exports = dbWrapper
