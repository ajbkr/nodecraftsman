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
      // eslint-disable-next-line handle-callback-err
    ], (err, results) => {
      if (err) {
        throw err
      }

      request.get({
        json: true,
        url: `http://localhost:${server.options.port}/api/keywords/`
        // eslint-disable-next-line handle-callback-err
      }, (err, res, body) => {
        expect(res.statusCode).toBe(200)
        expect(body).toEqual(expected)
        done()
      })
    })
  })

  it('should respond to a GET request at /api/keywords/categories/', done => {
    const expected = {
      _items: [{
        id: 1,
        name: 'Vegetable'
      }, {
        id: 2,
        name: 'Utility'
      }]
    }

    async.series([
      callback => {
        resetDatabase(dbSession, callback)
      },
      callback => {
        dbSession.insert(
          'category',
          { name: 'Vegetable' },
          err => {
            callback(err)
          }
        )
      },
      callback => {
        dbSession.insert(
          'category',
          { name: 'Utility' },
          err => {
            callback(err)
          }
        )
      }
    ], (err, results) => {
      if (err) {
        throw (err)
      }
      request.get({
        json: true,
        url: 'http://localhost:3001/api/keywords/categories/'
      },
      // eslint-disable-next-line handle-callback-err
      (err, res, body) => {
        expect(res.statusCode).toBe(200)
        expect(body).toEqual(expected)
        done()
      })
    })
  })

  it('should create a new keyword when receiving a POST request at /api/keywords/', done => {
    const expected = {
      _items: [{
        categoryID: 1,
        id: 1,
        value: 'Aubergine'
      }, {
        categoryID: 1,
        id: 2,
        value: 'Onion'
      }]
    }

    const body = {
      categoryID: 1,
      value: 'Onion'
    }

    async.series([
      callback => {
        dbSession.insert(
          'category',
          { name: 'Vegetable' },
          err => {
            callback(err)
          }
        )
      },
      callback => {
        dbSession.insert(
          'keyword',
          { categoryID: 1, value: 'Aubergine' },
          err => {
            callback(err)
          }
        )
      }
    ], (err, results) => {
      if (err) {
        throw err
      }
      request.post({
        body,
        json: true,
        url: 'http://localhost:3001/api/keywords/'
      }, (err, res, body) => {
        if (err) {
          throw err
        }
        expect(res.statusCode).toBe(200)
        request.get({
          json: true,
          url: 'http://localhost:3001/api/keywords/'
          // eslint-disable-next-line handle-callback-err
        }, (err, res, body) => {
          expect(res.statusCode).toBe(200)
          expect(body).toEqual(expected)
          done()
        })
      })
    })
  })

  it('should update a keyword when receiving a POST request at /api/keywords/:id/', done => {
    const expected = {
      _items: [{
        categoryID: 2,
        id: 1,
        value: 'Onion'
      }]
    }

    const body = {
      categoryID: 2,
      id: 1,
      value: 'Onion'
    }

    async.series([
      callback => {
        dbSession.insert(
          'category',
          { name: 'Vegetable' },
          err => {
            callback(err)
          }
        )
      },
      callback => {
        dbSession.insert(
          'category',
          { name: 'Utility' },
          err => {
            callback(err)
          }
        )
      },
      callback => {
        dbSession.insert(
          'keyword',
          { value: 'Aubergine', categoryID: 1 },
          err => {
            callback(err)
          }
        )
      }
    ], (err, results) => {
      if (err) {
        throw err
      }
      request.post({
        body,
        json: true,
        url: 'http://localhost:3001/api/keywords/1'
      }, (err, res, body) => {
        if (err) {
          throw err
        }
        expect(res.statusCode).toBe(200)
        request.get({
          json: true,
          url: 'http://localhost:3001/api/keywords/'
          // eslint-disable-next-line handle-callback-err
        }, (err, res, body) => {
          expect(res.statusCode).toBe(200)
          expect(body).toEqual(expected)
          done()
        })
      })
    })
  })

  it('should remove a keyword when receiving a DELETE request at /api/keywords/:id/', done => {
    const expected = {
      _items: [{
        categoryID: 1,
        id: 1,
        value: 'Aubergine'
      }]
    }

    async.series([
      callback => {
        dbSession.insert(
          'category',
          { name: 'Vegetable' },
          err => {
            callback(err)
          }
        )
      },
      callback => {
        dbSession.insert(
          'keyword',
          { categoryID: 1, value: 'Aubergine' },
          err => {
            callback(err)
          }
        )
      },
      callback => {
        dbSession.insert(
          'keyword',
          { categoryID: 1, value: 'Onion' },
          err => {
            callback(err)
          }
        )
      }
    ], (err, results) => {
      if (err) {
        throw err
      }
      request.del({
        json: true,
        url: 'http://localhost:3001/api/keywords/2/'
      }, (err, res, body) => {
        if (err) {
          throw err
        }
        request.get({
          json: true,
          url: 'http://localhost:3001/api/keywords/'
          // eslint-disable-next-line handle-callback-err
        }, (err, res, body) => {
          expect(res.statusCode).toBe(200)
          expect(body).toEqual(expected)
          done()
        })
      })
    })
  })
})
