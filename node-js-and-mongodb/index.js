'use strict'

const { MongoClient } = require('mongodb')

MongoClient.connect(
  'mongodb://127.0.0.1:27017/accounting',
  // eslint-disable-next-line
  (err, connection) => {
    const collection = connection.collection('customers')

    const doFind = callback => {
      // eslint-disable-next-line
      collection.find({ v: { '$lt': 8 } }).toArray((err, documents) => {
        console.dir(documents)
        callback()
      })
    }

    const doInsert = i => {
      if (i < 20) {
        const value = Math.floor(Math.random() * 10)
        collection.insert(
          { n: `#${i}`, v: value },
          // eslint-disable-next-line
          (err, count) => {
            doInsert(i + 1)
          }
        )
      } else {
        console.log()
        console.log(`Inserted ${i} documents`)
        doFind(_ => {
          doUpdate()
        })
      }
    }

    const doUpdate = _ => {
      collection.update(
        { v: { '$gt': 5 } },
        { '$set': { valuable: true } },
        { multi: true },
        // eslint-disable-next-line
        (err, count) => {
          console.log()
          console.log(`Updated ${count} documents`)
          doFind(_ => {
            collection.remove({}, _ => {
              connection.close()
            })
          })
        }
      )
    }

    doInsert(0)
  }
)
