'use strict'

const { MongoClient } = require('mongodb')

MongoClient.connect(
  'mongodb://127.0.0.1:27017/accounting',
  // eslint-disable-next-line
  (err, connection) => {
    const collection = connection.collection('customers')

    // eslint-disable-next-line
    collection.ensureIndex('v', (err, indexName) => {
      connection.close()
    })
  }
)
