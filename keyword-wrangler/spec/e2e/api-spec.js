/* global describe, expect, it */
'use strict'

const async = require('async')
const request = require('request')

const dbSession = require('../../src/backend/db-session')
const resetDatabase = require('../reset-database')

describe('The API', _ => {
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
        resetDatabase(dbSession, callback)
      },
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
      request.get({
        json: true,
        url: 'http://localhost:3000/api/keywords/'
        // eslint-disable-next-line
      }, (err, res, body) => {
        expect(res.statusCode).toBe(200)
        expect(body).toEqual(expected)
        done()
      })
    })
  })
})
