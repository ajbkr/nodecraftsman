'use strict'

const { DBWrapper } = require('node-dbi')

const dbWrapper = new DBWrapper('sqlite3', {
  path: '/var/tmp/keyword-wrangler.test.sqlite'
})

dbWrapper.connect()

module.exports = dbWrapper
