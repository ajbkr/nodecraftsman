'use strict'

const async = require('async')

const env = require('../src/backend/env')
const dbOptions = require('../database.json')[env]

function resetDatabase (dbSession, callback) {
  if (dbOptions.driver === 'sqlite3') {
    async.series([
      callback => {
        dbSession.remove('keyword', '1', err => {
          callback(err)
        })
      },
      callback => {
        dbSession.remove('category', '1', err => {
          callback(err)
        })
      },
      callback => {
        dbSession.remove('sqlite_sequence', '1', err => {
          callback(err)
        })
      }
    ], (err, results) => {
      callback(err)
    })
  } else if (dbOptions.driver === 'mysql') {
    async.series([
      callback => {
        dbSession.query('TRUNCATE keyword', [], err => {
          callback(err)
        })
      },
      callback => {
        dbSession.query('TRUNCATE categry', [], err => {
          callback(err)
        })
      }
    ], (err, results) => {
      callback(err)
    })
  }
}

module.exports = resetDatabase
