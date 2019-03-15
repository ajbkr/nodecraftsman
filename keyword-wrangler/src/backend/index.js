'use strict'

const { Percolator } = require('percolator')

const dbSession = require('../../src/backend/db-session')

const port = 3000
const server = Percolator({ port, autoLink: false })

server.route('/api/keywords', {
  GET: (req, res) => {
    dbSession.fetchAll('SELECT id, value, categoryID FROM keyword ORDER BY id',
      (err, rows) => {
        if (err) {
          console.log(err)
          res.status.internalServerError(err)
        } else {
          res.collection(rows).send()
        }
      }
    )
  }
})

server.listen(_ => {
  console.log(`Server started and listening on port ${port}...`)
})
