'use strict'

const request = require('request')

describe('The API', _ => {
  it('should just work', done => {
    request.get({
      json: true,
      url: 'http://localhost:3000/api/keywords/'
    }, (err, res, body) => {
      expect(res.statusCode).toBe(200)
      expect(body.foo).toEqual('bar')
      done()
    })
  })
})
