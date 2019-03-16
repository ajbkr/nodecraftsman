/* global afterEach, beforeEach, describe, expect, it */
'use strict'

const async = require('async')
const request = require('request')

const dbSession = require('../../src/backend/db-session')
const resetDatabase = require('../reset-database')
const { Server } = require('../../src/backend/server')

describe('The API', _ => {
  let server

  beforeEach(function (done) {
    server = Server(3001)
    server.listen(err => {
      resetDatabase(dbSession, _ => {
        done(err)
      })
    })
  })

  afterEach(function (done) {
    server.close(_ => {
      resetDatabase(dbSession, _ => {
        done()
      })
    })
  })

  it('should respond to a GET request at /api/keywords/', done => {
    const expected = {
      _items: [{
        categoryID: 1,
        id: 1,
        value: 'Aubergine'
      }, {
        categoryID: 1,
        id: 2,
        value: 'Onion'
      }, {
        categoryID: 2,
        id: 3,
        value: 'Knife'
      }]
    }

    async.series([
      callback => {
        dbSession.insert('keyword', { value: 'Aubergine', categoryID: 1 },
          err => { callback(err) })
      },
      callback => {
        dbSession.insert('keyword', { value: 'Onion', categoryID: 1 },
          err => { callback(err) })
      },
      callback => {
        dbSession.insert('keyword', { value: 'Knife', categoryID: 2 },
          err => { callback(err) })
      }
      // eslint-disable-next-line
    ], (err, results) => {
      if (err) {
        throw err
      }

      request.get({
        json: true,
        url: `http://localhost:${server.options.port}/api/keywords/`
        // eslint-disable-next-line
      }, (err, res, body) => {
        expect(res.statusCode).toBe(200)
        expect(body).toEqual(expected)
        done()
      })
    })
  })
})
