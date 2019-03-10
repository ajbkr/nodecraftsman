'use strict'

const async = require('async')
const request = require('request')

function getUserName (callback) {
  request.get(
    'http://localhost:3000/getUserName?id=1234',
    (err, res, body) => {
      const result = JSON.parse(body)
      callback(err, result.value)
    }
  )
}

function getUserStatus (callback) {
  request.get(
    'http://localhost:3000/getUserStatus?id=1234',
    (err, res, body) => {
      const result = JSON.parse(body)
      callback(err, result.value)
    }
  )
}

async.parallel([getUserName, getUserStatus], (err, results) => {
  if (err) {}
  const name = results[0]
  const status = results[1]

  console.log(`The status of user ${name} is ${status}`)
})
