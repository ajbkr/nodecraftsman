'use strict'

const { MongoClient } = require('mongodb')

MongoClient.connect(
  'mongodb://127.0.0.1:27017/accounting',
  // eslint-disable-next-line
  (err, connection) => {
    const collection = connection.collection('customers')

    const doInsert = i => {
      if (i < 200000) {
        const value = Math.floor(Math.random() * 10)
        collection.insert(
          { n: `#${i}`, v: value },
          // eslint-disable-next-line
          (err, count) => {
            doInsert(i + 1)
          }
        )
      } else {
        connection.close()
      }
    }

    doInsert(0)
  }
)
