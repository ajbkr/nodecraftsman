'use strict'

const { MongoClient } = require('mongodb')

MongoClient.connect(
  'mongodb://127.0.0.1:27017/accounting',
  // eslint-disable-next-line
  (err, connection) => {
    const collection = connection.collection('customers')

    collection.find(
      { v: { '$gt': 5 } },
      {
        limit: 10,
        skip: 100000,
        sort: 'v'
      }
      // eslint-disable-next-line
    ).toArray((err, documents) => {
      console.dir(documents)
      connection.close()
    })
  }
)
